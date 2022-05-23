import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UtilityService} from '../../../services/utility.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-view-map',
    templateUrl: 'view-map.modal.html',
    styleUrls: ['view-map.modal.css']
})

export class ViewMapDialogComponent {
    url: SafeResourceUrl;

    constructor(public dialogRef: MatDialogRef<ViewMapDialogComponent>,
                public utility: UtilityService,
                private dom: DomSanitizer,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.url = this.dom.bypassSecurityTrustResourceUrl(data.url + '&uam=' + environment.uamBaseUrl + '&wt='
                    + environment.triggerUrl);
        console.log(this.url);
    }
}
