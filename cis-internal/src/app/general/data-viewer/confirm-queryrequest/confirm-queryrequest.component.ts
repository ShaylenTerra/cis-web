import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-queryrequest',
    templateUrl: './confirm-queryrequest.component.html',
    styleUrls: ['./confirm-queryrequest.component.css']
})
export class ConfirmQueryRequestComponent implements OnInit {
    refNo: any;
    form: FormGroup;
    // userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(
        public dialogRef: MatDialogRef<ConfirmQueryRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.refNo = this.data.value.data.id;
    }

    ngOnInit() {
    }

    close() {
        this.dialogRef.close();
    }

}
