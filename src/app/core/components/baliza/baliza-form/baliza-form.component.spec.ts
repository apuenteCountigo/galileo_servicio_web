import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalizaFormComponent } from './baliza-form.component';

describe('BalizaFormComponent', () => {
  let component: BalizaFormComponent;
  let fixture: ComponentFixture<BalizaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalizaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalizaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
