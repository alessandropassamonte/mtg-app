import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartePosseduteFormComponent } from './carte-possedute-form.component';

describe('CartePosseduteFormComponent', () => {
  let component: CartePosseduteFormComponent;
  let fixture: ComponentFixture<CartePosseduteFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartePosseduteFormComponent]
    });
    fixture = TestBed.createComponent(CartePosseduteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
