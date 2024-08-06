import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivosTablaComponent } from './objetivos-tabla.component';

describe('ObjetivosTablaComponent', () => {
  let component: ObjetivosTablaComponent;
  let fixture: ComponentFixture<ObjetivosTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivosTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
