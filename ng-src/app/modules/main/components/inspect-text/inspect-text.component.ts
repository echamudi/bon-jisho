import { Component, OnInit } from '@angular/core';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';

@Component({
  selector: 'app-main--inspect-text',
  templateUrl: './inspect-text.component.html',
  styleUrls: ['./inspect-text.component.scss']
})
export class InspectTextComponent implements OnInit {

  constructor() { }

  toggleMaximize = WindowHelper.toggleMaximize;

  ngOnInit() {
  }

}
