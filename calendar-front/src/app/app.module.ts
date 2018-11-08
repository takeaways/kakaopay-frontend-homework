import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlCalendarComponent } from './component/control-calendar/control-calendar.component';
import { ContentCalendarComponent } from './component/content-calendar/content-calendar.component';

//Imported Module
import { MatButtonModule, MatIconModule, MatButtonToggleModule } from '@angular/material';
import {CalendarService} from './service/calendar.service';

@NgModule({
  declarations: [
    AppComponent,
    ControlCalendarComponent,
    ContentCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

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
