import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalizasTablaComponent } from './balizas-tabla.component';

describe('BalizasTablaComponent', () => {
  let component: BalizasTablaComponent;
  let fixture: ComponentFixture<BalizasTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalizasTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalizasTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
