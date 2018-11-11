//Angular
import { NgModule } from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconModule, MatButtonToggleModule,
        MatDialogModule, MatFormFieldModule, MatInputModule,
        MatDatepickerModule, MatNativeDateModule, MatMenuModule
} from '@angular/material';

//external module
import { NgDragDropModule } from 'ng-drag-drop';

//In Source
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlCalendarComponent } from './component/control-calendar/control-calendar.component';
import { ContentCalendarComponent } from './component/content-calendar/content-calendar.component';
import { DialogEventManageComponent } from './component/dialog-event-manage/dialog-event-manage.component';
import { DialogMessageComponent } from './component/dialog-message/dialog-message.component';
import { CalendarService } from './service/calendar.service';
import { DialogService } from './component/dialog-message/dialog-message.service';

@NgModule({
  declarations: [
    AppComponent,
    ControlCalendarComponent,
    ContentCalendarComponent,
    DialogEventManageComponent,
    DialogMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,

    //Angular Material
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,

    //external Module
    NgDragDropModule.forRoot()
  ],
  providers: [
    CalendarService,
    DialogService
  ],
  entryComponents: [
    DialogEventManageComponent,
    DialogMessageComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
