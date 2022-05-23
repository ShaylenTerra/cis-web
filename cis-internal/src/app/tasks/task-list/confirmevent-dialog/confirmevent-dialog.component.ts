import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-confirmevent-dialog',
    templateUrl: './confirmevent-dialog.component.html',
    styleUrls: ['./confirmevent-dialog.component.css']
})
export class ConfirmeventDialogComponent implements OnInit {

    form: FormGroup;
    bindObj;
    // userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<ConfirmeventDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private dialog: MatDialog) {
        dialogRef.disableClose = true;
        this.bindObj = this.data.value;
    }

    ngOnInit() {
    }

    submit() {

    }
}
