import { Component, OnInit, Input } from '@angular/core';
import { ElectronService } from 'ng-src/app/services/electron.service';
import { JMdictEntry } from 'ng-src/app/classes/jmdict-entry';
import { JMdict, JapaneseDB } from 'japanese-db-maker';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

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
      this.electronService.ipcRenderer.invoke('getDetailsJson', dictIndexRow)
        .then((res: any) => {
          this.detailsObj = JSON.parse(res.json);
          this.detailsString = JSON.stringify(this.detailsObj, null, 2);

          const obj = new JMdictEntry(this.detailsObj);
          obj.getAllKanjiReadingPairs();
        });
    } catch (err) {
      console.log(err);
    }
  }
}
