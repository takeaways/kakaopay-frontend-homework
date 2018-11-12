import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogRef, MatMenuModule} from '@angular/material';

import { DialogEventManageComponent } from './dialog-event-manage.component';
import {DialogService} from '../dialog-message/dialog-message.service';
import { MockCalendarService } from '../../service/calendar.service.mock';
import {CalendarService} from '../../service/calendar.service';
import {DialogMessageMock} from '../dialog-message/dialog-message.mock';

describe('DialogEventManageComponent', () => {
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  let component: DialogEventManageComponent;
  let fixture: ComponentFixture<DialogEventManageComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DialogEventManageComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: CalendarService,
          useClass: MockCalendarService
        },
        {
          provide: DialogService,
          useClass: DialogMessageMock
        },
      ],
      imports: [
        MatMenuModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEventManageComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create dialog-event-manage.component', () => {
    expect(component).toBeTruthy();
  });
});
