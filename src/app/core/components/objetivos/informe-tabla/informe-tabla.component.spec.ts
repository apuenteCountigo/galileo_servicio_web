import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeTablaComponent } from './informe-tabla.component';

describe('InformeTablaComponent', () => {
  let component: InformeTablaComponent;
  let fixture: ComponentFixture<InformeTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeTablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
