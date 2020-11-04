/*
Node modules import wrapper.
*/

import { Injectable } from '@angular/core';
import { BonIpcRenderer } from './electron.service.types';

@Injectable()
export class ElectronService {

  ipcRenderer: BonIpcRenderer;

  constructor() {
    this.ipcRenderer = (window as any).electron.ipcRenderer;
  }
}
