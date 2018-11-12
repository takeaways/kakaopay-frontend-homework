import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCalendarComponent } from './control-calendar.component';
import {NO_ERRORS_SCHEMA} from '@angular/compiler/src/core';

describe('ControlCalendarComponent', () => {
  let component: ControlCalendarComponent;
  let fixture: ComponentFixture<ControlCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlCalendarComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
