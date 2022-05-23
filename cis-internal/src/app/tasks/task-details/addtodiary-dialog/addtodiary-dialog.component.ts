import {DatePipe} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../../format-datepicket';

@Component({
    selector: 'app-addtodiary-dialog',
    templateUrl: './addtodiary-dialog.component.html',
    styleUrls: ['./addtodiary-dialog.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class AddtodiaryDialogComponent implements OnInit {
    todayDate = new Date();
    minDate = new Date();
    form: FormGroup;
    date;
    isSpinnerVisible = false;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<AddtodiaryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private datePipe: DatePipe, private loaderService: LoaderService) {
        this.minDate.setDate(this.minDate.getDate());
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            comment: ['', Validators.required],
            diariseDate: ['', Validators.required],
            userId: this.userId,
            workflowId: this.data.value,
            actionId: this.data.actionId
        });
    }

    ngOnInit() {
    }

    submit() {
        this.loaderService.display(true);
        if (this.form.invalid) {
            this.form.get('diariseDate').markAsTouched();
            this.form.get('comment').markAsTouched();
            this.loaderService.display(false);
            return;
        } else {
            const obj = this.form.value;
            obj.diariseDate.setHours(0, 0, 0, 0);
            this.restService.addDiariseDate(obj).subscribe((res: any) => {
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
                this.loaderService.display(false);
            });
        }

    }

}
