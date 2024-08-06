import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimaPosicionComponent } from './ultima-posicion.component';

describe('UltimaPosicionComponent', () => {
  let component: UltimaPosicionComponent;
  let fixture: ComponentFixture<UltimaPosicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UltimaPosicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimaPosicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
