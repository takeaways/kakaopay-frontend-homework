import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {config} from "../../app/app.config";
import {RequestOptions} from '@angular/http';

@Injectable()
export class CalendarService {
  private serverUrl = config.serverUrl;

  appEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  sendEvent(eventName: string, data?: any) {
    // Logger.silly('app.service', 'sendEvent');
    let eventData: {name: string, data?: any} = {name: eventName};
    if (data) eventData.data = data;
    this.appEvent.emit(eventData);
  }

  find(queryParams: any): Observable<any> {
    let url = this.serverUrl + '/event' + '/find';

    let params: HttpParams = new HttpParams();
    for(let property in queryParams) {
      if(queryParams.hasOwnProperty(property)) {
        params = params.append(property, JSON.stringify(queryParams[property]));
      }
    }

    return this.http.get(url, {params: params});
  }

  findOne(queryParams: any): Observable<any> {
    let url = this.serverUrl + '/event' + '/findOne';

    let params: HttpParams = new HttpParams();
    for(let property in queryParams) {
      if(queryParams.hasOwnProperty(property)) {
        params = params.append(property, JSON.stringify(queryParams[property]));
      }
    }

    return this.http.get(url, {params: params});
  }

  create(params: Object): Observable<any> {
    return this.http
      .post(this.serverUrl + '/event', params);
  }

  update(params: Object): Observable<any> {
    return this.http
      .put(this.serverUrl + '/event', params);
  }

  remove(_id: string): Observable<any> {
    const params = new HttpParams()
      .set('_id', _id);

    return this.http
      .delete(this.serverUrl + '/event', {params});
  }
}
