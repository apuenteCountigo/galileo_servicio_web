import { TestBed } from '@angular/core/testing';

import { ConfiguracionBalizaService } from './configuracion-baliza.service';

describe('ConfiguracionBalizaService', () => {
  let service: ConfiguracionBalizaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracionBalizaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
