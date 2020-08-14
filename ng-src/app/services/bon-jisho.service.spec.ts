import { TestBed } from '@angular/core/testing';

import { BonJishoService } from './bon-jisho.service';

describe('BonJishoService', () => {
  let service: BonJishoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonJishoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
