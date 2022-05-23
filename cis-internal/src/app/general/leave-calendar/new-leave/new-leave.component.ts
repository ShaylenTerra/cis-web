import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../../format-datepicket';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {SnackbarService} from '../../../services/snackbar.service';
import {RestcallService} from '../../../services/restcall.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import * as constants from '../../../constants/localstorage-keys';
import { LoaderService } from '../../../services/loader.service';

@Component({
    selector: 'app-new-leave',
    templateUrl: './new-leave.component.html',
    styleUrls: ['./new-leave.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class NewLeaveComponent implements OnInit {
    uploadedFileName = 'Upload document';
    fileToUpload: File = null;
    newLeave: FormGroup;
    userId: any;
    provinceId: number;
    leaveTypes: any;

    @ViewChild('timeInput', { static: false } as any) timeCheckbox: ElementRef;

    constructor(public dialogRef: MatDialogRef<NewLeaveComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder, private snackbar: SnackbarService,
                private restService: RestcallService, public datePipe: DatePipe,
                private loaderService: LoaderService) {

        this.newLeave = this.fb.group({
            startDate: ['', Validators.required],
            fromTime: ['08:00 AM', Validators.required],
            toTime: ['05:00 PM', Validators.required],
            endDate: ['', Validators.required],
            description: ['', Validators.required],
            leaveType: [this.leaveTypes, Validators.required]
        }, {validators: this.endDateValidation});

    }

    get endDate() {
        return this.newLeave.get('endDate');
    }

    get startDate() {
        return this.newLeave.get('startDate');
    }

    ngOnInit(): void {
        const userInfo = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO));
        this.userId = userInfo && userInfo.userId || 26;
        this.provinceId = userInfo.provinceId;
        this.restService.getListItems(101).subscribe(res => {
            this.leaveTypes = res.data;
        });

    }

    onClose() {
        this.dialogRef.close();
    }

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    addNewLeave() {
        const formData: FormData = new FormData();
        formData.append('description', this.newLeave.value.description);
        formData.append('endDate', String(this.newLeave.value.endDate.getFullYear()) + '-'
            + String('0' + (this.newLeave.value.endDate.getMonth() + 1)).slice(-2) + '-'
            + String('0' + (this.newLeave.value.endDate.getDate())).slice(-2));
        formData.append('startDate', String(this.newLeave.value.startDate.getFullYear()) + '-'
            + String('0' + (this.newLeave.value.startDate.getMonth() + 1)).slice(-2) + '-'
            + String('0' + (this.newLeave.value.startDate.getDate())).slice(-2));
        formData.append('userId', this.userId);

        if (this.timeCheckbox['checked'] === true) {

            formData.append('timeSelected', '1');
            formData.append('fromTime', this.newLeave.value.fromTime.length === 7 ?
                            '0' + this.newLeave.value.fromTime : this.newLeave.value.fromTime );
            formData.append('toTime', this.newLeave.value.toTime.length === 7 ?
                            '0' + this.newLeave.value.toTime : this.newLeave.value.toTime);
        }
        if (this.fileToUpload != null) {
            formData.append('multipartFile', this.fileToUpload[0]);
        }

        formData.append('leaveType', this.newLeave.value.leaveType);
        formData.append('leaveTypeId', this.newLeave.value.leaveType.itemId);
        this.loaderService.display(true);
        this.restService.createUserHoliday(formData).subscribe(data => {
            this.loaderService.display(false);
            this.dialogRef.close();
            this.snackbar.openSnackBar('Leave added successfully', 'Success');
        }, error => {
            this.snackbar.openSnackBar('Error creating Holiday', 'Error');
            this.loaderService.display(false);
        });
    }

    endDateValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const startDate = control.get('startDate');
        const endDate = control.get('endDate');
        if (startDate.value > endDate.value) {
            endDate.setErrors({...endDate.errors, ...{'smallDate': true}});
        }
        return startDate && endDate && startDate.value > endDate.value ? {smallDate: 'Start date can not be greater than end date.'} : null;
    }
    setTime(checked, selectedDate, source) {

        if (checked) {
            const officeDate = this.datePipe.transform(selectedDate, 'dd/MMM/yyyy');
            this.restService.getOfficeTimingByProvinceIdAndDate(officeDate, this.provinceId).subscribe(res => {
                if (res.data) {
                    if (source === 1) {
                        this.newLeave.patchValue({
                            fromTime: res.data.fromTime,
                        });
                    }
                    if (source === 2) {
                        this.newLeave.patchValue({
                            toTime: res.data.toTime
                        });
                    }
                }
            }, error => {
                this.snackbar.openSnackBar('Error setting the time', 'Error');
            });
        }


    }
}
