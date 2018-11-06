// Export lib
declare var _;
import * as moment from 'moment';

// Browser lib
import {Observable} from 'rxjs';

// Angular
import {EventEmitter, Injectable, Output} from '@angular/core';
import {URLSearchParams} from '@angular/http';

// Angular third party lib
// import {InterceptableHttp} from '../../lib/ng-http-interceptor';

// Appzet Source
// import {config} from "../../app/app.config";

@Injectable()
export class CalendarService {
  private showDate;
  private toggleValue;

  @Output() dateChanged: EventEmitter<any> = new EventEmitter();
  @Output() toggleChanged: EventEmitter<any> = new EventEmitter();

  setShowDate(date: any) {
    this.showDate = date;
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

  // private serverUrl = config.serverUrl;
  //
  // constructor(private http: InterceptableHttp) {
  // }
  //
  // find(queryParams: any): Observable<any> {
  //   // Logger.silly('point.service', 'find');
  //   let url = this.serverUrl + '/post' + '/find';
  //
  //   let params: URLSearchParams = new URLSearchParams();
  //   _.forEach(queryParams, (value, key)=> {
  //     params.set(key, JSON.stringify(value));
  //   });
  //
  //   return this.http
  //     .get(url, {search: params});
  // }
  //
  // findOne(queryParams: any): Observable<any> {
  //   // Logger.silly('point.service', 'findOne');
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
  //   // Logger.silly('point.service', 'create');
  //   return this.http
  //     .post(this.serverUrl + '/post', params);
  // }
  //
  // update(params: Object): Observable<any> {
  //   // Logger.silly('point.service', 'update');
  //   return this.http
  //     .put(this.serverUrl + '/post', params);
  // }
  //
  // remove(_id: string): Observable<any> {
  //   // Logger.silly('point.service', 'remove');
  //   let param: URLSearchParams = new URLSearchParams();
  //
  //   param.set("_id", _id.toString());
  //
  //   return this.http
  //     .delete(this.serverUrl + '/post', {search: param});
  // }
}
