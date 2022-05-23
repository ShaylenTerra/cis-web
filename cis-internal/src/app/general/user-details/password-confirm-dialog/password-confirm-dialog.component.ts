import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-password-confirm-dialog',
    templateUrl: './password-confirm-dialog.component.html',
    styleUrls: ['./password-confirm-dialog.component.css']
})
export class PasswordConfirmDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<PasswordConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
    }

    sendPassword() {
        this.loaderService.display(true);
        this.restService.resetPassword(this.data).subscribe((res: any) => {
            if (res.code === 50000) {
                this.snackbar.openSnackBar(`Error occured. Password not sent to user email`, 'Error');
            } else {
                this.snackbar.openSnackBar(`Password sent to user email`, 'Success');
            }
            this.loaderService.display(false);
            this.dialogRef.close();
        }, () => {
            this.loaderService.display(false);
        });
    }
}
