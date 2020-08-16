import { Component, OnInit, ViewChild } from '@angular/core';
import { EntryDetailsComponent } from '../entry-details/entry-details.component';
import { ElectronService } from '../../services/electron.service';
import { JapaneseDB } from 'japanese-db';

import { getDictIndexRows } from 'src/main/db';

@Component({
  selector: 'app-basic-search',
  templateUrl: './basic-search.component.html',
  styleUrls: ['./basic-search.component.scss']
})
export class BasicSearchComponent implements OnInit {

  keyword: string = '';
  list: JapaneseDB.DictIndexRow[] = [];

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

        (this.electronService.ipcRenderer
          .invoke(
            'getDictIndexRows',
            {
              keyword: currentKeyword,
              column,
            }
          ) as ReturnType<typeof getDictIndexRows>
        ).then((res) => {
          this.list = res;
        });
      }
    }, 200);
  }

  selectItem(item: JapaneseDB.DictIndexRow) {
    const selectedItem = {
      source: item.source,
      id: item.id,
      kanji: item.kanji ?? null,
      reading: item.reading
    };

    this.entryDetails.open(selectedItem);
  }
}
