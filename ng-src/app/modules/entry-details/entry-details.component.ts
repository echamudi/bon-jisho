import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ElectronService } from '../shared/services/electron.service';
import * as c from 'lib/const';
import { getEntities, isPlace, getTagDescription } from 'lib/entities';

import { JMdict, JapaneseDB, JMnedict } from 'japanese-db';
import { getJMdictJsonsRows, getJMnedictJsonsRows, getDictIndexRows, getDictIndexRow } from 'src/main/db';
import { DictSource, EntryDetailsQuery, EntryDetailsHistory } from 'types/bon-jisho';
import { DictIndexRow } from 'japanese-db/lib/types/japanesedb';
import { WindowHelper } from '../main/classes/window-helper';
import { Router } from '@angular/router';

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

  alternatives: DictIndexRow[] = [];

  /** JMdict/JMnedict json string */
  detailsString: string = '';
  dictIndexRow: JapaneseDB.DictIndexRow | null = null;

  detailsObjJMdict: JMdict.entry | null = null;
  detailsObjJMnedict: JMnedict.entry | null = null;

  sameKanjiSameReading: JapaneseDB.DictIndexRow[] = [];
  sameKanji: JapaneseDB.DictIndexRow[] = [];

  dictSource: DictSource | null;

  /**
   * For easter egg
   */
  exploreClickCount: number = 0;

  constructor(private electronService: ElectronService, private router: Router) { }

  getEntities = getEntities;
  isPlace = isPlace;
  getTagDescription = getTagDescription;

  toggleMaximize = WindowHelper.toggleMaximize;

  ngOnInit() {
    console.log('entry-details > init');
    this.history = {
      stack: [null],
      pointer: 0,
    };

    // Render the existing history
    this.render(this.history.stack[this.history.pointer]);

    const params = this.router.parseUrl(this.router.url).queryParams;

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
      }
    }
  }

  reset() {
    this.keyword = '';

    this.alternatives = [];

    this.detailsString = '';
    this.dictIndexRow = null;

    this.detailsObjJMdict = null;
    this.detailsObjJMnedict = null;

    this.sameKanjiSameReading = [];
    this.sameKanji = [];

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
          this.sameKanjiSameReading = searchKanjiResult.filter(
            (value) =>
              value.reading === this.dictIndexRow?.reading
              && value.id !== this.dictIndexRow.id
          );
          this.sameKanji = searchKanjiResult.filter(
            (value) =>
              value.reading !== this.dictIndexRow?.reading
              && value.id !== this.dictIndexRow?.id
          );
        });
      } else {
        // TODO: handle if it's reading only without kanji
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

    return;
  }

  openWebBroser(url: string): void {
    this.electronService.ipcRenderer
      .invoke('openURL', { url })
  }

  exploreClick(): void {
    this.exploreClickCount += 1;
  }
}
