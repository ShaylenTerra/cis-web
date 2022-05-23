import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../../services/snackbar.service';
import {RestcallService} from '../../../services/restcall.service';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../../format-datepicket';

export class ScaleModel {
    name = '';
    description = '';
    eDate: Date = new Date();
}

@Component({
    selector: 'app-fee-modal',
    templateUrl: 'new-fee-modal.html',
    styleUrls: ['./new-fee-modal.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class NewFeeModalComponent {
    uploadedFileName = 'Upload document';
    fileToUpload: File = null;
    scaleForm: FormGroup;
    minDate = new Date();
    scale: ScaleModel = new ScaleModel();
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<NewFeeModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder, private snackbar: SnackbarService,
                private restService: RestcallService) {
        this.minDate.setDate(this.minDate.getDate());
        dialogRef.disableClose = true;
        this.scaleForm = this.fb.group({
            feeScaleName: ['', Validators.required],
            description: ['', Validators.required],
            effectiveDate: ['', Validators.required]
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    addFeeScale() {
        const dateStr = this.scaleForm.value.effectiveDate.toISOString();
        const formData: FormData = new FormData();
        formData.append('fileName', this.uploadedFileName);
        if (this.fileToUpload !== null) {
            formData.append('multipartFile', this.fileToUpload[0]);
        }
        formData.append('effectiveDate', dateStr);
        formData.append('description', this.scaleForm.value.description);
        formData.append('feeScaleName', this.scaleForm.value.feeScaleName);
        formData.append('userId', this.userId);
        this.restService.addNewFeeScale(formData).subscribe(() => {
                this.dialogRef.close();
                this.snackbar.openSnackBar('Added new FeeScale', 'Success');
            },
            error => {
                this.snackbar.openSnackBar('Unknown error while saving information.', 'Error');
            });
    }
}
