// Angular
import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'dialog-message',
  templateUrl: './dialog-message.component.html'
})
export class DialogMessageComponent {
  type;
  title;
  message;

  constructor(public dialogRef: MatDialogRef<DialogMessageComponent>) {}

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onKeypress(event) {
    if (event.keyCode == 13)
      this.confirm();
  }
}
