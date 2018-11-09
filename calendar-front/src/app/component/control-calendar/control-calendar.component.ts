import * as moment from 'moment';
import {Component, HostBinding, HostListener, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';

@Component({
  selector: 'app-control-calendar',
  templateUrl: './control-calendar.component.html',
  styleUrls: ['./control-calendar.component.scss']
})
export class ControlCalendarComponent implements OnInit {
  showDate: any;
  mode: string;

  currentYear: number;
  currentMonth: number;

  currentStartYear: number;
  currentEndYear: number;
  currentStartMonth: number;
  currentEndMonth: number;
  currentStartWeek: any;
  currentEndWeek: any;

  constructor(private calendarService: CalendarService) {}

  /*****************************
   *         life cycle
   *****************************/

  ngOnInit() {
    this.showDate = moment();
    this.mode = 'month';

    this.setDateLabel(this.showDate);
  }

  /*****************************
   *        util functions
   *****************************/

  prevClicked() {
    if(this.mode === 'month') {
      this.showDate = moment(this.showDate.subtract(1, 'month'));
    } else {
      this.showDate = moment(this.showDate.subtract(1, 'week'));
    }

    this.setDateLabel(this.showDate);
    this.calendarService.sendEvent('showdate-changed', this.showDate);
  }

  nextClicked() {
    if(this.mode === 'month') {
      this.showDate = moment(this.showDate.add(1, 'month'));
    } else {
      this.showDate = moment(this.showDate.add(1, 'week'));
    }

    this.setDateLabel(this.showDate);
    this.calendarService.sendEvent('showdate-changed', this.showDate);
  }

  toggleMode(mode) {
    this.mode = mode;
    this.setDateLabel(this.showDate);
    this.calendarService.sendEvent('mode-changed', this.mode);
  }

  setDateLabel(date) {
    if(this.mode === 'week') {
      this.currentStartYear = date.startOf('week').year();
      this.currentEndYear = date.endOf('week').year();
      this.currentStartMonth = date.startOf('week').month() + 1;
      this.currentEndMonth = date.endOf('week').month() + 1;
      this.currentStartWeek = date.startOf('week').date();
      this.currentEndWeek = date.endOf('week').date();
    } else {
      this.currentYear = date.year();
      this.currentMonth = date.month() + 1;
    }
  }

  /*****************************
   *       helper functions
   *****************************/

}
