import { Component, OnInit, ViewChild } from '@angular/core';
import { EntryDetailsComponent } from 'ng-src/app/blocks/entry-details/entry-details.component';
import { ElectronService } from 'ng-src/app/services/electron.service';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss']
})
export class BasicSearchComponent implements OnInit {

  keyword = '';
  list: {
    source: number,
    id: number,
    kanji: string,
    reading: string,
    pri_point: number,
    meaning: string
  }[] = [];
  selectedItem: object = {};

  @ViewChild('entryDetails', { static: false })
  entryDetails: EntryDetailsComponent;

  constructor(private electronService: ElectronService) { }

  ngOnInit() {
    // For testing purpose;
    this.keyword = '根本';
    this.search(this.keyword);
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

        const isKanji = currentKeyword.match(/[\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/) !== null;
        const isKana = currentKeyword.match(/[\u3040-\u309f\u30a0-\u30ff]/) !== null;

        let column: string;
        if (isKanji) column = 'kanji';
        else if (isKana) column = 'reading';
        else column = 'meaning';

        this.electronService.ipcRenderer.invoke('getDictIndexRows', {keyword: currentKeyword, column}).then((res: any) => {
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
