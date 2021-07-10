import { Component, OnInit } from '@angular/core';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';
import { ElectronService } from 'App/modules/shared/services/electron.service';
import { JapaneseDB } from 'japanese-db';
import { c } from 'Lib/const';
import { getEntryDetailsUrl } from 'Lib/url-generator';
import { EntryDetailsQuery } from 'Types/bon-jisho';

@Component({
  selector: 'app-main--vocabulary-lists',
  templateUrl: './vocabulary-lists.component.html',
  styleUrls: ['./vocabulary-lists.component.scss']
})
export class VocabularyListsComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  toggleMaximize = WindowHelper.toggleMaximize;

  list: JapaneseDB.DictIndexRow[] | null = null;

  ngOnInit(): void {
  }

  async openList(tag: string): Promise<void> {
    this.list = null;
    this.electronService.ipcRenderer.invoke('getWordsByTag', { tag }).then((res) => {
      this.list = res;
    });
  }

  selectItem(item: JapaneseDB.DictIndexRow | string): void {
    let selectedItem: EntryDetailsQuery;

    console.log('selectItem', item);

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

    const url = getEntryDetailsUrl(selectedItem);
    console.log('selectItem', url);

    if (url === null) return;

    this.electronService.ipcRenderer
      .invoke('open-url-electron', { url })
      .then(() => { });
  }
}

// TODO: Add tests
