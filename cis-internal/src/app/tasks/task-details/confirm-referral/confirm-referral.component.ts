import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-confirm-referral',
    templateUrl: './confirm-referral.component.html',
    styleUrls: ['./confirm-referral.component.css']
})
export class ConfirmReferralComponent implements OnInit {

    refNo: any;
    form: FormGroup;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(
        public dialogRef: MatDialogRef<ConfirmReferralComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
        private loaderService: LoaderService,
        private router: Router
    ) {
        this.refNo = this.data.value.ReferenceNumber;
        this.form = this.fb.group({
            referenceNo: this.data.value.ReferenceNumber,
            templateId: Number(this.data.value.TemplateID),
            transactionId: this.data.value.TransactionId,
            userId: this.userId,
            workflowId: this.data.value.WorkflowID,
        });
    }

    ngOnInit() {
    }

    close() {
        this.loaderService.display(true);
        this.restService.notification(this.form.value).subscribe((res => {
            this.router.navigate(['/tasks/task-list']);
            this.loaderService.display(false);
            this.dialogRef.close();
        }), error => {
            this.loaderService.display(false);
        });
    }

}
