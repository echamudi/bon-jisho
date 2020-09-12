import { isEqual } from 'underscore';

import { Injectable } from '@angular/core';

@Injectable()
export class UnderscoreService {

  isEqual: typeof isEqual;

  constructor() {
    this.isEqual = isEqual;
  }
}
