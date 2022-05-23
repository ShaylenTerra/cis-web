import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-reservation-confirm-dialog',
    templateUrl: './reservation-confirm-dialog.component.html',
    styleUrls: ['./reservation-confirm-dialog.component.css']
})
export class ReservationConfirmDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ReservationConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
    }

    deleteDraft() {
        this.loaderService.display(true);
        this.restService.deleteDraftByDraftId(this.data.draftId).subscribe(res => {
            this.snackbar.openSnackBar('Draft deleted', 'Success');
            this.loaderService.display(false);
            this.dialogRef.close(res);
        }, () => {
            this.loaderService.display(false);
        });
    }

}
