/*
This file is identical with node.service.ts except all the types are changed to any.
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
