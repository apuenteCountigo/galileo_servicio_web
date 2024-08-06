import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnidadesComponent } from './select-unidades.component';

describe('SelectUnidadesComponent', () => {
  let component: SelectUnidadesComponent;
  let fixture: ComponentFixture<SelectUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectUnidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
