import { Component, OnInit, Input } from '@angular/core';
import { Router, Params, ActivatedRouteSnapshot } from '@angular/router';
import { JMdict, JapaneseDB, JMnedict } from 'japanese-db';

import { getJMdictJsonsRows, getJMnedictJsonsRows, getDictIndexRows, getDictIndexRow } from 'Main/db';

import { ElectronService } from 'App/modules/shared/services/electron.service';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';

import { c } from 'Lib/const';
import { isPlace, getTagDescription } from 'Lib/entities';
import { getEntryDetailsUrl } from 'Lib/url-generator';

import { DictSource, EntryDetailsQuery, EntryDetailsHistory } from 'Types/bon-jisho';
import { StatesService } from '../shared/services/states.service';

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

  /** JMdict/JMnedict json string */
  detailsString: string = '';
  dictIndexRow: JapaneseDB.DictIndexRow | null = null;

  detailsObjJMdict: JMdict.entry | null = null;
  detailsObjJMnedict: JMnedict.entry | null = null;

  sameKanji: JapaneseDB.DictIndexRow[] | null  = [];

  dictSource: DictSource | null = null;

  rendering: boolean = false;

  @Input()
  compMode: string | undefined;

  /** Component usage mode */
  mode: Mode | null = null;

  /**
   * For easter egg
   */
  exploreClickCount: number = 0;

  constructor(private electronService: ElectronService, private router: Router, private statesService: StatesService) {
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

    const params: Params = routerSnapshot.queryParams;

    // Get entry details mode
    if (routerSnapshot.routeConfig?.path === 'entry-details') {
      this.mode = 'window';
    } else if (this.compMode === 'word-search') {
      this.mode = 'word-search';
    } else {
      this.mode = 'other'
    }

    if (params.source) {
      const source: string | undefined = params.source;
      const id: string | undefined = params.id;
      const kanji: string | undefined = params.kanji;
      const reading: string | undefined = params.reading;

      if (source === 'jmdict' && id && kanji && reading) {
        const input: EntryDetailsQuery = {
          source: c.JMDICT,
          id: parseInt(id, 10),
          kanji,
          reading
        }

        this.open(input);
        return;
      }

      if (source === 'jmnedict' && id && kanji && reading) {
        const input: EntryDetailsQuery = {
          source: c.JMNEDICT,
          id: parseInt(id, 10),
          kanji,
          reading
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

    this.sameKanji = null;

    this.dictSource = null;

    this.exploreClickCount = 0;
  }

  async open(input: EntryDetailsQuery) {
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

    if (this.mode === 'word-search') {
      this.statesService.wordSearchSelection.next(input);
    }
  }

  async back() {
    // If it's the last element, don't go back
    if (this.history.pointer <= 1) return;

    // Decrement pointer
    this.history.pointer -= 1;

    this.render(this.history.stack[this.history.pointer]);
  }

  async forward() {
    // If it overflows, don't go forward
    if (this.history.pointer + 1
      === this.history.stack.length) return;

    // Increment pointer
    this.history.pointer += 1;

    this.render(this.history.stack[this.history.pointer]);
  }

  async render(input: EntryDetailsQuery) {
    this.reset();

    if (input === null) return;

    this.keyword = input.kanji ?? input.reading;

    // Get dict index row from selection
    // this call is shared for both JMdict and JMnedict
    (this.electronService.ipcRenderer
      .invoke('getDictIndexRow', { ...input }
    ) as ReturnType<typeof getDictIndexRow>).then((dictIndexRow) => {
      this.dictIndexRow = dictIndexRow;
    });

    /**
     * If it's JMDICT
     */
    if (input.source === 1) {
      this.dictSource = c.JMDICT;

      // Get JMdict json for the current id
      (this.electronService.ipcRenderer
        .invoke('getJMdictJsonsRows', { entSeqs: [input.id] }
      ) as ReturnType<typeof getJMdictJsonsRows>).then((dictDetails) => {
        this.detailsObjJMdict = dictDetails[0]?.json;
        this.detailsString = JSON.stringify(this.detailsObjJMdict, null, 2);
      });

      // Get alternatives
      (this.electronService.ipcRenderer
        .invoke('getDictIndexRows', { column: 'id', keyword: input.id }
      ) as ReturnType<typeof getDictIndexRows>).then((alternatives) => {
        this.alternatives = alternatives;
      });

      // For explore section, filter similar results
      if (input.kanji !== null) {
        (this.electronService.ipcRenderer
          .invoke('getDictIndexRows', { column: 'kanji-exact', keyword: input.kanji }
        ) as ReturnType<typeof getDictIndexRows>).then((searchKanjiResult) => {
          this.sameKanji = searchKanjiResult.filter(
            (value) =>
              value.id !== input.id
          );
        });
      } else {
        this.sameKanji = [];
      }

      return;
    }

    /**
     * If it's JMNedict
     */
    if (input.source === 2) {
      this.dictSource = c.JMNEDICT;

      // Get JMnedict json for the current id
      (this.electronService.ipcRenderer
        .invoke('getJMnedictJsonsRows', { entSeqs: [input.id] }
      ) as ReturnType<typeof getJMnedictJsonsRows>).then((dictDetails) => {
        this.detailsObjJMnedict = dictDetails[0]?.json;
        this.detailsString = JSON.stringify(this.detailsObjJMnedict, null, 2);
      });

      return;
    }
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

    if (!(url ?? 0)) return;

    (this.electronService.ipcRenderer
      .invoke('open-url-electron', { url })).then(() => {
    });
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
