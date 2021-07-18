import { Component, OnInit, ViewChild } from '@angular/core';
import { EntryDetailsComponent } from 'App/modules/entry-details/entry-details.component';
import { ElectronService } from 'App/modules/shared/services/electron.service';
import { JapaneseDB } from 'japanese-db';

import { UnderscoreService } from 'App/modules/shared/services/underscore.service';
import { EntryDetailsQuery, JMDetailsQuery } from 'Types/bon-jisho';
import { StatesService } from 'App/modules/shared/services/states.service';
import { c } from 'Lib/const';
// import { c } from 'Lib/const';

@Component({
  selector: 'app-main--search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  keyword: string = '';

  /** Inputted text contains at least one kanji? */
  isKanji: boolean = false;

  /**
   * All letters in keyword that are kanji
   */
  kanjiChars: string[] = [];

  list: JapaneseDB.DictIndexRow[] = [];

  @ViewChild('entryDetails', { static: false })
  entryDetails: EntryDetailsComponent | undefined;

  selectedItem: EntryDetailsQuery = null;

  isEqual: UnderscoreService['isEqual'];

  constructor(private electronService: ElectronService, private _: UnderscoreService, private statesService: StatesService) {
    this.isEqual = this._.isEqual;
    this.statesService.wordSearchSelectionObs.subscribe(el => {
      // console.log('now selected', el);
      this.selectedItem = el;
    });
  }

  ngOnInit() {
    // For testing purpose;
    this.keyword = '機';
    this.search(this.keyword);
  }

  search($event: string): void {
    const currentKeyword = $event;
    setTimeout(() => {
      if (currentKeyword.length === 0) {
        this.list = [];
        this.kanjiChars = [];
        return;
      }

      // This is done to prevent searching during typing
      if (currentKeyword === this.keyword) {
        // console.log('queried for', currentKeyword);

        /** Contains at least one kanji? */
        const isKanji = currentKeyword.match(/[\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/) !== null;
        this.isKanji = isKanji;

        /** Contains at least one kana? */
        const isKana = currentKeyword.match(/[\u3040-\u309f\u30a0-\u30ff]/) !== null;

        // Get all kanjis

        const kanjiChars = currentKeyword.match(/[\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g)?.map((val) => val) ?? [];
        this.kanjiChars = [...new Set(kanjiChars)];

        // Define which column

        let column: 'kanji' | 'reading' | 'meaning';
        if (isKanji) column = 'kanji';
        else if (isKana) column = 'reading';
        else column = 'meaning';

        this.electronService.ipcRenderer
          .invoke('getDictIndexRows', { keyword: currentKeyword, column }).then((res) => {
            this.list = res;
          });
      }
    }, 200);
  }

  selectItem(item: JapaneseDB.DictIndexRow | string): void {
    let selectedItem: EntryDetailsQuery;

    // If the user selects kanji search result
    if (typeof item === 'string') {
      selectedItem = {
        source: c.KANJIDIC,
        kanji: item,
      };

    // If the user selects word search result
    } else {
      selectedItem = {
        source: item.source,
        id: item.id,
        kanji: item.kanji ?? null,
        reading: item.reading
      };
    }

    // Disable reclick on the same item
    if (this._.isEqual(selectedItem, this.selectedItem)) {
      return;
    }

    if (this.entryDetails === undefined) {
      // console.log('Error: #entryDetails component is not found')
      return;
    }

    this.entryDetails.open(selectedItem);

    // Propagate selection
    // # commented to avoid double selection
    // this.statesService.wordSearchSelection.next(selectedItem);
  }

  entryDetailsQueryMaker(src: JapaneseDB.DictIndexRow): JMDetailsQuery {
    return {
      source: src.source,
      id: src.id,
      kanji: src.kanji ?? null,
      reading: src.reading
    };
  }
}
