import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlCalendarComponent } from './control-calendar.component';

describe('ControlCalendarComponent', () => {
  let component: ControlCalendarComponent;
  let fixture: ComponentFixture<ControlCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlCalendarComponent ]
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
