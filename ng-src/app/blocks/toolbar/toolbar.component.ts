import { Component, OnInit } from '@angular/core';
import { NodeService } from 'ng-src/app/services/node.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
  }

  dblclick() {
    var window = this.nodeService.remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }
}
