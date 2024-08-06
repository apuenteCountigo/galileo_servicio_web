import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignedTableComponent } from './asigned-table.component';

describe('AsignedTableComponent', () => {
  let component: AsignedTableComponent;
  let fixture: ComponentFixture<AsignedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
