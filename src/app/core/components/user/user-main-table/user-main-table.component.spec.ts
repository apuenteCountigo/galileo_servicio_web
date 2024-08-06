import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMainTableComponent } from './user-main-table.component';

describe('UserMainTableComponent', () => {
  let component: UserMainTableComponent;
  let fixture: ComponentFixture<UserMainTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMainTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
