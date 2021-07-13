import { Component, OnInit } from '@angular/core';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';
import { ElectronService } from 'App/modules/shared/services/electron.service';
import { JapaneseDB } from 'japanese-db';
import { c } from 'Lib/const';
import { getEntryDetailsUrl } from 'Lib/url-generator';
import { getKanjiGroups } from 'Main/db';
import { EntryDetailsQuery } from 'Types/bon-jisho';

type Unpromise<T> = T extends Promise<infer U> ? U : T; // TODO: move this line out

type KanjiGroups = 'Kanji Kentei' | 'Old JLPT' | 'New JLPT' | 'Stroke Count' | 'Kanji Frequency';

type SelectedGroup = Array<{sectionName: string, kanjis: string[]}>;

@Component({
  selector: 'app-main--kanji-lists',
  templateUrl: './kanji-lists.component.html',
  styleUrls: ['./kanji-lists.component.scss']
})
export class KanjiListsComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  toggleMaximize = WindowHelper.toggleMaximize;

  rawGroups: Unpromise<ReturnType<typeof getKanjiGroups>> | null = null;
  selectedGroupName: KanjiGroups | 'loading' | undefined;
  selectedGroup: SelectedGroup | null = null;

  // Memos
  memoKanken: SelectedGroup | null = null;
  memoOldJlpt: SelectedGroup | null = null;
  memoNewJlpt: SelectedGroup | null = null;
  memoStrokeCount: SelectedGroup | null = null;
  memoKanjiFrequency: SelectedGroup | null = null;

  ngOnInit(): void {
  }

  async openList(tag: KanjiGroups): Promise<void> {
    // Reset selection
    this.selectedGroupName = 'loading';
    this.selectedGroup = null;

    // Use memo of raw groups
    if (this.rawGroups === null) {
      this.rawGroups = await this.electronService.ipcRenderer.invoke('getKanjiGroups');
    }

    // Use memo for selected group. Otherwise, build it
    if (tag === 'New JLPT' && this.memoNewJlpt === null) {
      const res: SelectedGroup = [
        { sectionName: 'N5', kanjis: [] },
        { sectionName: 'N4', kanjis: [] },
        { sectionName: 'N3', kanjis: [] },
        { sectionName: 'N2', kanjis: [] },
        { sectionName: 'N1', kanjis: [] },
      ]
      this.rawGroups.forEach((row) => {
        if (row.jlpt_new === 5) res[0].kanjis.push(row.literal);
        if (row.jlpt_new === 4) res[1].kanjis.push(row.literal);
        if (row.jlpt_new === 3) res[2].kanjis.push(row.literal);
        if (row.jlpt_new === 2) res[3].kanjis.push(row.literal);
        if (row.jlpt_new === 1) res[4].kanjis.push(row.literal);
      });
      this.memoNewJlpt = res;
    } else if (tag === 'Old JLPT' && this.memoOldJlpt === null) {
      const res: SelectedGroup = [
        { sectionName: 'JLPT4', kanjis: [] },
        { sectionName: 'JLPT3', kanjis: [] },
        { sectionName: 'JLPT2', kanjis: [] },
        { sectionName: 'JLPT1', kanjis: [] },
      ]
      this.rawGroups.forEach((row) => {
        if (row.jlpt === 4) res[0].kanjis.push(row.literal);
        if (row.jlpt === 3) res[1].kanjis.push(row.literal);
        if (row.jlpt === 2) res[2].kanjis.push(row.literal);
        if (row.jlpt === 1) res[3].kanjis.push(row.literal);
      });
      this.memoOldJlpt = res;
    }

    if (tag === 'New JLPT') {
      this.selectedGroup = this.memoNewJlpt;
    } else if (tag === 'Old JLPT') {
      this.selectedGroup = this.memoOldJlpt;
    }

    // TODO: Add more groupings

    this.selectedGroupName = tag;
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

    const url = getEntryDetailsUrl(selectedItem);

    if (url === null) return;

    this.electronService.ipcRenderer
      .invoke('open-url-electron', { url })
      .then(() => { });
  }
}

// TODO: Add tests
