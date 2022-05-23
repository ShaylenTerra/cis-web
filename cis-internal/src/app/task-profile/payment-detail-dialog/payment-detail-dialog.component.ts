import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-payment-detail-dialog',
  templateUrl: './payment-detail-dialog.component.html',
  styleUrls: ['./payment-detail-dialog.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
]
})
export class PaymentDetailDialogComponent implements OnInit {
  uploadpaymentform: FormGroup;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  paymentInfo;
  paymentFileToUpload: File = null;
  uploadedPaymentFileName = 'Upload document';
  constructor(public dialogRef: MatDialogRef<PaymentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService) {
      this.uploadpaymentform = this.fb.group({
          file: '',
          comments: '',
          paymentId: '',
          documentTypeId: 133,
          paymentReferenceNo: '',
          invoiceAmount: '',
          paymentDate: '',
          userId: '',
          paidAmount: '',
          workflowId: '',
          invoiceDueDate: '',
      });
     }

  ngOnInit(): void {
    this.getPaymentInfo();
  }

  getPaymentInfo() {
    this.restService.getPaymentInfo(this.data.workflowId).subscribe(payload => {
        this.paymentInfo = payload.data;
        if (this.paymentInfo !== null) {
          this.uploadpaymentform.patchValue({
            comments: this.paymentInfo.comments,
            documentTypeId: 133,
            paymentReferenceNo: this.paymentInfo.paymentReferenceNo,
            invoiceAmount: this.paymentInfo.invoiceAmount,
            paymentDate: this.paymentInfo.paymentDate,
            userId: this.paymentInfo.userId,
            paidAmount: this.paymentInfo.paidAmount,
            workflowId: this.paymentInfo.workflowId,
            invoiceDueDate: '',
          });
      }
    });
  }

  downloadInvoice() {
    this.loaderService.display(true);
    if (this.paymentInfo !== null) {
      this.restService.downloadInvoicePdf(this.paymentInfo.workflowId).subscribe((res: any) => {
        this.downloadBlob(res, 'invoice.pdf');
        this.loaderService.display(false);
    }, error => {
        this.loaderService.display(false);
    });
    }
  }
  downloadBlob(blob, name) {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    // Remove link from body
    document.body.removeChild(link);
  }
}
