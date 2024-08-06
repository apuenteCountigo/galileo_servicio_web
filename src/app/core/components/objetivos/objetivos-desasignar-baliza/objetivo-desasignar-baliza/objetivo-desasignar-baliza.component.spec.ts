import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivoDesasignarBalizaComponent } from './objetivo-desasignar-baliza.component';

describe('ObjetivoDesasignarBalizaComponent', () => {
  let component: ObjetivoDesasignarBalizaComponent;
  let fixture: ComponentFixture<ObjetivoDesasignarBalizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivoDesasignarBalizaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivoDesasignarBalizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
