import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuzgadosFormComponent } from './juzgados-form.component';

describe('JuzgadosFormComponent', () => {
  let component: JuzgadosFormComponent;
  let fixture: ComponentFixture<JuzgadosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JuzgadosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JuzgadosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
