import { TestBed } from '@angular/core/testing';

import { VisitProfileService } from './visit-profile.service';

describe('VisitProfileService', () => {
  let service: VisitProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
