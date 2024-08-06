import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasOperativaComponent } from './alertas-operativa.component';

describe('AlertasOperativaComponent', () => {
  let component: AlertasOperativaComponent;
  let fixture: ComponentFixture<AlertasOperativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertasOperativaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertasOperativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
