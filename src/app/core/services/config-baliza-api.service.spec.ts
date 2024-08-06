import { TestBed } from '@angular/core/testing';

import { ConfigBalizaAPIService } from './config-baliza-api.service';

describe('ConfigBalizaAPIService', () => {
  let service: ConfigBalizaAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigBalizaAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
