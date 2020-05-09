import { Component, OnInit, ViewChild } from '@angular/core';
import { EntryDetailsComponent } from 'ng-src/app/blocks/entry-details/entry-details.component';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss']
})
export class BasicSearchComponent implements OnInit {

  keyword = '';
  list: any[] = [];
  selectedItem: object = {};

  @ViewChild('entryDetails', { static: false })
  entryDetails: EntryDetailsComponent;

  constructor() { }

  ngOnInit() {
  }

  search() {
    if (this.keyword.length > 0) {
      (window as any).electron.ipcRenderer.invoke('get-bon-entries', this.keyword).then((res: any) => {
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
