import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-subscriptionviewdialog',
  templateUrl: './subscriptionviewdialog.component.html',
  styleUrls: ['./subscriptionviewdialog.component.css']
})
export class SubscriptionViewdialogComponent implements OnInit {
  subscriptionData;
  columns = ['ftpLocation', 'executionDate', 'message', 'nextExecutionDate', 'notificationStatus', 'status'];
  dataSource;
  dataLength;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<SubscriptionViewdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.getPrepackageExecutionStatus();
  }

  getPrepackageExecutionStatus() {
    this.restService.getPrepackageExecutionStatus(this.data.subscriptionId).subscribe(response => {
        this.subscriptionData = response.data;
        this.dataSource = new MatTableDataSource(this.subscriptionData);
        this.dataSource.paginator = this.paginator;
        this.dataLength = this.dataSource.data.length || 0;
    });
  }

}
