/*
Node modules import wrapper.
*/

import { Injectable } from '@angular/core';
import { BonIpcRenderer } from './electron.service.types';

@Injectable()
export class ElectronService {

  ipcRenderer: BonIpcRenderer;
  private platform: string | undefined;

  constructor() {
    this.ipcRenderer = (window as any).electron.ipcRenderer;
  }

  async getPlatform(): Promise<string> {
    if (!this.platform) {
      this.platform = await this.ipcRenderer.invoke('get-platform');
    }

    return this.platform;
  }
}
