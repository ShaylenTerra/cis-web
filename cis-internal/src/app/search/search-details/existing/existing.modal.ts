import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UtilityService} from '../../../services/utility.service';

@Component({
    selector: 'app-existing-modal',
    templateUrl: 'existing.modal.html',
    styleUrls: ['existing.modal.css']
})

export class ExistingDialogComponent {
    cartData: any;
    url: string;

    constructor(public dialogRef: MatDialogRef<ExistingDialogComponent>,
                public utility: UtilityService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.cartData = data.queryParam;
    }
}
