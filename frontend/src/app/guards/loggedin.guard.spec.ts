import { TestBed } from '@angular/core/testing';

import { LoggedinGuard } from './loggedin.guard';

describe('LoggedinGuard', () => {
  let guard: LoggedinGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedinGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
