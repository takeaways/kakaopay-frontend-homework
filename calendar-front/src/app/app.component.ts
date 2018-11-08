import {Component, OnInit} from '@angular/core';
import {CalendarService} from './service/calendar.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.setShowDate(moment());
    this.calendarService.setToggleValue('week');
  }
}
