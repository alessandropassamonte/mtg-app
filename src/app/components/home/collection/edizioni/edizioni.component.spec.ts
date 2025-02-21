import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdizioniComponent } from './edizioni.component';

describe('EdizioniComponent', () => {
  let component: EdizioniComponent;
  let fixture: ComponentFixture<EdizioniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdizioniComponent]
    });
    fixture = TestBed.createComponent(EdizioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
