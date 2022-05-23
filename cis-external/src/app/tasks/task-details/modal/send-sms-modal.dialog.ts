import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

@Component({
    selector: 'app-send-sms-modal',
    templateUrl: 'send-sms-modal.dialog.html',
    styleUrls: ['./send-sms-modal.dialog.css']
})
export class SendSMSModalComponent {
    response = {
        to: 0,
        body: '',
    };

    constructor(public dialogRef: MatDialogRef<SendSMSModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }
}
