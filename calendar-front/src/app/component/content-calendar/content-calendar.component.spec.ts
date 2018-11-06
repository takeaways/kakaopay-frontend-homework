import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCalendarComponent } from './content-calendar.component';

describe('ContentCalendarComponent', () => {
  let component: ContentCalendarComponent;
  let fixture: ComponentFixture<ContentCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
