import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-raise-query-modal',
    templateUrl: './raise-query-modal.dialog.html',
    styleUrls: ['raise-query-modal.dialog.css']
})
export class RaiseQueryModalDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<RaiseQueryModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
    }

    notify() {
        this.restService.notificationWithoutToken(this.data.tempData).subscribe(response => {
        });
    }
}
