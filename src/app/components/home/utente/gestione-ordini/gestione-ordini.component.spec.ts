import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneOrdiniComponent } from './gestione-ordini.component';

describe('GestioneOrdiniComponent', () => {
  let component: GestioneOrdiniComponent;
  let fixture: ComponentFixture<GestioneOrdiniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestioneOrdiniComponent]
    });
    fixture = TestBed.createComponent(GestioneOrdiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
