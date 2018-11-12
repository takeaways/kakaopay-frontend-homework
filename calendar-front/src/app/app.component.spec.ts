import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {ControlCalendarComponent} from './component/control-calendar/control-calendar.component';
import {ContentCalendarComponent} from './component/content-calendar/content-calendar.component';
import {RouterModule, Routes} from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
        ControlCalendarComponent,
        ContentCalendarComponent
      ],
    }).compileComponents();
  }));

  it('testtest', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
