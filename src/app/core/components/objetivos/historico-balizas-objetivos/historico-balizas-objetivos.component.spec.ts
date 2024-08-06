import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoBalizasObjetivosComponent } from './historico-balizas-objetivos.component';

describe('HistoricoBalizasObjetivosComponent', () => {
  let component: HistoricoBalizasObjetivosComponent;
  let fixture: ComponentFixture<HistoricoBalizasObjetivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoBalizasObjetivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoBalizasObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
