import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsLayoutComponent } from './operations-layout.component';

describe('OperationsLayoutComponent', () => {
  let component: OperationsLayoutComponent;
  let fixture: ComponentFixture<OperationsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
