import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomencladoresComponent } from './nomencladores.component';

describe('NomencladoresComponent', () => {
  let component: NomencladoresComponent;
  let fixture: ComponentFixture<NomencladoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomencladoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomencladoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
