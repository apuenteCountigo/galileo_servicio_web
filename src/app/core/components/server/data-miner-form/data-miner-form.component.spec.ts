import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMinerFormComponent } from './data-miner-form.component';

describe('DataMinerFormComponent', () => {
  let component: DataMinerFormComponent;
  let fixture: ComponentFixture<DataMinerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataMinerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMinerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
