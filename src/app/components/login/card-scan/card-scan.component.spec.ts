import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardScanComponent } from './card-scan.component';

describe('CardScanComponent', () => {
  let component: CardScanComponent;
  let fixture: ComponentFixture<CardScanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardScanComponent]
    });
    fixture = TestBed.createComponent(CardScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
