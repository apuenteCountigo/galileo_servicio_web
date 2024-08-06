import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoEvidenciaComponent } from './progreso-evidencia.component';

describe('ProgresoEvidenciaComponent', () => {
  let component: ProgresoEvidenciaComponent;
  let fixture: ComponentFixture<ProgresoEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgresoEvidenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgresoEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
