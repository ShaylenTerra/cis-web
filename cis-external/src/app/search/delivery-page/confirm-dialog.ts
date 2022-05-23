import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-common-dailog',
    templateUrl: './confirm-dialog.html',
    styleUrls: ['./confirm-dialog.css']
})
export class ConfirmDailogComponent {
    requestCode = 'INFO0012KZN';
    workflowId;
    decision = 'pending';

    constructor(
        public dialogRef: MatDialogRef<ConfirmDailogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.requestCode = this.data.requestCode;
        this.workflowId = this.data.workflowId;
    }

    get invokeChangeDecision() {
        return this.changeDecision.bind(this);
    }

    changeDecision(value) {
        this.decision = value;
    }
}
