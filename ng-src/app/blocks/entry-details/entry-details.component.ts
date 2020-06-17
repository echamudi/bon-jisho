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

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
  }

  setDetails(dictIndexRow: JapaneseDB.DictIndexRow) {
    console.log('key object', dictIndexRow);
    this.dictIndexRow = dictIndexRow;

    try {
      (this.electronService.ipcRenderer
        .invoke(
          'getJMdictJsonsRows',
          {
            entSeqs: [this.dictIndexRow.id],
          }
        ) as ReturnType<typeof getJMdictJsonsRows>
      ).then((res) => {
        this.detailsObj = res[0].json;
        this.detailsString = JSON.stringify(this.detailsObj, null, 2);
        this.alternatives = getAllKanjiReadingPairs(this.detailsObj.k_ele, this.detailsObj.r_ele);

        console.log(this.alternatives);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
