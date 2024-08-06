import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionGpsComponent } from './configuracion-gps.component';

describe('ConfiguracionGpsComponent', () => {
  let component: ConfiguracionGpsComponent;
  let fixture: ComponentFixture<ConfiguracionGpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionGpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionGpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
