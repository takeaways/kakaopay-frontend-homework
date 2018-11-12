import { Observable, of } from 'rxjs';

export class MockCalendarService {
  sendEvent(eventName: string, data?: any) {

  }

  find(): Observable<any[]> {
    return of([]);
  }

  create(): Observable<any> {
    return of({});
  }

  update(): Observable<any> {
    return of({});
  }

  remove(): Observable<any> {
    return of({});
  }
}
