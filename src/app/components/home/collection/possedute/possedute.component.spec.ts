import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosseduteComponent } from './possedute.component';

describe('PosseduteComponent', () => {
  let component: PosseduteComponent;
  let fixture: ComponentFixture<PosseduteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosseduteComponent]
    });
    fixture = TestBed.createComponent(PosseduteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
