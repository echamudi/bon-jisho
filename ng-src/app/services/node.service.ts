/*
Node modules import wrapper.
*/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  fs: typeof import('fs');
  sqlite3: typeof import('sqlite3');
  remote: typeof import('electron').remote;

  constructor() {
    this.fs = (window as any).bon.fs;
    this.sqlite3 = (window as any).bon.sqlite3;
    this.remote = (window as any).bon.remote;
  }
}
