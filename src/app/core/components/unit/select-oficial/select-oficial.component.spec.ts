import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOficialComponent } from './select-oficial.component';

describe('SelectOficialComponent', () => {
  let component: SelectOficialComponent;
  let fixture: ComponentFixture<SelectOficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectOficialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
