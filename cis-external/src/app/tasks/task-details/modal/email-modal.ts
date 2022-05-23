import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import { RestcallService } from '../../../services/restcall.service';
import { LoaderService } from '../../../services/loader.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-email-modal',
    templateUrl: 'email-modal.html',
    styleUrls: ['./email-modal.css']
})
export class EmailModalComponent {
    body = '';
    subject = '';

    constructor(public dialogRef: MatDialogRef<EmailModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restService: RestcallService,
                private loaderService: LoaderService,
                private sanitizer: DomSanitizer,
                private snackbar: SnackbarService
                ) {
        this.loaderService.display(true);
        this.restService.previewEmail(data).subscribe((res: any) => {
            this.body = res.data.body; // this.sanitizer.bypassSecurityTrustHtml(res.data.body).toString();
            this.subject = res.data.subject;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    updateTemplate() {
        const payload = {
            'email': {
                'body': this.body,
                'subject': this.subject
            },
            'workflowId': this.data
        };
        this.restService.updateInvoiceEmailTemplate(payload).subscribe((res: any) => {
            this.snackbar.openSnackBar('Invoice email template updated', 'Success');
            this.dialogRef.close();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }
}
