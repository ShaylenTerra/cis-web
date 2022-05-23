import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-assign-number-dialog',
  templateUrl: './assign-number-dialog.component.html',
  styleUrls: ['./assign-number-dialog.component.css']
})
export class AssignNumberDialogComponent implements OnInit {

  issuesNumbers: any[] = [];
  constructor(public dialogRef: MatDialogRef<AssignNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBatchDetails();
  }

  getBatchDetails() {
    this.loaderService.display(true);
    this.restService.getBatchDetails(this.data?.draftId).subscribe(payload => {
      if (payload.data !== null) {
        this.issuesNumbers = payload.data?.lodgementBatchSgDocuments;
        
      }
      this.loaderService.display(false);
    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }


  close() {
    this.dialogRef.close();
  }
}
