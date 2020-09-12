import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EntryDetailsQuery } from 'Types/bon-jisho';

/**
 * Global States.
 */
@Injectable()
export class StatesService {

  // Observable string sources
  wordSearchSelection = new Subject<EntryDetailsQuery>();
  wordSearchSelectionObs = this.wordSearchSelection.asObservable();

  constructor() {
  }
}

