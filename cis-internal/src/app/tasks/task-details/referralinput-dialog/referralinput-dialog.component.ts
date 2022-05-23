import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../format-datepicket';

@Component({
    selector: 'app-referralinput-dialog',
    templateUrl: './referralinput-dialog.component.html',
    styleUrls: ['./referralinput-dialog.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
        DatePipe
    ]
})
export class ReferralInputDialogComponent implements OnInit {
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    triggeredOn: any;
    constructor(public dialogRef: MatDialogRef<ReferralInputDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        dialogRef.disableClose = true;
        this.triggeredOn = this.formatDate(data.value.triggeredOn);
    }

    ngOnInit() {
    }

    formatDate(date) {
        const d = new Date(date), year = d.getFullYear();
        let month = '' + (d.getMonth() + 1), day = '' + d.getDate();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
      }
}
