import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalizaComponent } from './baliza.component';

describe('BalizaComponent', () => {
  let component: BalizaComponent;
  let fixture: ComponentFixture<BalizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalizaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
