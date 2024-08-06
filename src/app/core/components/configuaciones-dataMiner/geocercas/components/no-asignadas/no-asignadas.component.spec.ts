import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAsignadasComponent } from './no-asignadas.component';

describe('NoAsignadasComponent', () => {
  let component: NoAsignadasComponent;
  let fixture: ComponentFixture<NoAsignadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAsignadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
