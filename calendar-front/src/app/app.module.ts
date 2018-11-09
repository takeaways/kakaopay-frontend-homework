//Angular
import { NgModule } from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//Imported Module
import { MatButtonModule, MatIconModule, MatButtonToggleModule } from '@angular/material';

//In Source
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlCalendarComponent } from './component/control-calendar/control-calendar.component';
import { ContentCalendarComponent } from './component/content-calendar/content-calendar.component';
import { DialogEventManageComponent } from './component/dialog-event-manage/dialog-event-manage.component';
import {CalendarService} from './service/calendar.service';

@NgModule({
  declarations: [
    AppComponent,
    ControlCalendarComponent,
    ContentCalendarComponent,
    DialogEventManageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    //Angular Material
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule
  ],
  providers: [
    CalendarService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
