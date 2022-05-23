import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-postquery-dialog',
    templateUrl: './postquery-dialog.component.html',
    styleUrls: ['./postquery-dialog.component.css']
})
export class PostqueryDialogComponent implements OnInit {

    refNo: any;
    form: FormGroup;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(
        public dialogRef: MatDialogRef<PostqueryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
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
        this.restService.notification(this.form.value).subscribe((res => {
            this.dialogRef.close();
        }));
    }

}
