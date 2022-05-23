import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.getverifyRecord();
  }

  getverifyRecord() {
    this.loaderService.display(true);
    this.restService.getverifyRecord(this.data.recordId).subscribe(payload => {
      console.log(payload)
      this.records = payload.data;
      if (this.records.length === 0) {
        this.recordFound = "NO"
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    })
  }

  close() {
    this.dialogRef.close();
  }
}
