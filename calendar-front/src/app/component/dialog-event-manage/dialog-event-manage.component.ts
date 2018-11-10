import * as moment from 'moment';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CalendarService} from '../../service/calendar.service';
import {DialogService} from '../dialog-message/dialog-message.service';

@Component({
  selector: 'app-dialog-event-manage',
  templateUrl: './dialog-event-manage.component.html',
  styleUrls: ['./dialog-event-manage.component.scss']
})
export class DialogEventManageComponent implements OnInit {

  moment = moment;

  mode: string;
  editMode: string = ''; //CREATE or UPDATE

  title: string = '';

  eventItem: any;
  //for Month
  selectedDateItem: any;
  //for Week
  selectedHourItem: any;

  //for View
  startDate: any; //Angular Material DatePicker의 format 때문에 Date 타입으로 지정
  startTime: any;
  endDate: any; //Angular Material DatePicker의 format 때문에 Date 타입으로 지정
  endTime: any;

  hoursArr = [];

  constructor(public calendarService: CalendarService,
              private dialogService: DialogService,
              public dialogRef: MatDialogRef<DialogEventManageComponent>) {
  }

  /*****************************
   *         life cycle
   *****************************/

  ngOnInit() {
    this.startDate = new Date(`${this.selectedDateItem.month + 1}/${this.selectedDateItem.day}/${this.selectedDateItem.year}`);
    this.endDate = new Date(`${this.selectedDateItem.month + 1}/${this.selectedDateItem.day}/${this.selectedDateItem.year}`);
    if (this.mode === 'month') {
      if (this.editMode === 'CREATE') {
        this.startTime = moment().startOf('hour').format('A hh:mm');
        this.endTime = moment().startOf('hour').add(1, 'hour').format('A hh:mm');
      } else {
        this.title = this.eventItem.title;
        this.startTime = moment(this.eventItem.startTime).format('A hh:mm');
        this.endTime = moment(this.eventItem.startTime).add(1, 'hour').format('A hh:mm');
      }
    } else {
      if (this.editMode === 'CREATE') {
        this.startTime = moment(this.selectedHourItem.compareTime).format('A hh:mm');
        this.endTime = moment(this.selectedHourItem.compareTime).add(1, 'hour').format('A hh:mm');
      } else {
        this.title = this.eventItem.title;
        this.startTime = moment(this.eventItem.startTime).format('A hh:mm');
        this.endTime = moment(this.eventItem.startTime).add(1, 'hour').format('A hh:mm');
      }
    }


    this.setHoursArray();
  }

  /*****************************
   *        util functions
   *****************************/

  setHoursArray() {
    var current = moment(`${this.selectedDateItem.month + 1}/${this.selectedDateItem.day}/${this.selectedDateItem.year}`);

    for (let i = 0; i < 24; i++) {
      let temp = moment()
        .set('year', current.year())
        .set('month', current.month())
        .set('date', current.date())
        .set('hour', current.hour())
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0);

      this.hoursArr.push(temp);
      if (current.get('hours') === 23)
        current = current.set('date', current.date() - 1).add(1, 'hour');
      else
        current = moment(current.add(1, 'hour'));
    }
  }

  startDateChanged(event) {
    this.startDate = new Date(event.value);
    console.log('this.startDate::\n', this.startDate);
  }

  endDateChanged(event) {
    this.endDate = new Date(event.value);
    console.log('this.endDate::\n', this.endDate);
  }

  validate() {
    if (!this.title && this.title === '') {
      this.dialogService.message('알림', '제목을 입력해주세요');
      return false;
    } else if (!this.startDate) {
      this.dialogService.message('알림', '시작 날짜를 선택해주세요');
      return false;
    } else if (!this.startTime) {
      this.dialogService.message('알림', '시작 시간을 선택해주세요');
      return false;
    } else if (!this.endDate) {
      this.dialogService.message('알림', '종료 날짜를 선택해주세요');
      return false;
    } else if (!this.endDate) {
      this.dialogService.message('알림', '종료 시간을 선택해주세요');
      return false;
    } else {
      return true;
    }
  }

  close(result) {
    if (result) this.dialogRef.close(result);
    else this.dialogRef.close(result);
  }

  /*****************************
   *       helper functions
   *****************************/

  create() {
    if (this.validate()) {
      //TODO: AM/PM 에서의 시간 변환 AM 12:00 --> 00:00, PM 01:00 --> 13:00
      let start = 0;
      if (this.startTime.substring(0, 2) === 'PM'){
        if (this.startTime.substring(3, 5)*1 == 12) start = 12;
        else start = this.startTime.substring(3, 5) * 1 + 12;
      } else {
        if (this.startTime.substring(3, 5)*1 == 12) start = 0;
        else start = this.startTime.substring(3, 5) * 1;
      }

      let end = 0;
      if (this.endTime.substring(0, 2) === 'PM') {
        if (this.endTime.substring(3, 5)*1 == 12) end = 12;
        else end = this.endTime.substring(3, 5) * 1 + 12;
      } else {
        if (this.endTime.substring(3, 2)*1 == 12) end = 0;
        else end = this.endTime.substring(3, 5) * 1;
      }

      let event = {
        title: this.title,
        startTime: moment({
          years: this.selectedDateItem.year,
          months: this.selectedDateItem.month,
          days: this.selectedDateItem.day,
          hour: start
        }).toDate(),
        endTime: moment({
          years: this.selectedDateItem.year,
          months: this.selectedDateItem.month,
          days: this.selectedDateItem.day,
          hour: end
        }).toDate()
      };

      this.calendarService.create(event)
        .subscribe((result) => {
          this.close('saved');
        }, error => {
          console.log('error :::\n', error);
          this.dialogService.message('에러', '서버와의 통신중 에러가 발생하였습니다.\n' + error)
            .subscribe(() => {
            });
        });
    }
  }

  update() {

  }

  delete() {
    this.dialogService.confirm('알림', '해당 일정을 삭제하시겠습니까?')
      .subscribe((result) => {
        if (result) {
          this.calendarService.remove(this.eventItem._id)
            .subscribe(result => {
              console.log('result::\n', result);
              this.close('deleted');
            }, error => {
              console.log('error::\n', error);
            });
        }
      });
  }
}
