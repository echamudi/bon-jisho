import { Injectable } from '@angular/core';
import { EntryDetailsQuery } from 'types/bon-jisho';

@Injectable({
  providedIn: 'root'
})
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
