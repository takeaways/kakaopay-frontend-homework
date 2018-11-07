// Export lib
declare var _;
import * as moment from 'moment';

// Browser lib
import {Observable} from 'rxjs';

// Angular
import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Appzet Source
import {config} from "../../app/app.config";

@Injectable()
export class CalendarService {
  private serverUrl = config.serverUrl;
  private showDate;
  private toggleValue;

  @Output() dateChanged: EventEmitter<any> = new EventEmitter();
  @Output() toggleChanged: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  setShowDate(date: any) {
    this.showDate = date;
    this.dateChanged.emit(this.showDate);
  }

  getShowDate() {
    return this.showDate;
  }

  //month control
  minusMonth() {
    this.showDate = moment(this.showDate.subtract(1, 'month'));
    this.dateChanged.emit(this.showDate);
  }

  plusMonth() {
    this.showDate = moment(this.showDate.add(1, 'month'));
    this.dateChanged.emit(this.showDate);
  }

  //week control
  minusWeek() {
    this.showDate = moment(this.showDate.subtract(1, 'week'));
    this.dateChanged.emit(this.showDate);
  }

  plusWeek() {
    this.showDate = moment(this.showDate.add(1, 'week'));
    this.dateChanged.emit(this.showDate);
  }

  setToggleValue(value: string){
    this.toggleValue = value;
    this.toggleChanged.emit(this.toggleValue);
  }

  getToggleValue(){
    return this.toggleValue;
  }

  find(queryParams: any): Observable<any> {
    let url = this.serverUrl + '/event' + '/find';
    return this.http.get(url);
    //
    // let params: URLSearchParams = new URLSearchParams();
    // _.forEach(queryParams, (value, key)=> {
    //   params.set(key, JSON.stringify(value));
    // });
    //
    // return this.http
    //   .get(url, {search: params});
  }

  // findOne(queryParams: any): Observable<any> {
  //   let url = this.serverUrl + '/post' + '/findOne';
  //
  //   let params: URLSearchParams = new URLSearchParams();
  //   _.forEach(queryParams, (value, key)=> {
  //     params.set(key, JSON.stringify(value));
  //   });
  //
  //   return this.http.get(url, {search: params});
  // }
  //
  // create(params: Object): Observable<any> {
  //   return this.http
  //     .post(this.serverUrl + '/post', params);
  // }
  //
  // update(params: Object): Observable<any> {
  //   return this.http
  //     .put(this.serverUrl + '/post', params);
  // }
  //
  // remove(_id: string): Observable<any> {
  //   let param: URLSearchParams = new URLSearchParams();
  //
  //   param.set("_id", _id.toString());
  //
  //   return this.http
  //     .delete(this.serverUrl + '/post', {search: param});
  // }
}
