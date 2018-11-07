import * as moment from 'moment';
import {Component, HostBinding, OnInit} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';

@Component({
  selector: 'app-content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.scss']
})

export class ContentCalendarComponent implements OnInit {

  days: any = [];
  /**
   * days = {
   *  year: number,
   *  month: number,
   *  day: number,
   *  events: [
   *    {
   *      time: moment
   *      title: string
   *    }
   *    ... * 24
   *  ]
   * }
   */

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
      if(this.toggleValue === 'month')
        this.generateMonthCalendar();
      else
        this.generateWeekCalendar();
    });

    this.calendarService.toggleChanged.subscribe(toggleValue => {
      this.toggleValue = toggleValue;
      if(this.toggleValue === 'month')
        this.generateMonthCalendar();
      else
        this.generateWeekCalendar();
    });
  }

  /*****************************
   *        util functions
   *****************************/

  generateMonthCalendar() {
    this.days = [];
    let date = moment(this.showDate);
    let month = date.month();
    let year = date.year();
    let n: number = 1;
    let firstWeekDay: number = date.date(2).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    let lastDate = 7 - (moment(date).endOf('month').day() + 1);

    for (let i = n; i <= (date.endOf('month').date() + lastDate); i += 1) {
      let currentDate = moment().set('year', year).set('month', month).set('date', i);
      this.days.push({
        day: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
        events: []
      });
    }
  }

  generateWeekCalendar() {
    this.days = [];
    var current = moment(this.showDate).startOf('week');
    //주 별 시작시간으로 초기화
    current = moment(current.set('hour', 7));

    // set this Week
    for(let i=0; i < 7; i++) {
      var array = [];
      for(let i=0; i < 24; i++) {
        let temp = {
          time: moment()
            .set('year', current.year())
            .set('month', current.month())
            .set('date', current.date())
            .set('hour', current.hour())
            .set('minute', 0)
            .set('second', 0)
            .set('millisecond', 0)
        };
        array.push(temp);
        if(current.get('hours') === 23)
          current = current.set('date', current.date() - 1).add(1, 'hour')
        else
          current = moment(current.add(1, 'hour'));
      }

      this.days.push({
        year: current.get('year'),
        month: current.get('month') + 1,
        day: current.get('date'),
        events: array
      });
      current = current.add(1, 'day').set('hour', 7);
    }
  }

  /*****************************
   *       helper functions
   *****************************/

  loadEvent() {

  }

}
