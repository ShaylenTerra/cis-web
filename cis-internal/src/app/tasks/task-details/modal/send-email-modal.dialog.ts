import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

@Component({
    selector: 'app-send-email-modal',
    templateUrl: 'send-email-modal.dialog.html',
    styleUrls: ['./send-email-modal.dialog.css']
})
export class SendEmailModalComponent {
    response = {
        to: 'requests@dataworld.co.za',
        subject: '',
        email: '',
    };
    body: string;

    constructor(public dialogRef: MatDialogRef<SendEmailModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    emailBodyChanged(event) {
        this.response.email = event.html;
    }
}
