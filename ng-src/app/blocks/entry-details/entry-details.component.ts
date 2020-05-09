import { Component, OnInit, Input } from '@angular/core';
import { ElectronService } from 'ng-src/app/services/electron.service';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  detailsString = '';
  detailsObj: any = null;
  dictIndexRow: any = null;

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
  }

  setDetails(dictIndexRow: object) {
    console.log('key object', dictIndexRow);
    this.dictIndexRow = dictIndexRow;

    try {
      this.electronService.ipcRenderer.invoke('get-details-json', dictIndexRow)
        .then((res: any) => {
          this.detailsObj = JSON.parse(res.json);
          this.detailsString = JSON.stringify(this.detailsObj, null, 2);
        });
    } catch (err) {
      console.log(err);
    }
  }
}
