import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {DialogMessageComponent} from './dialog-message.component';

@Injectable()
export class DialogService {

  dialogRef: MatDialogRef<DialogMessageComponent>;
  config: MatDialogConfig = new MatDialogConfig();

  constructor(public matDialog: MatDialog) {
  }

  confirm(title, message) {
    this.dialogRef = this.matDialog.open(DialogMessageComponent, this.config);
    this.dialogRef.componentInstance.type = 'confirm';
    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;

    return this.dialogRef.afterClosed();
  }

  message(title, message) {
    this.config.width = '400px';
    this.dialogRef = this.matDialog.open(DialogMessageComponent, this.config);
    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;

    return this.dialogRef.afterClosed();
  }
}
