import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalizaAsignComponent } from './baliza-asign.component';

describe('BalizaAsignComponent', () => {
  let component: BalizaAsignComponent;
  let fixture: ComponentFixture<BalizaAsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalizaAsignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalizaAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
