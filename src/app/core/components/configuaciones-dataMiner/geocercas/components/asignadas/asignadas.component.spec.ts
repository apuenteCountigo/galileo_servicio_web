import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignadasComponent } from './asignadas.component';

describe('AsignadasComponent', () => {
  let component: AsignadasComponent;
  let fixture: ComponentFixture<AsignadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
