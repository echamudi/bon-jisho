/*
This file is identical with node.service.ts except all the types are changed to any.
*/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  fs: any;
  sqlite3: any;
  remote: any;

  constructor() {
    this.fs = (window as any).bon.fs;
    this.sqlite3 = (window as any).bon.sqlite3;
    this.remote = (window as any).bon.remote;
  }
}
