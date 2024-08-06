import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionBalizaComponent } from './configuracion-baliza.component';

describe('ConfiguracionBalizaComponent', () => {
  let component: ConfiguracionBalizaComponent;
  let fixture: ComponentFixture<ConfiguracionBalizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionBalizaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionBalizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
