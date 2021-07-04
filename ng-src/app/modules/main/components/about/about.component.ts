import { Component, OnInit } from '@angular/core';
import { WindowHelper } from 'App/modules/shared/classes/window-helper';
import { ElectronService } from 'App/modules/shared/services/electron.service';

@Component({
  selector: 'app-main--about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  toggleMaximize = WindowHelper.toggleMaximize;

  ngOnInit(): void {
  }

  openWebBroser(url: string): void {
    this.electronService.ipcRenderer
      .invoke('openURL', { url })
  }
}
