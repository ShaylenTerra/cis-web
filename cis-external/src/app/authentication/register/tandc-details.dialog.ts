import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-tandc-details-dialog',
    templateUrl: 'tandc-details.dialog.html',
    styleUrls: ['./tandc-details.dialog.css']
})
export class TAndCDialogComponent {
msg: any;
    constructor(public dialogRef: MatDialogRef<TAndCDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public restService: RestcallService) {
                    this.getTemplate();
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    getTemplate() {
        this.restService.tcTemplate(61).subscribe(payload => {
            this.msg = payload.data.pdfDetails;
        }, error => {
        });
    }
}
