import { Component, OnInit, ViewChild } from '@angular/core';
import { EntryDetailsComponent } from 'App/modules/entry-details/entry-details.component';
import { ElectronService } from 'App/modules/shared/services/electron.service';
import { JapaneseDB } from 'japanese-db';

import { getDictIndexRows } from 'Main/db';
import { UnderscoreService } from 'App/modules/shared/services/underscore.service';
import { EntryDetailsQuery } from 'Types/bon-jisho';
import { StatesService } from 'App/modules/shared/services/states.service';

@Component({
  selector: 'app-main--search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  keyword: string = '';
  list: JapaneseDB.DictIndexRow[] = [];

  @ViewChild('entryDetails', { static: false })
  entryDetails: EntryDetailsComponent | undefined;

  selectedItem: EntryDetailsQuery = null;

  isEqual: UnderscoreService['isEqual'];

  constructor(private electronService: ElectronService, private _: UnderscoreService, private statesService: StatesService) {
    this.isEqual = this._.isEqual;
    this.statesService.wordSearchSelectionObs.subscribe(el => {
      this.selectedItem = el;
    });
  }

  ngOnInit() {
    // For testing purpose;
    this.keyword = '根本';
    this.search(this.keyword);
  }

  search($event: string): void {
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

  selectItem(item: JapaneseDB.DictIndexRow): void {
    const selectedItem: EntryDetailsQuery = this.entryDetailsQueryMaker(item);

    // Disable reclick on the same item
    if (this._.isEqual(selectedItem, this.selectedItem)) {
      return;
    }

    if (this.entryDetails === undefined) {
      console.log('Error: #entryDetails component is not found')
      return;
    }

    this.entryDetails.open(selectedItem);

    // Propagate selection
    this.statesService.wordSearchSelection.next(selectedItem);
  }

  entryDetailsQueryMaker(src: JapaneseDB.DictIndexRow): EntryDetailsQuery {
    return {
      source: src.source,
      id: src.id,
      kanji: src.kanji ?? null,
      reading: src.reading
    };
  }
}
