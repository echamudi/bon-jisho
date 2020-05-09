import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'ng-src/app/services/db.service';

@Component({
  selector: 'app-entry-details',
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit {

  detailsString: string = '';

  constructor(private dbService: DbService) { }

  ngOnInit() {
  }

  async setDetails(keyObject: any) {
    try {
      let res = await this.dbService.getDetailsJson(keyObject);
      this.detailsString = JSON.stringify(JSON.parse(res['json']), null, 2);
    } catch (err) {
      console.log(err);
    }
  }
}
