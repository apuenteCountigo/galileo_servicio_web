import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPositionsComponent } from './wizard-positions.component';

describe('WizardPositionsComponent', () => {
  let component: WizardPositionsComponent;
  let fixture: ComponentFixture<WizardPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardPositionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
