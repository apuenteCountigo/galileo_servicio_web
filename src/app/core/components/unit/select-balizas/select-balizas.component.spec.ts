import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBalizasComponent } from './select-balizas.component';

describe('SelectBalizasComponent', () => {
  let component: SelectBalizasComponent;
  let fixture: ComponentFixture<SelectBalizasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBalizasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBalizasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
