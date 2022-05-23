import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-lodgement-task-preview',
  templateUrl: './lodgement-task-preview.component.html',
  styleUrls: ['./lodgement-task-preview.component.css']
})
export class LodgementTaskPreviewComponent implements OnInit {
  lodgeData: any;
  workflowId;
  processName = '';
  provinceId;
  lodgeDraftData: any;
  draftId;
  userId: number;
  preview = true;
  readonly = true;
  applicantLodgement = true;
  applicationLodgement = true;
  lodgementDocument = true;
  paymentDetails = true;
  annexureLodgement = true;
  constructor(public dialogRef: MatDialogRef<LodgementTaskPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService,
    private snackbar: SnackbarService
  ) {
    this.lodgeData = data;
    this.workflowId = this.lodgeData?.workflowId;
    this.processName = this.lodgeData?.processName
    this.provinceId = this.lodgeData?.provinceId;
  }

  ngOnInit(): void {
    const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userId = userInfoJson.userId;
    this.getDatabyDraftId();
  }

  getDatabyDraftId() {
    this.lodgeData = this.data.value;
    this.restService.getLodgementDraftByWorkFlowId(this.workflowId).subscribe(payload => {
      this.lodgeDraftData = payload.data;
      this.draftId = this.lodgeDraftData?.draftId;
    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
    });
  }

  close() {
    this.dialogRef.close();
  }
}
