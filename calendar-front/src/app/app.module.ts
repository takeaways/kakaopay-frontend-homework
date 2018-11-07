import { NgModule } from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlCalendarComponent } from './component/control-calendar/control-calendar.component';
import { ContentCalendarComponent } from './component/content-calendar/content-calendar.component';

//Imported Module
import { MatButtonModule, MatIconModule, MatButtonToggleModule } from '@angular/material';
import {CalendarService} from './service/calendar.service';

//External


@NgModule({
  declarations: [
    AppComponent,
    ControlCalendarComponent,
    ContentCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    //Angular Material
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  providers: [
    CalendarService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
