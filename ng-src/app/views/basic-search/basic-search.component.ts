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

  search($event) {
    const currentKeyword = $event;
    setTimeout(() => {
      if (currentKeyword.length === 0) {
        this.list = [];
        return;
      }

      // This is done to prevent searching during typing
      if (currentKeyword === this.keyword) {
        console.log('queried for', currentKeyword);
        (window as any).electron.ipcRenderer.invoke('get-bon-entries', currentKeyword).then((res: any) => {
          this.list = res;
        });
      }
    }, 200);
  }

  openDetails(item) {
    this.selectedItem = item;
    this.entryDetails.setDetails(item);
  }
}
