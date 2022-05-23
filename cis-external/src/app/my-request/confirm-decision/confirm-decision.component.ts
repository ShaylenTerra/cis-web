import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-confirm-decision',
    templateUrl: './confirm-decision.component.html',
    styleUrls: ['./confirm-decision.component.css']
})
export class ConfirmDecisionComponent implements OnInit {
    refNo: any;
    form: FormGroup;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(
        public dialogRef: MatDialogRef<ConfirmDecisionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
        private loaderService: LoaderService,
        private router: Router
    ) {
        this.refNo = this.data.value.referenceNumber;
        this.form = this.fb.group({
            referenceNo: this.data.value.referenceNumber,
            templateId: Number(this.data.value.templateId),
            transactionId: this.data.value.transactionId,
            userId: this.userId,
            workflowId: this.data.value.workflowId,
        });
    }

    ngOnInit() {
    }

    close() {
        this.loaderService.display(true);
        this.restService.notification(this.form.value).subscribe((res => {
            this.router.navigate(['/home']);
            this.loaderService.display(false);
            this.dialogRef.close();
        }), error => {
            this.loaderService.display(false);
        });
    }

}
