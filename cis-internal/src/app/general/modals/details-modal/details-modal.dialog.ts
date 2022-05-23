import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppDateAdapter, APP_DATE_FORMATS} from '../../../format-datepicket';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

export interface DialogData {
    details;
    type: string;
    securityQuestions?;
}

@Component({
    selector: 'app-details-modal',
    templateUrl: './details-modal.dialog.html',
    styleUrls: ['./details-modal.dialog.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class DetailsModalDialogComponent implements OnInit {
    securityInfo = {
        securityQuestion1: '',
        securityQuestion2: '',
        securityQuestion3: '',
        securityAnswer1: '',
        securityAnswer2: '',
        securityAnswer3: '',
    };
    securityData = {
        securityA1: '',
        securityA2: '',
        securityA3: '',
        securityQ1: '',
        securityQ2: '',
        securityQ3: '',
        securityQTypeCode1: '',
        securityQTypeCode2: '',
        securityQTypeCode3: '',
        userId: ''
    };
    rolesInfo;
    secq1;
    secq2;
    secq3;
    date;
    hasError = false;
    tableColumns: string[] = ['userRoleName', 'userProvinceName', 'isActive'];

    constructor(public dialogRef: MatDialogRef<DetailsModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private snackbar: SnackbarService,
                private restService: RestcallService) {
    }

    ngOnInit() {
        if (this.data.type === 'External') {
            this.restService.getExternalUserDataByUserId(this.data.details.userId).subscribe(response => {
                this.securityInfo = response.data;
                if (this.securityInfo != null) {
                    const userSecq1 = this.securityInfo.securityQuestion1,
                    userSecq2 = this.securityInfo.securityQuestion2,
                    userSecq3 = this.securityInfo.securityQuestion3;
                    this.secq1 = this.data.securityQuestions.filter((x: any) => x.caption === userSecq1)[0];
                    this.secq2 = this.data.securityQuestions.filter((x: any) => x.caption === userSecq2)[0];
                    this.secq3 = this.data.securityQuestions.filter((x: any) => x.caption === userSecq3)[0];
                    this.securityData.securityA1 = this.securityInfo.securityAnswer1;
                    this.securityData.securityA2 = this.securityInfo.securityAnswer2;
                    this.securityData.securityA3 = this.securityInfo.securityAnswer3;
                    this.securityData.securityQ1 = this.secq1.caption;
                    this.securityData.securityQ2 = this.secq2.caption;
                    this.securityData.securityQ3 = this.secq3.caption;
                    this.securityData.securityQTypeCode1 = this.secq1.itemCode;
                    this.securityData.securityQTypeCode2 = this.secq2.itemCode;
                    this.securityData.securityQTypeCode3 = this.secq3.itemCode;
                    this.securityData.userId = this.data.details.userId;
                } else {
                    this.securityInfo = {
                        securityQuestion1: '',
                        securityQuestion2: '',
                        securityQuestion3: '',
                        securityAnswer1: '',
                        securityAnswer2: '',
                        securityAnswer3: '',
                    };
                }
            });
        }
        this.restService.getExternalUserRoleBasedOnUserId(this.data.details.userId).subscribe(response => {
            this.rolesInfo = response.data;
        });
        this.date = new Date(this.data.details.createdDate);
    }

    onSecqChange() {
        if (this.secq1 !== this.secq2 && this.secq2 !== this.secq3 && this.secq3 !== this.secq1) {
            this.securityData.securityQTypeCode1 = this.secq1.itemCode;
            this.securityData.securityQTypeCode2 = this.secq2.itemCode;
            this.securityData.securityQTypeCode3 = this.secq3.itemCode;
            this.securityData.securityQ1 = this.secq1.caption;
            this.securityData.securityQ2 = this.secq2.caption;
            this.securityData.securityQ3 = this.secq3.caption;
            this.hasError = false;
        } else {
            this.snackbar.openSnackBar('Each security question needs to be unique', 'Warning');
            this.hasError = true;
        }
    }

    updateProfile() {
    }

    updateSecurityInfo() {
        if (!this.hasError) {
            this.securityData.securityA1 = this.securityInfo.securityAnswer1;
            this.securityData.securityA2 = this.securityInfo.securityAnswer2;
            this.securityData.securityA3 = this.securityInfo.securityAnswer3;

            this.restService.updateSecurityQuestions(this.securityData).subscribe(data => {
                this.snackbar.openSnackBar('Security Questions Updated Successfully', 'Success');
            }, error => {
                this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
            });
        } else {
            this.snackbar.openSnackBar('Cannot Update. All security questions should be Unique', 'Error');
        }
    }
}
