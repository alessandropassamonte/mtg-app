import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdineFormComponent } from './ordine-form.component';

describe('OrdineFormComponent', () => {
  let component: OrdineFormComponent;
  let fixture: ComponentFixture<OrdineFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdineFormComponent]
    });
    fixture = TestBed.createComponent(OrdineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
