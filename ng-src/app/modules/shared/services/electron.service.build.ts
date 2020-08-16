/*
This file is identical with node.service.ts except all the types are changed to any.
*/

import { Injectable } from '@angular/core';

@Injectable()
export class ElectronService {

  ipcRenderer: any;

  constructor() {
    this.ipcRenderer = (window as any).electron.ipcRenderer;
  }
}
