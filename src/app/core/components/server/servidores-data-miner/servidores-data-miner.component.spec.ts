import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServidoresDataMinerComponent } from './servidores-data-miner.component';

describe('ServidoresDataMinerComponent', () => {
  let component: ServidoresDataMinerComponent;
  let fixture: ComponentFixture<ServidoresDataMinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServidoresDataMinerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServidoresDataMinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
