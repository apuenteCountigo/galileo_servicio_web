import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionAntiBarridoComponent } from './configuracion-anti-barrido.component';

describe('ConfiguracionAntiBarridoComponent', () => {
  let component: ConfiguracionAntiBarridoComponent;
  let fixture: ComponentFixture<ConfiguracionAntiBarridoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionAntiBarridoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionAntiBarridoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
