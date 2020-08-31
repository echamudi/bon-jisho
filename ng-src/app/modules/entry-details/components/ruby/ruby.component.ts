import { Component, OnInit, Input } from '@angular/core';
import { JapaneseDB } from 'japanese-db';

@Component({
  selector: 'app-entry-details--ruby',
  templateUrl: './ruby.component.html',
  styleUrls: ['./ruby.component.scss']
})
export class RubyComponent implements OnInit {

  @Input() kanji: JapaneseDB.DictIndexRow['kanji'] | null | undefined;
  @Input() reading: JapaneseDB.DictIndexRow['reading'] | null | undefined;
  @Input() furigana: JapaneseDB.DictIndexRow['furigana'] | null | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
