import { Component, OnInit, Input } from '@angular/core';
import { Router, Params, ActivatedRouteSnapshot } from '@angular/router';
import { JMdict, JapaneseDB, JMnedict } from 'japanese-db';

import { ElectronService } from 'App/modules/shared/services/electron.service';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';

import { c } from 'Lib/const';
import { isPlace, getTagDescription } from 'Lib/entities';
import { getEntryDetailsUrl } from 'Lib/url-generator';

import { DictSource, EntryDetailsQuery, EntryDetailsHistory, JMDetailsQuery, KanjidicQuery } from 'Types/bon-jisho';
import { StatesService } from '../shared/services/states.service';
import { UnderscoreService } from '../shared/services/underscore.service';

type Mode =
  'window' // The component is used using direct router, e.g. /#/entry-details/?source=...
  | 'word-search' // opened in word search menu
  | 'other'; // The component is used in other ways

/**
 * JMdict or JMnedict entry viewer
 */
@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  history: EntryDetailsHistory;

  /**
   * Current keyword.
   * If the row has kanji, it will use it. Otherwise, it will use the reading.
   */
  keyword: string = '';

  alternatives: JapaneseDB.DictIndexRow[] | null = null;

  /** JMdict/JMnedict/kanjidic json string */
  detailsString: string = '';
  dictIndexRow: JapaneseDB.DictIndexRow | null = null;

  detailsObjJMdict: JMdict.entry | null = null;
  detailsObjJMnedict: JMnedict.entry | null = null;
  detailsObjKanjidic: JapaneseDB.KanjidicRow | null = null;

  /** All kanji readings, for kanjidic mode only */
  kanjiReadings: { on: string[], kun: string[], nanori: string[] } | null = null;
  /** kanjidic only, if kanji not found */
  kanjiNotFound: boolean | null = null;

  sameKanji: JapaneseDB.DictIndexRow[] | null  = [];

  dictSource: DictSource | null = null;

  rendering: boolean = false;

  hasKanji: boolean = true;

  @Input()
  compMode: string | undefined;

  /** Component usage mode */
  mode: Mode | null = null;

  /**
   * For easter egg, showing raw json
   */
  exploreClickCount: number = 0;

  constructor(private electronService: ElectronService,
    private _: UnderscoreService,
    private router: Router,
    private statesService: StatesService) {

    // Prepare history stack
    this.history = {
      stack: [null],
      pointer: 0,
    };
  }

  isPlace = isPlace;
  getTagDescription = getTagDescription;

  toggleMaximize = WindowHelper.toggleMaximize;

  ngOnInit(): void {
    console.log('entry-details > init');

    // Render the existing history
    // this.render(this.history.stack[this.history.pointer]);

    const routerSnapshot: ActivatedRouteSnapshot = this.router.routerState.snapshot.root.children[0];

    // Get entry details mode
    if (routerSnapshot.routeConfig?.path === 'entry-details') {
      this.mode = 'window';
    } else if (this.compMode === 'word-search') {
      this.mode = 'word-search';
    } else {
      this.mode = 'other'
    }

    // In windowed mode, parse URL parameters and open it
    if (this.mode === 'window') {
      const params: Params = routerSnapshot.queryParams;

      const source: string | undefined = params.source;
      const id: string | undefined = params.id;
      let kanji: string | null | undefined = params.kanji;
      const reading: string | undefined = params.reading;

      if (source === 'jmdict' && id && kanji && reading) {
        if (kanji === 'null') kanji = null;
        document.title = `Popup - ${kanji ?? reading}`;

        const input: JMDetailsQuery = {
          source: c.JMDICT,
          id: parseInt(id, 10),
          kanji,
          reading
        }

        this.open(input);
        return;
      }

      if (source === 'jmnedict' && id && kanji && reading) {
        if (kanji === 'null') kanji = null;
        document.title = `Popup - ${kanji ?? reading}`;

        const input: JMDetailsQuery = {
          source: c.JMNEDICT,
          id: parseInt(id, 10),
          kanji,
          reading
        }

        this.open(input);
        return;
      }

      if (source === 'kanjidic' && kanji) {
        document.title = `Popup - ${kanji}`;

        const input: KanjidicQuery = {
          source: c.KANJIDIC,
          kanji
        }

        this.open(input);
        return;
      }
    }
  }

  reset() {
    this.keyword = '';

    this.alternatives = null;

    this.detailsString = '';
    this.dictIndexRow = null;

    this.detailsObjJMdict = null;
    this.detailsObjJMnedict = null;
    this.detailsObjKanjidic = null;

    this.kanjiReadings = null;
    this.kanjiNotFound = false;

    this.sameKanji = null;
    this.hasKanji = false;
    this.dictSource = null;

    this.exploreClickCount = 0;
  }

  async open(input: EntryDetailsQuery) {
    // Reject open if it's the same as the current page
    if (this._.isEqual(input, this.history.stack[this.history.pointer]))
      return;

    // Increment pointer
    this.history.pointer += 1;

    // Splice to the last selection
    this.history.stack.splice(
      this.history.pointer,
      Infinity,
      input,
    );

    this.render(this.history.stack[this.history.pointer]);
    // console.log(this.history.pointer, this.history.stack);

    // Signal the search column to select the current word
    if (this.mode === 'word-search') {
      this.statesService.wordSearchSelection.next(input);
    }
  }

  async back() {
    // If it's the last element, don't go back
    if (this.history.pointer <= 1) return;

    // Decrement pointer
    this.history.pointer -= 1;

    const selectedQuery: EntryDetailsQuery = this.history.stack[this.history.pointer];

    this.render(selectedQuery);

    if (this.mode === 'word-search') {
      this.statesService.wordSearchSelection.next(selectedQuery);
    }
  }

  async forward() {
    // If it overflows, don't go forward
    if (this.history.pointer + 1
      === this.history.stack.length) return;

    // Increment pointer
    this.history.pointer += 1;

    const selectedQuery: EntryDetailsQuery = this.history.stack[this.history.pointer];

    this.render(selectedQuery);

    if (this.mode === 'word-search') {
      this.statesService.wordSearchSelection.next(selectedQuery);
    }
  }

  async render(input: EntryDetailsQuery) {
    this.reset();

    if (input === null) return;

    /**
     * If it's JMDICT
     */
    if (input.source === c.JMDICT) {
      this.dictSource = c.JMDICT;
      this.keyword = input.kanji ?? input.reading;

      if (typeof input.kanji === 'string') this.hasKanji = true;

      // Get dict index row from selection
      this.electronService.ipcRenderer
      .invoke('getDictIndexRow', { ...input })
      .then((dictIndexRow) => {
        this.dictIndexRow = dictIndexRow;
      });

      // Get JMdict json for the current id
      this.electronService.ipcRenderer
        .invoke('getJMdictJsonsRows', { entSeqs: [input.id] })
        .then((dictDetails) => {
          this.detailsObjJMdict = dictDetails[0]?.json;
          this.detailsString = JSON.stringify(this.detailsObjJMdict, null, 2);
        });

      // Get alternatives
      this.electronService.ipcRenderer
        .invoke('getDictIndexRows', { column: 'id', keyword: input.id.toString() })
        .then((alternatives) => {
          this.alternatives = alternatives;
        });

      // For explore section, filter similar results
      if (input.kanji !== null) {
        this.electronService.ipcRenderer
          .invoke('getDictIndexRows', { column: 'kanji-exact', keyword: input.kanji })
          .then((searchKanjiResult) => {
            this.sameKanji = searchKanjiResult.filter((value) => value.id !== input.id);
          });
      } else {
        this.sameKanji = [];
      }

      return;
    }

    /**
     * If it's JMNedict
     */
    if (input.source === c.JMNEDICT) {
      this.dictSource = c.JMNEDICT;
      this.keyword = input.kanji ?? input.reading;

      if (typeof input.kanji === 'string') this.hasKanji = true;

      // Get dict index row from selection
      this.electronService.ipcRenderer
        .invoke('getDictIndexRow', { ...input })
        .then((dictIndexRow) => {
          this.dictIndexRow = dictIndexRow;
        });

      // Get JMnedict json for the current id
      this.electronService.ipcRenderer
        .invoke('getJMnedictJsonsRows', { entSeqs: [input.id] })
        .then((dictDetails) => {
          this.detailsObjJMnedict = dictDetails[0]?.json;
          this.detailsString = JSON.stringify(this.detailsObjJMnedict, null, 2);
        });

      return;
    }

    /**
     * If it's Kanjidic
     */
    if (input.source === c.KANJIDIC) {
      this.dictSource = c.KANJIDIC;
      this.keyword = input.kanji;

      (async () => {
        const kanjidicDetails = await this.electronService.ipcRenderer
          .invoke('getKanjidicRows', { kanjiChars: [this.keyword] });

        // If the requested kanji is not found
        if (kanjidicDetails.length === 0) {
          this.kanjiNotFound = true;
          return;
        }

        this.detailsObjKanjidic = kanjidicDetails[0];
        this.detailsString = JSON.stringify(kanjidicDetails[0], null, 2);

        const kanjiReadings: EntryDetailsComponent['kanjiReadings'] = {
          kun: [],
          nanori: [],
          on: []
        };

        kanjidicDetails[0].reading?.forEach((el) => {
          if (el.r_type === 'ja_on') kanjiReadings.on.push(el.$t);
          if (el.r_type === 'ja_kun') kanjiReadings.kun.push(el.$t);
        });
        kanjiReadings.nanori = kanjidicDetails?.[0]?.nanori ?? [];

        this.kanjiReadings = kanjiReadings;
      })();
    }

    return;
  }

  openWebBroser(url: string): void {
    this.electronService.ipcRenderer
      .invoke('openURL', { url })
  }

  exploreClick(): void {
    this.exploreClickCount += 1;
  }

  popupCurrent(): void {
    this.popup(this.history.stack[this.history.pointer]);
  }

  popup(edq: EntryDetailsQuery): void {
    const url = getEntryDetailsUrl(edq);

    console.log(url);

    if (url === null) return;

    this.electronService.ipcRenderer
      .invoke('open-url-electron', { url })
      .then(() => { });
  }

  /**
   * Returns true if copying the title is executed successfully
   */
  async copyTitle(): Promise<boolean> {
    const text = this.dictIndexRow?.kanji ?? this.dictIndexRow?.reading ?? null;

    if (text !== null) {
      return new Promise((resolve) => {
        navigator.clipboard.writeText(text).then(() => {
          resolve(true);
        }, () => {
          resolve(false);
        });
      })
    } else {
      return Promise.resolve(false);
    }
  }
}
