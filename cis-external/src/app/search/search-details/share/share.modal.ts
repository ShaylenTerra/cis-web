import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '../../../services/snackbar.service';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';

@Component({
    selector: 'app-share-modal',
    templateUrl: 'share.modal.html',
    styleUrls: ['share.modal.css']
})

export class ShareDialogComponent implements OnInit {
    inputForm: FormGroup;
    emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$';
    constructor(public dialogRef: MatDialogRef<ShareDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
        private restService: RestcallService, private snackbar: SnackbarService,
        private loaderService: LoaderService) {
        dialogRef.disableClose = true;
            this.inputForm = this.fb.group({
                emailId: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
                recordId: data.recordId,
                userId: JSON.parse(sessionStorage.getItem('userInfo')).userId
            });
        }

    ngOnInit() {
    }

    submit() {
        this.loaderService.display(true);
        if (this.inputForm.invalid) {
            this.inputForm.get('emailId').markAsTouched();
            this.loaderService.display(false);
            return;
        } else {
            this.restService.share(this.inputForm.value).subscribe((res: any) => {
                this.loaderService.display(false);
                if (res.code === 50000) {
                    this.snackbar.openSnackBar('Something went wrong', 'Error');
                } else {
                    this.snackbar.openSnackBar('Shared to email', 'Success');
                }
                this.dialogRef.close();
            }, error => {
                this.loaderService.display(false);
            });
        }
    }
}
