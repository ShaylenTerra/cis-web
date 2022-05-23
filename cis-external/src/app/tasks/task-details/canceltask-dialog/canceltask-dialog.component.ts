import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {ConfirmTaskComponent} from '../../../my-request/confirm-task/confirm-task.component';

@Component({
    selector: 'app-canceltask-dialog',
    templateUrl: './canceltask-dialog.component.html',
    styleUrls: ['./canceltask-dialog.component.css']
})
export class CanceltaskDialogComponent implements OnInit {

    form: FormGroup;
    date;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<CanceltaskDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private dialog: MatDialog) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            actionId: 0,
            notes: ['', Validators.required],
            userId: this.userId,
            workflowId: this.data.value
        });
    }

    ngOnInit() {
    }

    cancelTaskDialog(): void {
        if (this.form.invalid) {
            this.form.get('notes').markAsTouched();
            return;
        } else {
            const dialogRef = this.dialog.open(ConfirmTaskComponent, {
                width: '400px',
                data: {value: this.data.value, notes: this.form.value.notes},
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                this.dialogRef.close();
            });
        }

    }
}
