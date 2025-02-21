import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCardsPosseduteComponent } from './confirm-cards-possedute.component';

describe('ConfirmCardsPosseduteComponent', () => {
  let component: ConfirmCardsPosseduteComponent;
  let fixture: ComponentFixture<ConfirmCardsPosseduteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmCardsPosseduteComponent]
    });
    fixture = TestBed.createComponent(ConfirmCardsPosseduteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
