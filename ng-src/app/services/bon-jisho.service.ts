import { Injectable } from '@angular/core';
import { EntryDetailsQuery } from 'types/bon-jisho';

@Injectable()
export class BonJishoService {

  public entryDetailsHistory: {
    stack: EntryDetailsQuery[],
    pointer: number,
  };

  constructor() {
    this.entryDetailsHistory = {
      stack: [null],
      pointer: 0,
    };
  }
}
