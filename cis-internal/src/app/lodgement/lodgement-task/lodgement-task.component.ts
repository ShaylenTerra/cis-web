import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ReservationAction } from '../../constants/enums';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { MessageDialogComponent } from '../../reservation/reservation-task/message-dialog/message-dialog.component';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { ActionLodgementomponent } from './action-lodgement/action-lodgement.component';

@Component({
  selector: 'app-lodgement-task',
  templateUrl: './lodgement-task.component.html',
  styleUrls: ['./lodgement-task.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class LodgementTaskComponent implements OnInit {

  resubmitData;
  userId: number;

  lodgeData: any;
  lodgeDraftData: any;
  draftId;
  provinceId;
  workflowId;
  readonly = true;
  showDelete = true;
  showCancel = true;
  showModify = true;
  topHeaderMenu = true;
  supportingDoc = true;
  processId: any;
  headerText = "Draft";
  preview = false;
  WorkflowTasksLength;
  tabIndex = 0;
  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private topMenu: TopMenuService,
    private dom: DomSanitizer,
    private formBuilder: FormBuilder
  ) {
    if (this.router.getCurrentNavigation().extras.state === undefined) {
      this.router.navigate(['/lodgement/lodgement-list']);
    }
    this.lodgeData = this.router.getCurrentNavigation().extras.state.lodgeData;
    this.processId = this.lodgeData?.processId
    // this.draftId = this.lodgeData?.draftId;
    /// Action RequiredID for Edit Mode
    /// Resubmit-Modify: if Action RequiredID Resubmit-Modify - 251
    this.draftId = this.lodgeData?.draftId;
    this.resubmitData = this.lodgeData
    // this.lodgeData.actionRequired === 251 ? this.readonly = false : this.readonly = true;
    this.workflowId = this.lodgeData?.workflowId;
    this.provinceId = this.lodgeData?.provinceId;
    if (this.processId !== undefined && this.processId === 239) {
      this.headerText = "Transfer"
    }
    this.getDatabyDraftId();
  }

  getDatabyDraftId() {
    this.restService.getLodgementDraftByWorkFlowId(this.workflowId).subscribe(payload => {
      this.lodgeDraftData = payload.data;
    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }



  ngOnInit() {
    const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userId = userInfoJson.userId;
  }

  nvaigateToLodgementList() {
    this.router.navigate(['/lodgement/lodgement-list']);
  }

  navigateTaskProfile() {
    this.router.navigate(['/task-profile'], { state: { taskDetail: this.lodgeData } });
  }

  getConfigByTag() {
    this.loaderService.display(true);
    this.restService.getConfigByTag('RESERVATION_MODIFY_LIMIT').subscribe((res) => {

        let actionTakenId = ReservationAction.PROCESSACTION;
        let tagValue = Number(res.data.tagValue)
        if (this.WorkflowTasksLength >= tagValue) {
            const dialogRef = this.dialog.open(MessageDialogComponent, {
                width: '50%',
                data: 'Your Resubmit modify limit is exceeded please contact administrator'

            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                if (resultCode === 0) {
                }
            });
        } else {
            const dialogRef = this.dialog.open(ActionLodgementomponent, {
                width: '50%',
                data: {
                    value: 'modify', actionTakenId: actionTakenId, res: this.lodgeData
                }
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                if (resultCode === 0) {
                }
            });
        }
        this.loaderService.display(false);
    }, () => {
        this.loaderService.display(false);
    });
}

  processActionOnDraft(value) {
    let actionTakenId;
    if (value === 'modify') {
        this.getConfigByTag();
    } else {

        switch (value) {
            case 'cancel':
                actionTakenId = ReservationAction.CANCELACTION;
                break;
            case 'delete':
                actionTakenId = ReservationAction.DELETEACTION;
                break;
            case 'modify':
                actionTakenId = ReservationAction.PROCESSACTION;
                break;
        }

        const dialogRef = this.dialog.open(ActionLodgementomponent, {
            width: '50%',
            data: {
                value: value, actionTakenId: actionTakenId, res: this.lodgeData
            }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            if (resultCode === 0) {
            }
        });
    }
}
receiveChildData(data) {
  this.lodgeDraftData = data;
}

enableMenu() {

  switch (this.lodgeData.actionRequired) {
      case ReservationAction.TASKALLOCATION:
      case ReservationAction.APPLICATIONVERIFICATION:
      case ReservationAction.QUALITYASSURANCE:
      case ReservationAction.RESUBMITREQUEST:
      case ReservationAction.REVIEW:
          this.showCancel = false;
          this.showDelete = false;
          this.showModify = false;
          this.topHeaderMenu = false;
          break;
      case ReservationAction.RESUBMITMODIFY:
          this.showCancel = false;
          this.showDelete = false;
          this.showModify = true;
          this.topHeaderMenu = false;
          break;
      case null:
          this.showCancel = true;
          this.showDelete = true;
          this.showModify = true;
          this.topHeaderMenu = true;
  }
}
changeTab (event) {
  this.tabIndex = event.index;
}

}
