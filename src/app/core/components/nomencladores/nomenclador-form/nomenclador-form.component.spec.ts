import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomencladorFormComponent } from './nomenclador-form.component';

describe('NomencladorFormComponent', () => {
  let component: NomencladorFormComponent;
  let fixture: ComponentFixture<NomencladorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomencladorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomencladorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
