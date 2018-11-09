import * as _ from 'lodash';
import * as moment from 'moment';
import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';

@Component({
  selector: 'app-content-calendar',
  templateUrl: './content-calendar.component.html',
  styleUrls: ['./content-calendar.component.scss']
})

export class ContentCalendarComponent implements OnInit, OnDestroy {
  appEventDisposor: any;

  showDate: any;
  mode: string;

  events: any = [];

  monthDays: any = [];
  /**
   * monthDays = {
   *  * year, month, day : 달력에 이벤트를 표시하기 위한 값들
   *  * events : 사용자가 보는 현재의 달력(이번달, 이번주)에 등록된 이벤트
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

  weekDays: any = [];

  /**
   * weekDays = {
   *  * year, month, day : 달력에 이벤트를 표시하기 위한 값들
   *  * events : 사용자가 보는 현재의 달력(이번달, 이번주)에 등록된 이벤트
   *  year: number,
   *  month: number,
   *  day: number,
   *  hours: [{
   *    compareTime: 비교를 위한 시간 (moment obj)
   *    event: {}
   *  }] --> 24개
   * }
   */

  constructor(public calendarService: CalendarService) {}

  /*****************************
   *         life cycle
   *****************************/

  ngOnInit() {
    this.showDate = moment();
    this.mode = 'month';

    if (this.appEventDisposor) this.appEventDisposor.unsubscribe();
    this.appEventDisposor = this.calendarService.appEvent.subscribe(this.appEventHandler.bind(this));

    this.initialise();
  }

  ngOnDestroy() {
    if (this.appEventDisposor)
      this.appEventDisposor.unsubscribe();
  }

  /*****************************
   *        util functions
   *****************************/

  appEventHandler(event) {
    switch (event.name) {
      case 'showdate-changed' : {
        this.showDate = event.data;
        this.initialise();
        break;
      }
      case 'mode-changed' : {
        this.mode = event.data;
        this.initialise();
        break;
      }
      default:
        return;
    }
  }

  initialise() {
    if (this.mode === 'month') this.generateMonthCalendar();
    else this.generateWeekCalendar();

    this.loadEvent();
  }

  generateMonthCalendar() {
    this.monthDays = [];
    let date = moment(this.showDate);
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay = date.date(2).day();

    if (firstWeekDay !== 1) {
      n -= (firstWeekDay + 6) % 7;
    }

    let lastDate = 7 - (moment(date).endOf('month').day() + 1);

    for (let i = n; i <= (date.endOf('month').date() + lastDate); i += 1) {
      let currentDate = moment().set('year', year).set('month', month).set('date', i);
      this.monthDays.push({
        day: currentDate.date(),
        month: currentDate.month(),
        year: currentDate.year(),
        events: []
      });
    }
  }

  generateWeekCalendar() {
    this.weekDays = [];
    var current = moment(this.showDate).startOf('week');
    //주 별 시작시간으로 초기화
    current = moment(current.set('hour', 7));

    // set this Week
    for (let i = 0; i < 7; i++) {
      var array = [];
      for (let i = 0; i < 24; i++) {
        let temp = {
          compareTime: moment()
            .set('year', current.year())
            .set('month', current.month())
            .set('date', current.date())
            .set('hour', current.hour())
            .set('minute', 0)
            .set('second', 0)
            .set('millisecond', 0),
          event: null
        };

        array.push(temp);
        if (current.get('hours') === 23)
          current = current.set('date', current.date() - 1).add(1, 'hour');
        else
          current = moment(current.add(1, 'hour'));
      }

      this.weekDays.push({
        year: current.get('year'),
        month: current.get('month') + 1,
        day: current.get('date'),
        hours: array
      });
      current = current.add(1, 'day').set('hour', 7);
    }
  }

  /*****************************
   *       helper functions
   *****************************/

  loadEvent() {
    return this.calendarService.find({
      query: {
        isDeleted: false,
        showDate: this.showDate,
        mode: this.mode
      },
      sort: {createdAt: -1}
    })
      .subscribe(result => {
        this.events = result.events;
        if(this.mode === 'month') {
          _.forEach(this.monthDays, (dayItem) => {
            _.forEach(this.events, (eventItem) => {
              if(dayItem.day === moment(eventItem.startTime).date())
                dayItem.events.push(eventItem);
            });
          });
        } else {
          _.forEach(this.weekDays, dayItem => {
            _.forEach(this.events, (eventItem) => {
              if(dayItem.day === moment(eventItem.startTime).date()) {
                _.forEach(dayItem.hours, hourItem => {
                  if(hourItem.compareTime.hour() === moment(eventItem.startTime).hour()) {
                    hourItem.event = eventItem;
                  }
                })
              }
            });
          });
        }
      });
  }

  createEvent() {
    let event = {
      title: "GDG Dev Fest",
      startTime: moment('2018-11-10 18:00:00').toDate()
    };

    this.calendarService.create(event)
      .subscribe((result) => {
        console.log("result::\n", result);
      }, error => {
        console.log('error :::\n', error);
        // this.dialogService.message('에러', '서버와의 통신중 에러가 발생하였습니다.\n' + error)
        //   .subscribe(() => {
        //   });
      });

  }

}
