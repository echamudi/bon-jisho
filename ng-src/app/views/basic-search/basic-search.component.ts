import { Component, OnInit, ViewChild } from '@angular/core';
import { NodeService } from 'ng-src/app/services/node.service';
import { DbService } from 'ng-src/app/services/db.service';
import { EntryDetailsComponent } from 'ng-src/app/blocks/entry-details/entry-details.component';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss']
})
export class BasicSearchComponent implements OnInit {

  keyword = '';
  list: any[] = [];
  selectedItem: Object = {};

  @ViewChild('entryDetails', { static: false })
  entryDetails: EntryDetailsComponent;

  constructor(private nodeService: NodeService, private dbService: DbService) { }

  ngOnInit() {
  }

  search() {
    if (this.keyword.length > 0) {
      this.dbService.getBonEntries(this.keyword).then((res: any) => {
        this.list = res;
      });
    } else {
      this.list = [];
    }
  }

  openDetails(item) {
    this.selectedItem = item;
    this.entryDetails.setDetails(item);
  }
}
