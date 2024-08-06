import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosFormComponent } from './permisos-form.component';

describe('PermisosFormComponent', () => {
  let component: PermisosFormComponent;
  let fixture: ComponentFixture<PermisosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermisosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
