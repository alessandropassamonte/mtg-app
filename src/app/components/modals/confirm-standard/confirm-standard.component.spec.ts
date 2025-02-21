import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStandardComponent } from './confirm-standard.component';

describe('ConfirmStandardComponent', () => {
  let component: ConfirmStandardComponent;
  let fixture: ComponentFixture<ConfirmStandardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmStandardComponent]
    });
    fixture = TestBed.createComponent(ConfirmStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
