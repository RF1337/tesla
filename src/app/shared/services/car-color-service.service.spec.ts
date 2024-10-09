import { TestBed } from '@angular/core/testing';

import { CarColorServiceService } from './car-color-service.service';

describe('CarColorServiceService', () => {
  let service: CarColorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarColorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
