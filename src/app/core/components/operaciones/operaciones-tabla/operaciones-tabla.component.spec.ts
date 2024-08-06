import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionesTablaComponent } from './operaciones-tabla.component';

describe('OperacionesTablaComponent', () => {
  let component: OperacionesTablaComponent;
  let fixture: ComponentFixture<OperacionesTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperacionesTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperacionesTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
