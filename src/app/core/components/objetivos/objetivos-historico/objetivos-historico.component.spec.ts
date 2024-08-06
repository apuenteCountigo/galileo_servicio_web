import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivosHistoricoComponent } from './objetivos-historico.component';

describe('ObjetivosHistoricoComponent', () => {
  let component: ObjetivosHistoricoComponent;
  let fixture: ComponentFixture<ObjetivosHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivosHistoricoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivosHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
