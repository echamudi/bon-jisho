import { Component, Input, OnInit } from '@angular/core';
import { ElectronService } from 'App/modules/shared/services/electron.service';
import { KanjivgTreeRow } from 'japanese-db/dist/commonjs/types/japanesedb';
import { KanjiQuickDataRow } from 'Main/db';

@Component({
  selector: 'app-entry-details--kanji-tree',
  templateUrl: './kanji-tree.component.html',
  styleUrls: ['./kanji-tree.component.scss']
})
export class KanjiTreeComponent implements OnInit {

  @Input() kanjiTree: KanjivgTreeRow['tree_json'] | undefined;

  // If the component is recursive element
  @Input() child: boolean | undefined;

  @Input() kanjiQuickInfo: Record<string, KanjiQuickDataRow> | undefined;

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {
    // Gather all characters in a tree, and get quick data only in parent element
    if (!this.child) {
      let allChars: string[] = [];
      if (this.kanjiTree) allChars = this.getAllChars(this.kanjiTree);

      this.electronService.ipcRenderer
        .invoke('getKanjiQuickDataRows', { kanjiChars: allChars })
        .then((res) => {
          this.kanjiQuickInfo = res;
        });
    };
  }

  /**
   * Collect all characters from a tree
   */
  getAllChars(kanjiTree: KanjivgTreeRow['tree_json']) {
    const ax: string[] = [];

    function exec(kt: KanjivgTreeRow['tree_json']) {
      if (typeof kt.element === 'string') ax.push(kt.element);

      if (kt?.g?.length !== 0) {
        kt.g?.forEach((el) => {
          exec(el);
        });
      }
    }

    exec(kanjiTree);

    return ax;
  }
}
