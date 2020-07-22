import { Component, OnInit, Input } from '@angular/core';
import { ElectronService } from 'ng-src/app/services/electron.service';
import { getAllKanjiReadingPairs } from 'lib/dict-processor';
import { getEntity } from 'lib/dict-processor';
import * as c from 'lib/const';

import { JMdict, JapaneseDB, JMnedict } from 'japanese-db';
import { getJMdictJsonsRows, getJMnedictJsonsRows, getDictIndexRows } from 'src/main/db';
import { DictSource } from 'types/bon-jisho';
import { DictIndexRow } from 'japanese-db/lib/types/japanesedb';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  alternatives: DictIndexRow[] = [];
  detailsString: string = '';
  dictIndexRow: JapaneseDB.DictIndexRow = null;
  searchResult: JapaneseDB.DictIndexRow[] = [];

  detailsObjJMdict: JMdict.entry = null;
  detailsObjJMnedict: JMnedict.entry = null;

  sameKanjiSameReading: JapaneseDB.DictIndexRow[] = [];
  sameKanji: JapaneseDB.DictIndexRow[] = [];

  dictSource: DictSource;

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
    console.log('entry-details > init');
  }

  resetDetails() {
    this.alternatives = [];
    this.detailsString = '';
    this.detailsObjJMdict = null;
    this.detailsObjJMnedict = null;
    this.dictIndexRow = null;
    this.searchResult = [];
    this.sameKanjiSameReading = [];
    this.sameKanji = [];
  }

  async setDetails(selectedItem: JapaneseDB.DictIndexRow, searchResult: JapaneseDB.DictIndexRow[]) {
    this.resetDetails();

    this.dictIndexRow = selectedItem;
    this.searchResult = searchResult;

    console.log('entry-details > dictIndexRow', this.dictIndexRow);
    console.log('entry-details > searchResult', this.searchResult);

    if (this.dictIndexRow.source === 1) {
      this.dictSource = c.JMDICT;
    } else if (this.dictIndexRow.source === 2) {
      this.dictSource = c.JMNEDICT;
    } else {
      throw new Error('Wrong Dict Source');
    }

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

    this.sameKanjiSameReading = this.searchResult.filter(
      (value) =>
        value.kanji === this.dictIndexRow.kanji
        && value.reading === this.dictIndexRow.reading
        && value.id !== this.dictIndexRow.id
    );

    this.sameKanji = this.searchResult.filter(
      (value) =>
        value.kanji === this.dictIndexRow.kanji
        && value.reading !== this.dictIndexRow.reading
        && value.id !== this.dictIndexRow.id
    );
  }
}
