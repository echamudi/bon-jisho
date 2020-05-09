import { Component, OnInit, Input } from '@angular/core';
// import { DbService } from 'ng-src/app/services/db.service';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  detailsString = '';
  detailsObj: any = null;
  dictIndexRow: any = null;

  constructor() { }

  ngOnInit() {
  }

  setDetails(dictIndexRow: object) {
    console.log('key object', dictIndexRow);
    this.dictIndexRow = dictIndexRow;

    try {
      (window as any).electron.ipcRenderer.invoke('get-details-json', dictIndexRow)
        .then((res: any) => {
          this.detailsObj = JSON.parse(res.json);
          this.detailsString = JSON.stringify(this.detailsObj, null, 2);
        });
    } catch (err) {
      console.log(err);
    }
  }
}
