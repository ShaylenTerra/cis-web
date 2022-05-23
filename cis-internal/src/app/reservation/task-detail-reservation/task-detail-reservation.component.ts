import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { ReservationPreviewDialogComponent } from '../reservation-draft/reservation-preview/reservation-preview-dialog.component';

@Component({
  selector: 'app-task-detail-reservation',
  templateUrl: './task-detail-reservation.component.html',
  styleUrls: ['./task-detail-reservation.component.css']
})
export class TaskDetailReservationComponent implements OnInit {
  resData: any;
  resubmitData;
  resDraftData: any;
  draftId;
  provinceId;
  workflowId;
  readonly = true;
  showtab = true;
  supportingDoc = false;
  processName = '';
  actionRequired;
  actionRequiredStatus = true;
  constructor(private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private topMenu: TopMenuService,
    private dom: DomSanitizer,
    private formBuilder: FormBuilder,
    private _location: Location) {

    if (this.router.getCurrentNavigation().extras.state === undefined) {
      this.router.navigate(['/home']);
    }
    this.resData = this.router.getCurrentNavigation().extras.state.resData;

    this.actionRequired = this.resData?.actionRequired
    this.processName = this.resData?.processName
    if (this.processName == 'Reservation Transfer' && this.actionRequired == 15) {
      this.actionRequiredStatus = false;
    }

    if (this.resData.actionRequired === '247' || this.resData.actionRequired === '250') {
      this.showtab = false;
    } else {
      this.showtab = true;
    }
    this.workflowId = this.resData?.workflowId;
    this.provinceId = this.resData?.provinceId;
    this.getDatabyWorkflowId();
  }

  ngOnInit(): void {
  }

  getDatabyWorkflowId() {
    this.restService.getReservationDraftByWorkFlowId(this.workflowId).subscribe(payload => {
      this.resDraftData = payload.data;
      this.draftId = this.resDraftData?.draftId;
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  getDatabyDraftId() {
    this.restService.getReservationDraftById(this.resData.draftId).subscribe(payload => {
      this.resDraftData = payload.data;
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  previewDraft() {
    const dialogRef = this.dialog.open(ReservationPreviewDialogComponent, {
      width: '100%',
      height: 'auto',
      data: this.resDraftData
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  nvaigateToReservationList() {
    this._location.back();
  }

  modifyDraft() {
    this.readonly = !this.readonly;
  }

  receiveChildData(data) {
    this.resDraftData = data;
  }

  navigateTaskProfile() {
    this.router.navigate(['/task-profile'], { state: { taskDetail: this.resData } });
  }
}
