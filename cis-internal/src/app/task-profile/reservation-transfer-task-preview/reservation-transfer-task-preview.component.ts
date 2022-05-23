import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-reservation-transfer-task-preview',
  templateUrl: './reservation-transfer-task-preview.component.html',
  styleUrls: ['./reservation-transfer-task-preview.component.css']
})
export class ReservationTransferTaskPreviewComponent implements OnInit {

  resDraftData: any;
  resData: any;
  workflowId;
  processName = '';
  provinceId;
  readonly = true;
  showtab = true;
  supportingDoc = true;
  draftId;

  applicantReservation = true;
  applicationReservation = true;
  LandParcelReservation = true;
  TransfereeDetailsReservation = true;
  TransferRequestDetailsReservation = true;
  AnnexureReservation = true;
  AnnexureLodgement = true;
  constructor(public dialogRef: MatDialogRef<ReservationTransferTaskPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private fb: FormBuilder,) {

    this.resData = data;
    this.workflowId = this.resData?.workflowId;
    this.processName = this.resData?.processName
    this.provinceId = this.resData?.provinceId;
  }

  ngOnInit(): void {
    this.getDatabyDraftId();
  }

  getDatabyDraftId() {
    this.restService.getReservationDraftByWorkFlowId(this.workflowId).subscribe(payload => {
      this.resDraftData = payload.data;
      this.draftId = this.resDraftData?.draftId;
    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
    });
  }

  receiveChildData(data) {
    this.resDraftData = data;
  }


  close() {
    this.dialogRef.close();
  }
}
