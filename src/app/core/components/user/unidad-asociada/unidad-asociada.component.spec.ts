import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadAsociadaComponent } from './unidad-asociada.component';

describe('UnidadAsociadaComponent', () => {
  let component: UnidadAsociadaComponent;
  let fixture: ComponentFixture<UnidadAsociadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadAsociadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadAsociadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
