import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPlanificadorComponent } from './nuevo-planificador.component';

describe('NuevoPlanificadorComponent', () => {
  let component: NuevoPlanificadorComponent;
  let fixture: ComponentFixture<NuevoPlanificadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoPlanificadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoPlanificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
