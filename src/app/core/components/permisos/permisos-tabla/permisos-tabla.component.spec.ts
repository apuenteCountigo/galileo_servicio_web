import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosTablaComponent } from './permisos-tabla.component';

describe('PermisosTablaComponent', () => {
  let component: PermisosTablaComponent;
  let fixture: ComponentFixture<PermisosTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermisosTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
