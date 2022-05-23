import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-land-info',
  templateUrl: './land-info.component.html',
  styleUrls: ['./land-info.component.css']
})
export class LandInfoComponent implements OnInit {
  records: any[] = [];
  recordFound: string = "";
  constructor(public dialogRef: MatDialogRef<LandInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restService: RestcallService,
    private snackbar: SnackbarService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getverifyRecord();
  }

  getverifyRecord() {
    this.loaderService.display(true);
    this.restService.getverifyRecord(this.data.value.recordId).subscribe(payload => {
      this.records = payload.data;
      if (this.records.length === 0) {
        this.recordFound = "NO"
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    })
  }

  navigateTaskProfile(workflowId) {
    if (workflowId !== null) {
      this.restService.getWorkFlow(workflowId).subscribe((res) => {
        this.loaderService.display(false);
        this.router.navigate(['/task-profile'], { state: { taskDetail: res.data } });
      });
    } else {
      this.snackbar.openSnackBar('WorkflowId is not available', 'Warning');
    }

  }

  close() {
    this.dialogRef.close();
  }
}
