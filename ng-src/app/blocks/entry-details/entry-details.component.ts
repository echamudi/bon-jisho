import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ElectronService } from 'ng-src/app/services/electron.service';
import { getAllKanjiReadingPairs } from 'lib/dict-processor';
import { getEntity } from 'lib/dict-processor';
import * as c from 'lib/const';

import { JMdict, JapaneseDB, JMnedict } from 'japanese-db';
import { getJMdictJsonsRows, getJMnedictJsonsRows, getDictIndexRows, getDictIndexRow } from 'src/main/db';
import { DictSource } from 'types/bon-jisho';
import { DictIndexRow } from 'japanese-db/lib/types/japanesedb';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  alternatives: DictIndexRow[] = [];

  /** JMdict/JMnedict json string */
  detailsString: string = '';
  dictIndexRow: JapaneseDB.DictIndexRow | null = null;

  detailsObjJMdict: JMdict.entry | null = null;
  detailsObjJMnedict: JMnedict.entry | null = null;

  sameKanjiSameReading: JapaneseDB.DictIndexRow[] = [];
  sameKanji: JapaneseDB.DictIndexRow[] = [];

  dictSource: DictSource | null;

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
    console.log('entry-details > init');
  }

  reset() {
    this.alternatives = [];

    this.detailsString = '';
    this.dictIndexRow = null;

    this.detailsObjJMdict = null;
    this.detailsObjJMnedict = null;

    this.sameKanjiSameReading = [];
    this.sameKanji = [];

    this.dictSource = null;
  }

  async set(input: {
    source: number,
    id: number,
    kanji: string | null,
    reading: string
  } | null) {
    this.reset();

    if (input === null) return;

    // Get dict index row from selection
    const dictIndexRow = await (this.electronService.ipcRenderer
      .invoke('getDictIndexRow', { ...input }
    ) as ReturnType<typeof getDictIndexRow>);

    this.dictIndexRow = dictIndexRow;


    if (this.dictIndexRow.source === 1) {
      this.dictSource = c.JMDICT;
    } else if (this.dictIndexRow.source === 2) {
      this.dictSource = c.JMNEDICT;
    } else {
      throw new Error('Wrong Dict Source');
    }

    // Get complete json depends on the source
    if (this.dictSource === c.JMDICT) {
      this.dictSource = c.JMDICT;
      const dictDetails = await (this.electronService.ipcRenderer
        .invoke('getJMdictJsonsRows', { entSeqs: [this.dictIndexRow.id] }
      ) as ReturnType<typeof getJMdictJsonsRows>);

      this.detailsObjJMdict = dictDetails[0]?.json;
      this.detailsString = JSON.stringify(this.detailsObjJMdict, null, 2);
      this.alternatives = await (this.electronService.ipcRenderer
        .invoke('getDictIndexRows', { column: 'id', keyword: this.dictIndexRow.id }
      ) as ReturnType<typeof getDictIndexRows>);
    } else if (this.dictSource === c.JMNEDICT) {
      this.dictSource = c.JMNEDICT;
      const dictDetails = await (this.electronService.ipcRenderer
        .invoke('getJMnedictJsonsRows', { entSeqs: [this.dictIndexRow.id] }
        ) as ReturnType<typeof getJMnedictJsonsRows>);

      this.detailsObjJMnedict = dictDetails[0]?.json;
      this.detailsString = JSON.stringify(this.detailsObjJMnedict, null, 2);
    }

    // Search again to get same kanji and same readings only if kanji exists
    if (input.kanji) {
      const searchResult = await (this.electronService.ipcRenderer
        .invoke('getDictIndexRows', { column: 'kanji', keyword: input.kanji }
      ) as ReturnType<typeof getDictIndexRows>);

      this.sameKanjiSameReading = searchResult.filter(
        (value) =>
          value.kanji === this.dictIndexRow?.kanji
          && value.reading === this.dictIndexRow.reading
          && value.id !== this.dictIndexRow.id
      );

      this.sameKanji = searchResult.filter(
        (value) =>
          value.kanji === this.dictIndexRow?.kanji
          && value.reading !== this.dictIndexRow.reading
          && value.id !== this.dictIndexRow.id
      );
    } else {
      // TODO: handle if it's reading only without kanji
    }
  }
}
