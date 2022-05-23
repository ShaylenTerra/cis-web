import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-mark-as-pending',
    templateUrl: './mark-as-pending.component.html',
    styleUrls: ['./mark-as-pending.component.css']
})
export class MarkAsPendingComponent implements OnInit {
    form: FormGroup;
    date;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<MarkAsPendingComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private dialog: MatDialog,
                private loaderService: LoaderService) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            userId: this.userId,
            notes: ['', Validators.required],
            workflowId: this.data.value.workflowId
        });
    }

    ngOnInit() {
    }


    submit() {
        if (this.form.invalid) {
            this.form.get('notes').markAsTouched();
            return;
        } else {
            this.loaderService.display(true);
            this.restService.markWorkflowPending(this.form.value).subscribe((res: any) => {
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
                this.loaderService.display(false);
                this.dialogRef.close();
            });
        }

    }

}
