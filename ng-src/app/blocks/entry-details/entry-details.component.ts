import { Component, OnInit, Input } from '@angular/core';
import { ElectronService } from 'ng-src/app/services/electron.service';
import { getAllKanjiReadingPairs } from 'lib/dict-processor';
import { JMdict, JapaneseDB } from 'japanese-db';
import { getJMdictJsonsRows } from 'src/main/db';
import { KanjiReadingPairs } from 'types/bon-jisho';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  alternatives: KanjiReadingPairs;
  detailsString: string = '';
  detailsObj: JMdict.entry = null;
  dictIndexRow: JapaneseDB.DictIndexRow = null;
  searchResult: JapaneseDB.DictIndexRow[] = [];

  sameKanjiSameReading: JapaneseDB.DictIndexRow[] = [];
  sameKanji: JapaneseDB.DictIndexRow[] = [];

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
  }

  async setDetails() {
    console.log('entry-details > dictIndexRow', this.dictIndexRow);
    console.log('entry-details > searchResult', this.searchResult);

    const dictDetails = await this.electronService.ipcRenderer
      .invoke('getJMdictJsonsRows',
        {
          entSeqs: [this.dictIndexRow.id],
        }
      ) as ReturnType<typeof getJMdictJsonsRows>;

    this.detailsObj = dictDetails[0].json;
    this.detailsString = JSON.stringify(this.detailsObj, null, 2);
    this.alternatives = getAllKanjiReadingPairs(this.detailsObj.k_ele,
      this.detailsObj.r_ele);

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
