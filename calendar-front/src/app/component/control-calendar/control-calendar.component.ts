import * as moment from 'moment';
import {Component, HostBinding, HostListener, OnInit} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';

@Component({
  selector: 'app-control-calendar',
  templateUrl: './control-calendar.component.html',
  styleUrls: ['./control-calendar.component.scss']
})
export class ControlCalendarComponent implements OnInit {

  @HostBinding('class.show-date')
  showDate: any;

  @HostBinding('class.toggle-value')
  toggleValue: string;

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
    this.showDate = this.calendarService.getShowDate();
    this.toggleValue = this.calendarService.getToggleValue();

    if(this.toggleValue === 'week') {
      this.currentStartYear = this.showDate.startOf('week').year();
      this.currentEndYear = this.showDate.endOf('week').year();
      this.currentStartMonth = this.showDate.startOf('week').month() + 1;
      this.currentEndMonth = this.showDate.endOf('week').month() + 1;
      this.currentStartWeek = this.showDate.startOf('week').date();
      this.currentEndWeek = this.showDate.endOf('week').date();
    } else {
      this.currentYear = this.calendarService.getShowDate().year();
      this.currentMonth = this.showDate.month() + 1;
    }

    this.calendarService.dateChanged.subscribe(showDate => {
      if(this.toggleValue === 'week') {
        this.currentStartYear = showDate.startOf('week').year();
        this.currentEndYear = showDate.endOf('week').year();
        this.currentStartMonth = showDate.startOf('week').month() + 1;
        this.currentEndMonth = showDate.endOf('week').month() + 1;
        this.currentStartWeek = showDate.startOf('week').date();
        this.currentEndWeek = showDate.endOf('week').date();
      } else
        this.currentYear = showDate.get('year');
        this.currentMonth = showDate.get('month') + 1;
    });

    this.calendarService.toggleChanged.subscribe(toggleValue => {
      this.toggleValue = toggleValue;
      this.calendarService.setShowDate(moment());
    });

  }

  /*****************************
   *        util functions
   *****************************/

  @HostListener('prev-click')
  prevClicked() {
    if(this.toggleValue === 'month') {
      this.calendarService.minusMonth();
    } else {
      this.calendarService.minusWeek();
    }
  }

  @HostListener('next-click')
  nextClicked() {
    if(this.toggleValue === 'month') {
      this.calendarService.plusMonth();
    } else {
      this.calendarService.plusWeek();
    }
  }

  @HostListener('toggle-month-week')
  toggleMonthWeek(value) {
    this.calendarService.setToggleValue(value);
  }

  /*****************************
   *       helper functions
   *****************************/

}
