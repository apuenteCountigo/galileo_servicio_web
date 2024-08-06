import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOficialSaComponent } from './select-oficial-sa.component';

describe('SelectOficialSaComponent', () => {
  let component: SelectOficialSaComponent;
  let fixture: ComponentFixture<SelectOficialSaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectOficialSaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOficialSaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
