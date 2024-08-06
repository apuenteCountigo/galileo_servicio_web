import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTreeComponent } from './unit-tree.component';

describe('UnitTreeComponent', () => {
  let component: UnitTreeComponent;
  let fixture: ComponentFixture<UnitTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
