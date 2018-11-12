import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {MatButtonToggleModule, MatDialogModule} from '@angular/material';

import { ControlCalendarComponent } from './control-calendar.component';
import { MockCalendarService } from '../../service/calendar.service.mock';
import {CalendarService} from '../../service/calendar.service';

describe('ControlCalendarComponent', () => {
  let component: ControlCalendarComponent;
  let fixture: ComponentFixture<ControlCalendarComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlCalendarComponent
      ],
      providers: [
        {
          provide: CalendarService,
          useClass: MockCalendarService
        }
      ],
      imports: [
        MatDialogModule,
        MatButtonToggleModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCalendarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create control-calendar.component', () => {
    expect(component).toBeTruthy();
  });
});
