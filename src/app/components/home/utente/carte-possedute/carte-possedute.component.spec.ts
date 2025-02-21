import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartePosseduteComponent } from './carte-possedute.component';

describe('CartePosseduteComponent', () => {
  let component: CartePosseduteComponent;
  let fixture: ComponentFixture<CartePosseduteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartePosseduteComponent]
    });
    fixture = TestBed.createComponent(CartePosseduteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
