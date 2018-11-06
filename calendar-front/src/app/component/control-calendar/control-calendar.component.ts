import {Component, HostListener, OnInit} from '@angular/core';
import {CalendarService} from '../../service/calendar.service';

@Component({
  selector: 'app-control-calendar',
  templateUrl: './control-calendar.component.html',
  styleUrls: ['./control-calendar.component.scss']
})
export class ControlCalendarComponent implements OnInit {

  constructor(private calendarService: CalendarService) {}

  /*****************************
   *         life cycle
   *****************************/

  ngOnInit() {
  }

  /*****************************
   *        util functions
   *****************************/

  @HostListener('prev-click')
  prevClicked() {
    if(this.calendarService.getToggleValue() === 'month') {
      this.calendarService.minusMonth();
    } else {
      this.calendarService.minusWeek();
    }
  }

  @HostListener('next-click')
  nextClicked() {
    if(this.calendarService.getToggleValue() === 'month') {
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
