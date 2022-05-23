import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-view-review-info',
  templateUrl: './view-review-info.component.html',
  styleUrls: ['./view-review-info.component.css']
})
export class ViewReviewInfoComponent implements OnInit {

  dataSource: any;
  dataLength: number;
  dataColumns = ['userName', 'action', 'postedDate', 'actionDone', 'dated', 'context', 'timeSpend'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<ViewReviewInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private datePipe: DatePipe, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.createProductivityForWorkflow();
  }

  createProductivityForWorkflow() {
    this.loaderService.display(true);
    this.restService.createProductivityForWorkflow(this.data.workflowId).subscribe((res: any) => {
      this.getTaskDurationDetails();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  getTaskDurationDetails() {
    this.loaderService.display(true);
    this.restService.getTaskDurationDetails(this.data.workflowId).subscribe((res: any) => {
      this.dataSource = res.data;
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.paginator = this.paginator;
      this.dataLength = this.dataSource.data.length || 0;
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
