import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WindowHelper } from '../../classes/window-helper';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output()
  pageEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  toggleMaximize = WindowHelper.toggleMaximize;

  ngOnInit() {

  }

  selectPage(page: string) {
    this.pageEmitter.emit(page);
  }
}
