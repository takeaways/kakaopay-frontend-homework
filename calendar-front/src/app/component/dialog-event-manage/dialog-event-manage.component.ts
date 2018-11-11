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
        this.startTime = moment().startOf('hour');
        this.endTime = moment().startOf('hour').add(1, 'hour');
      } else {
        this.title = this.eventItem.title;
        this.startTime = moment(this.eventItem.startTime);
        this.endTime = moment(this.eventItem.startTime).add(1, 'hour');
      }
    } else {
      if (this.editMode === 'CREATE') {
        this.startTime = moment(this.selectedHourItem.compareTime);
        this.endTime = moment(this.selectedHourItem.compareTime).add(1, 'hour');
      } else {
        this.title = this.eventItem.title;
        this.startTime = moment(this.eventItem.startTime);
        this.endTime = moment(this.eventItem.startTime).add(1, 'hour');
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
    this.endDate = new Date(event.value);
  }

  endDateChanged(event) {
    if(moment(event.value).isBefore(this.startDate)) {
      this.dialogService.message('알림', '시작 날짜와 같은 날짜 혹은 이후의 날짜를 선택해 주세요');
      this.endDate = new Date(this.startDate);
    } else
      this.endDate = new Date(event.value);
  }

  startTimeChanged(hourItem) {
    //선택한 시간을 기준으로 + 1
    this.startTime = hourItem;
    this.endTime = moment(hourItem).add(1, 'hour');
  }

  endTimeChanged(selectedEndTime) {
    if(selectedEndTime.hour() < this.startTime.hour()) {
      this.dialogService.message('알림', '시작 시간 이후의 시간를 선택해 주세요');
      this.endTime = moment(this.startTime).add(1, 'hour');
    } else this.endTime = selectedEndTime;
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
      let event = {
        title: this.title,
        startTime: moment({
          years: moment(this.startDate).year(),
          months: moment(this.startDate).month(),
          days: moment(this.startDate).date(),
          hour: moment(this.startTime).hour()
        }).toDate(),
        endTime: moment({
          years: moment(this.endDate).year(),
          months: moment(this.endDate).month(),
          days: moment(this.endDate).date(),
          hour: moment(this.endTime).hour()
        }).toDate()
      };

      this.calendarService.create(event)
        .subscribe((result) => {
          this.close('saved');
        }, error => {
          console.log("error :::\n", error);
          let msg = "";
          switch (error.status) {
            case 400:
              msg = "잘못된 요청입니다. 제목과 날짜, 시간을 모두 입력해 주세요.";
              break;
            case 409:
              msg = "선택하신 날짜와 시간에 일정이 존재합니다. 다른 날짜와 시간을 선택해주세요.";
              break;
            default:
              msg = "서버와의 통신 중 에러가 발생하였습니다.";
              return;
          }

          this.dialogService.message("에러", msg);
        });
    }
  }

  update() {
    if (this.validate()) {
      let event = {
        _id: this.eventItem._id,
        title: this.title,
        startTime: moment({
          years: moment(this.startDate).year(),
          months: moment(this.startDate).month(),
          days: moment(this.startDate).date(),
          hour: moment(this.startTime).hour()
        }).toDate(),
        endTime: moment({
          years: moment(this.endDate).year(),
          months: moment(this.endDate).month(),
          days: moment(this.endDate).date(),
          hour: moment(this.endTime).hour()
        }).toDate()
      };

      this.calendarService.update(event)
        .subscribe((result) => {
          this.close('saved');
        }, error => {
          console.log("error :::\n", error);
          let msg = "";
          switch (error.status) {
            case 400:
              msg = "잘못된 요청입니다. 제목과 날짜, 시간을 모두 입력해 주세요.";
              break;
            case 409:
              msg = "선택하신 날짜와 시간에 일정이 존재합니다. 다른 날짜와 시간을 선택해주세요.";
              break;
            default:
              msg = "서버와의 통신 중 에러가 발생하였습니다.";
              return;
          }

          this.dialogService.message("에러", msg);
        });
    }
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
