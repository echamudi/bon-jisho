/*
Node modules import wrapper.
*/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof import('electron').ipcRenderer;

  constructor() {
    this.ipcRenderer = (window as any).electron.ipcRenderer;
  }
}
