import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocercasComponent } from './geocercas.component';

describe('GeocercasComponent', () => {
  let component: GeocercasComponent;
  let fixture: ComponentFixture<GeocercasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeocercasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocercasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
