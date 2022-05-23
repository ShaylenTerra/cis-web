import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-subscription-dialog',
    templateUrl: './subscription-dialog.component.html',
    styleUrls: ['./subscription-dialog.component.css']
})
export class SubscriptionDialogComponent implements OnInit {
    configData: any;
    muncipalityTownship: any;

    constructor(public dialogRef: MatDialogRef<SubscriptionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService) {
    }

    ngOnInit() {
    }

    subscribe() {
        this.muncipalityTownship = this.data.municipalityCode !== '' ?
            this.data.municipalityCode : (this.data.township !== '' ? this.data.township : -1);
        const payload = {
            'frequencyId': this.data.referenceType,
            'location' : this.data.locationName,
            'locationId': this.muncipalityTownship,
            'locationTypeId': this.data.location,
            'prePackageId': this.data.desc.prePackageId,
            'referenceId': this.data.reference.subscription,
            'subscriptionStatus': 1,
            'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
        };
        this.restService.subscribePrePackageConfigs(payload).subscribe((res: any) => {
            if (res.data === null) {
                this.snackbar.openSnackBar(`You have already subscribed ${this.data.desc.name} for ${this.data.referenceType}. Please check your subscription`, 'Warning');
            } else {
                this.snackbar.openSnackBar('Subscription added sucessfully', 'Success');
            }
            this.dialogRef.close(res);
        });
    }
}
