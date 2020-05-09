import { Component, OnInit, Input } from '@angular/core';
// import { DbService } from 'ng-src/app/services/db.service';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  detailsString = '';

  constructor() { }

  ngOnInit() {
  }

  setDetails(keyObject: any) {
    console.log('key object', keyObject);

    try {
      (window as any).electron.ipcRenderer.invoke('get-details-json', keyObject)
        .then((res: any) => {
          this.detailsString = JSON.stringify(JSON.parse(res.json), null, 2);
        });
    } catch (err) {
      console.log(err);
    }
  }
}
