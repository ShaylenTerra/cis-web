import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-common-dailog',
    templateUrl: './common-dailog.component.html',
    styleUrls: ['./common-dailog.component.scss']
})
export class CommonDailogComponent {
    constructor(
        public dialogRef: MatDialogRef<CommonDailogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    }
}
