import { TestBed } from '@angular/core/testing';

import { InformazioniGeneraliService } from './informazioni-generali.service';

describe('InformazioniGeneraliService', () => {
  let service: InformazioniGeneraliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformazioniGeneraliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
