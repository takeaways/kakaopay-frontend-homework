import { TestBed } from '@angular/core/testing';
import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let calendarService: CalendarService; // Add this

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [calendarService]
    });

    calendarService = TestBed.get(CalendarService); // Add this
  });

  it('should be created', () => { // Remove inject()
    expect(calendarService).toBeTruthy();
  });
});
