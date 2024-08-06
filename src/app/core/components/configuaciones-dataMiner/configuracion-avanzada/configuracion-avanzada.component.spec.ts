import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionAvanzadaComponent } from './configuracion-avanzada.component';

describe('ConfiguracionAvanzadaComponent', () => {
  let component: ConfiguracionAvanzadaComponent;
  let fixture: ComponentFixture<ConfiguracionAvanzadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionAvanzadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionAvanzadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
