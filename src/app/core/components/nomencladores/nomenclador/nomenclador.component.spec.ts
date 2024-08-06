import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomencladorComponent } from './nomenclador.component';

describe('NomencladorComponent', () => {
  let component: NomencladorComponent;
  let fixture: ComponentFixture<NomencladorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomencladorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomencladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
