import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SendSMSModalComponent } from '../../tasks/task-details/modal/send-sms-modal.dialog';
import { NotifyApplicantDialogComponent } from './notify-applicant-dialog/notify-applicant-dialog.component';
import { PaymentViewDetailsDialogComponent } from './payment-view-details-dialog/payment-view-details-dialog.component';
import { VerifyPaymentDialogComponent } from './verify-payment-dialog/verify-payment-dialog.component';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    DatePipe
  ]
})
export class PaymentDetailsComponent implements OnInit, OnChanges {
  @Input() preview;
  @Input() draftData;
  @Input() draftId;
  @Input() readonly;
  @Input() hideData;
  uploadedFileName = 'Upload document';
  fileToUpload: File = null;
  form: FormGroup;
  columns = ['Sno', 'payDate', 'amount', 'refNumber', 'receiptNo', 'paymentMethod', 'notes', 'status', 'Action'];
  data;
  dataSource;
  dataLength;
  tableCols: Array<string>;
  dayTimingsCols: Array<string>;
  timings;
  provinces: [];
  startDate;
  startTime;
  endDate;
  endTime;
  occasion;
  province;
  type = 'office';
  table = false;
  total = 0;
  lodgementDraftPaymentsData: any[] = [];
  paymentDetailsData: any[] = []
  paymentMethodData: any[] = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  currentDate = new Date();
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  totalAmount = 0;
  totalDoc = 0;
  constructor(public dialog: MatDialog, private snackbar: SnackbarService,
    private restService: RestcallService, private fb: FormBuilder, public datePipe: DatePipe,
    private loaderService: LoaderService, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
    this.tableCols = ['province', 'timings', 'edit'];
    this.dayTimingsCols = ['day', 'from', 'to'];
    this.form = this.fb.group({
      'PaymentDate': ['', Validators.required],
      'PaidAmount': ['', Validators.required],
      'ReferenceNumber': ['', Validators.required],
      'Notes': [''],
      'uploadedFileName': ['', Validators.required],
      'PaymentMethod': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.initialize();
  }

  selectFile(file: FileList) {
    this.fileToUpload = file.item(0);
    this.uploadedFileName = this.fileToUpload.name;
    this.form.patchValue({
      uploadedFileName: this.uploadedFileName
    })
  }

  viewDetails() {

    const dialogRef = this.dialog.open(PaymentViewDetailsDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { draftId: this.draftId, stepId: 0 }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }


  listItemsByListCodes() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.getListItems(386),
      this.restService.getLodgementDraftPayments(this.draftId),
      this.restService.getDocumentSummary(this.draftId, 0)
    ]).subscribe(([paymentMethod, LodgementDraftPayments, documentSummary]) => {
      this.total = 0;
      this.totalAmount = 0;
      this.totalDoc = 0;
      this.paymentMethodData = paymentMethod.data;
      for (let i = 0; i < LodgementDraftPayments.data.length; i++) {
        LodgementDraftPayments.data[i].Sno = i + 1;
      }
      this.lodgementDraftPaymentsData = LodgementDraftPayments.data;

      this.lodgementDraftPaymentsData.forEach((el, i) => {
        this.total = this.total + Number(el.amount);
      });
      if (documentSummary.data.length > 0) {
        for (let i = 0; i < documentSummary.data.length; i++) {
          this.totalDoc = this.totalDoc + documentSummary.data[i].count;
          this.totalAmount = this.totalAmount + documentSummary.data[i].totalCost;
        }
        this.paymentDetailsData = documentSummary.data;

      }

      this.refreshtable()
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  refreshtable() {
    this.dataSource = new MatTableDataSource(this.lodgementDraftPaymentsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.dataSource.data.length || 0;
  }

  removePayment(payId) {
    this.loaderService.display(true);
    this.restService.deleteDraftPayment(payId).subscribe((res) => {
      this.loaderService.display(false);
      this.listItemsByListCodes();
    })
  }
  verifyPayment(row) {

    const dialogRef = this.dialog.open(VerifyPaymentDialogComponent, {
      width: '550px',
      height: 'auto',
      data: row,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.initialize();
    });
  }

  notifyApplicant(row) {

    // const dialogRef = this.dialog.open(NotifyApplicantDialogComponent, {
    //   width: '500px',
    //   height: 'auto',
    //   data: row,
    // });
    // dialogRef.afterClosed().subscribe(res => {
    //   this.initialize();
    // });

    const dialog = this.dialog.open(SendSMSModalComponent, {
      width: '50%'
    });

    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.restService.sendSMS(data.to, data.body).subscribe(() => {
          this.snackbar.openSnackBar('SMS send Succesfully', 'Success');
        });
      }
    });
  }



  saveLodgementPayment(val) {

    if (!this.form.valid) {
      this.form.get('PaymentDate').markAsTouched();
      this.form.get('PaidAmount').markAsTouched();
      this.form.get('ReferenceNumber').markAsTouched();
      this.form.get('uploadedFileName').markAsTouched();
      this.form.get('PaymentMethod').markAsTouched();
    } else {
      let data = this.form.value;
      // let date = new Date(data.PaymentDate).toISOString();
      // let name = this.otherDocType.filter(x => x.itemId === data.documentType)[0].caption;
      const formData: FormData = new FormData();
      // formData.append('docName', this.uploadedFileName);
      formData.append('draftId', this.draftId);
      formData.append('amount', data.PaidAmount,);
      formData.append('notes', data.Notes);
      formData.append('refNumber', data.ReferenceNumber);
      formData.append('receiptNo', "");
      formData.append('userId', this.userId);
      formData.append('payMethodItemId', data.PaymentMethod);
      formData.append('payDate', this.datePipe.transform(data.PaymentDate, 'yyyy-MM-ddTHH:mm:ss.sss'));
      formData.append('document', this.fileToUpload);
      this.loaderService.display(true);
      this.restService.addLodgementPayment(formData).subscribe((res: any) => {
        this.listItemsByListCodes();
        this.form.reset();
        this.fileToUpload = null;
        this.uploadedFileName = 'Upload document';
        this.snackbar.openSnackBar(val + ' details updated Successfully', 'Success');
        this.loaderService.display(false);
      }, () => {
        this.loaderService.display(false);
      });
    }
  }

  viewDoc(paymentId, fileName) {
    this.loaderService.display(true);
    this.restService.getDraftPaymentDocument(paymentId).subscribe((res) => {
      this.downloadBlob(res, fileName);
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    })
  }

  downloadBlob(blob, name) {
    this.loaderService.display(true);
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    // link.download = name;

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
    this.loaderService.display(false);
  }

  generateInvoice() {
    this.loaderService.display(true);
    this.restService.generatePerformaInvoice(this.draftId).subscribe((res) => {
      this.downloadBlob(res, 'Invoice');
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    })
  }
  ngOnChanges() {
    this.draftData = this.draftData;
    this.initialize();
  }

  initialize() {
    this.listItemsByListCodes();

    if (this.preview === true) {
      this.columns = ['Sno', 'payDate', 'amount', 'refNumber', 'receiptNo', 'paymentMethod', 'notes', 'status'];
    }
  }
}
