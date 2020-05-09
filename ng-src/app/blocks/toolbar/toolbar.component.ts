import { Component, OnInit } from '@angular/core';
// import { NodeService } from 'ng-src/app/services/node.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  dblclick() {
    (window as any).electron.ipcRenderer.invoke('toggle-maximize');
  }
}
