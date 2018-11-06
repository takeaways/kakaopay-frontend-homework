import * as moment from 'moment';
import {Component, HostBinding, OnInit, SimpleChange} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';

interface CalendarDate {
  day: number;
  month: number;
  year: number;
  events: any[];
}

@Component({
  selector: 'app-content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.scss']
})

export class ContentCalendarComponent implements OnInit {

  days: CalendarDate[] = [];

  @HostBinding('class.show-date')
  showDate: any;

  @HostBinding('class.toggle-value')
  toggleValue: string;

  constructor(public calendarService: CalendarService) { }

  /*****************************
   *         life cycle
   *****************************/

  ngOnInit() {
    this.showDate = this.calendarService.getShowDate();
    this.toggleValue = this.calendarService.getToggleValue();

    if(this.toggleValue === 'month') this.generateMonthCalendar();
    else this.generateWeekCalendar();

    this.calendarService.dateChanged.subscribe(showDate => {
      this.showDate = showDate;
      this.generateMonthCalendar();
    });

    this.calendarService.toggleChanged.subscribe(toggleValue => {
      this.toggleValue = toggleValue;
      this.generateWeekCalendar();
    });
  }

  /*****************************
   *        util functions
   *****************************/

  generateMonthCalendar() {
    let date = moment(this.showDate);
    let month = date.month();
    let year = date.year();
    let n: number = 1;
    let firstWeekDay: number = date.date(2).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    let lastDate = 7 - (moment(date).endOf('month').day() + 1);
    let disableCheck = false;

    this.days = [];
    for (let i = n; i <= (date.endOf('month').date() + lastDate); i += 1) {
      let currentDate = moment().set('year', year).set('month', month).set('date', i);
      this.days.push({
        day: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
        events: [
          '오늘은 신나는 회식!',
          '11:00 클라이언트 미팅',
          '소미 어린이집 상담'
        ]
      });
    }
  }

  generateWeekCalendar() {

  }

  /*****************************
   *       helper functions
   *****************************/

  loadEvent() {

  }

}
