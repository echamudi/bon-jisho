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

  list: JapaneseDB.DictIndexRow[] | 'loading' | null = null;
  nfGroups: ReadonlyArray<string> = [
    ...Array<string>(9).fill('nf').map((el, i) => el + '0' + (i + 1)),
    ...Array<string>(39).fill('nf').map((el, i) => el + (i + 10)),
  ];
  selectedGroupName: string | undefined;

  ngOnInit(): void {
  }

  async openList(tag: string): Promise<void> {
    this.list = 'loading';
    this.selectedGroupName = tag;
    this.electronService.ipcRenderer.invoke('getWordsByTag', { tag }).then((res) => {
      this.list = res;
    });
  }

  selectItem(item: JapaneseDB.DictIndexRow | string): void {
    let selectedItem: EntryDetailsQuery;

    // console.log('selectI tem', item);

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
    // console.log('selectItem', url);

    if (url === null) return;

    this.electronService.ipcRenderer
      .invoke('open-url-electron', { url })
      .then(() => { });
  }
}

// TODO: Add tests
