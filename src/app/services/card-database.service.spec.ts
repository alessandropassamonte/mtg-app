import { TestBed } from '@angular/core/testing';

import { CardDatabaseService } from './card-database.service';

describe('CardDatabaseService', () => {
  let service: CardDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
