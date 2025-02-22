import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCardScanComponent } from './new-card-scan.component';

describe('NewCardScanComponent', () => {
  let component: NewCardScanComponent;
  let fixture: ComponentFixture<NewCardScanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCardScanComponent]
    });
    fixture = TestBed.createComponent(NewCardScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
