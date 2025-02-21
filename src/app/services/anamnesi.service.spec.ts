import { TestBed } from '@angular/core/testing';

import { AnamnesiService } from './anamnesi.service';

describe('AnamnesiService', () => {
  let service: AnamnesiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnamnesiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
