import { Component, OnInit } from '@angular/core';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  toggleMaximize = WindowHelper.toggleMaximize;

  ngOnInit() {

  }
}
