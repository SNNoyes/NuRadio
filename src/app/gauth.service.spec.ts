import { TestBed } from '@angular/core/testing';

import { GauthService } from './gauth.service';

describe('GauthService', () => {
  let service: GauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
