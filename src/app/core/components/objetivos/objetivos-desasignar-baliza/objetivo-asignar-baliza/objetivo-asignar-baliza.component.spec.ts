import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivoAsignarBalizaComponent } from './objetivo-asignar-baliza.component';

describe('ObjetivoAsignarBalizaComponent', () => {
  let component: ObjetivoAsignarBalizaComponent;
  let fixture: ComponentFixture<ObjetivoAsignarBalizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivoAsignarBalizaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivoAsignarBalizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
