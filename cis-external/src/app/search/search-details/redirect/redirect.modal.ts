import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UtilityService} from '../../../services/utility.service';

@Component({
    selector: 'app-redirect-modal',
    templateUrl: 'redirect.modal.html',
    styleUrls: ['redirect.modal.css']
})

export class RedirectDialogComponent {
    cartData: any;
    url: string;

    constructor(public dialogRef: MatDialogRef<RedirectDialogComponent>,
                public utility: UtilityService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.cartData = data.queryParam;
        this.url = data.url;
    }

    redirect() {
        this.utility.forcefulRedirectTo(this.url, this.cartData);
    }
}
