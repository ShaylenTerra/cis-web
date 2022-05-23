import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-payment-view-details-dialog',
  templateUrl: './payment-view-details-dialog.component.html',
  styleUrls: ['./payment-view-details-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentViewDetailsDialogComponent implements OnInit {
  dataSource;
  dataLength;
  columns = ['documentType', 'purposeType', 'count', 'totalCost'];
  paymentDetailsData: any[] = [];
  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  // @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalAmount = 0;
  totalDoc = 0;
  constructor(public dialogRef: MatDialogRef<PaymentViewDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.loaderService.display(true);
    this.restService.getDocumentSummary(this.data.draftId, this.data.stepId).subscribe((res) => {
      this.loaderService.display(false);
      if (res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          this.totalDoc = this.totalDoc + res.data[i].count;
          this.totalAmount = this.totalAmount + res.data[i].totalCost;
        }
        this.paymentDetailsData = res.data;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.dataSource.data.length || 0;
      }

    }, error => {
      this.loaderService.display(false);
    });
  }


  close() {
    this.dialogRef.close();
  }

  setDataSourceAttributes() {
    if (this.sort !== undefined) {
      this.dataSource.sort = this.sort;
    }

  }

}
