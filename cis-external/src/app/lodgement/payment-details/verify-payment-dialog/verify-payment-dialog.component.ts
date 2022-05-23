import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-verify-payment-dialog',
  templateUrl: './verify-payment-dialog.component.html',
  styleUrls: ['./verify-payment-dialog.component.css']
})
export class VerifyPaymentDialogComponent implements OnInit {
  receiptNumber;
  constructor(public dialogRef: MatDialogRef<VerifyPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
  }

  verifyPayment() {
    const obj = {
      "amount": this.data.amount,
      "dated": this.data.dated,
      "docName": this.data.docName,
      "draftId": this.data.draftId,
      "notes": this.data.notes,
      "payDate": this.data.payDate,
      "payId": this.data.payId,
      "payMethodItemId": this.data.payMethodItemId,
      "paymentMethod": this.data.paymentMethod,
      "receiptNo": this.receiptNumber,
      "refNumber": this.data.refNumber,
      "status": this.data.status,
      "statusItemId": this.data.statusItemId,
      "userId": this.data.userId
    }
    this.loaderService.display(true);
      this.restService.updateDraftPayment(obj).subscribe((res: any) => {
        this.snackbar.openSnackBar('Payment verified successfully', 'Success');
        this.loaderService.display(false);
        this.dialogRef.close();
      }, () => {
        this.loaderService.display(false);
      });
  }

  close() {
    this.dialogRef.close();
  }

}
