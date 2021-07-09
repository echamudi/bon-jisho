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

  @Input() kanjiChars: string[] | undefined;

  // If the component is recursive element
  @Input() child: boolean | undefined;

  @Input() kanjiQuickInfo: Record<string, KanjiQuickDataRow> | undefined;

  @Input() trees: Array<KanjivgTreeRow['tree_json']> | undefined;

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {
    // Gather all characters in a tree, and get quick data only in parent element
    if (!this.child && this.kanjiChars) {
      const kanjiChars = this.kanjiChars;
      (async () => {
        const trees = await this.electronService.ipcRenderer
          .invoke('getKanjivgTreeRows', { kanjiChars });

        // Collect all chars
        const allChars: string[] = [];
        trees.forEach((tree) => {
          allChars.push(...this.getAllChars(tree.tree_json));
        });

        this.kanjiQuickInfo = await this.electronService.ipcRenderer
          .invoke('getKanjiQuickDataRows', { kanjiChars: allChars });

        this.trees = trees.map((tree) => tree.tree_json);
      })();
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
