import { TestBed } from '@angular/core/testing';

import { TrackServerService } from './track-server.service';

describe('TrackServerService', () => {
  let service: TrackServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
