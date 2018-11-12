import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MatDialogMock} from '../../service/mat-dialog.mock';

import { ContentCalendarComponent } from './content-calendar.component';
import { DialogService } from '../dialog-message/dialog-message.service';
import { MockCalendarService } from '../../service/calendar.service.mock';
import {CalendarService} from '../../service/calendar.service';

describe('ContentCalendarComponent', () => {
  let component: ContentCalendarComponent;
  let fixture: ComponentFixture<ContentCalendarComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentCalendarComponent
      ],
      providers: [
        {
          provide: CalendarService,
          useClass: MockCalendarService
        },
        {
          provide: MatDialog, useClass: MatDialogMock,
        },
        DialogService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCalendarComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should create content-calendar.component', () => {
    expect(component).toBeTruthy();
  });
});
