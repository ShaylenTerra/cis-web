import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { Location } from '@angular/common';
import { LODGEMENTFORM } from '../../constants/enums';

@Component({
  selector: 'app-task-detail-lodgement',
  templateUrl: './task-detail-lodgement.component.html',
  styleUrls: ['./task-detail-lodgement.component.css']
})
export class TaskDetailLodgementComponent implements OnInit {

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
  isTaskDetail = true;
  topHeaderMenu = true;
  supportingDoc = true;
  processId: any;
  headerText = "Draft";
  preview = false;
  processName;
  tabIndex = 0;
  nodeDetails: any;
  batchTab = false;
  numberingTab = false;
  dispatchTab = false;
  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private topMenu: TopMenuService,
    private dom: DomSanitizer,
    private formBuilder: FormBuilder,
    private _location: Location
  ) {
    if (this.router.getCurrentNavigation().extras.state === undefined) {
      this.router.navigate(['/home']);
    }
    this.lodgeData = this.router.getCurrentNavigation().extras.state.lodgeData;
    this.processId = this.lodgeData?.processId
    this.processName = this.lodgeData?.processName;
    // this.draftId = this.lodgeData?.draftId;
    /// Action RequiredID for Edit Mode
    /// Resubmit-Modify: if Action RequiredID Resubmit-Modify - 251
    this.resubmitData = this.lodgeData
    // this.lodgeData.actionRequired === 251 ? this.readonly = false : this.readonly = true;
    this.workflowId = this.lodgeData?.workflowId;
    this.getLodgementDraftByWorkFlowId();
    this.provinceId = this.lodgeData?.provinceId;
  }


  getLodgementDraftByWorkFlowId() {
    this.loaderService.display(true);
    this.restService.getLodgementDraftByWorkFlowId(this.workflowId).subscribe(payload => {
      this.lodgeDraftData = payload.data;
      this.draftId = this.lodgeDraftData?.draftId;
      this.loaderService.display(false);
    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  ngOnInit() {
    const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userId = userInfoJson.userId;
    this.getNodeDetails();
  }

  nvaigateToLodgementList() {
    this._location.back();
  }

  receiveChildData(data) {
    this.lodgeDraftData = data;
  }


  navigateTaskProfile() {
    this.router.navigate(['/task-profile'], { state: { taskDetail: this.lodgeData } });
  }

  changeTab(event) {
    switch (event.tab.textLabel) {
      case 'Applicant Details':
        this.tabIndex = 0;
        break;
      case 'Application Details':
        this.tabIndex = 1;
        break;
      case 'Lodgement Document':
        this.tabIndex = 2;
        break;
      case 'Payment Details':
        this.tabIndex = 3;
        break;
      case 'Annexure':
        this.tabIndex = 4;
        break;
      case 'Summary':
        this.tabIndex = 5;
        break;
      case 'Batch Details':
        this.tabIndex = 6;
        break;
      case 'Numbering':
        this.tabIndex = 7;
        break;
      case 'Request Flow':
        this.tabIndex = 8;
        break;
      case 'Referral Input':
        this.tabIndex = 9;
        break;
      case 'Dispatch':
        this.tabIndex = 10;
        break;
      case 'Decision':
        this.tabIndex = 11;
        break;
    }
  }

  getNodeDetails() {
    this.restService.getNodeDetails(this.lodgeData.processId, this.lodgeData.nodeId)
      .subscribe((res: any) => {
        switch (Number(res.FormID)) {
          case LODGEMENTFORM.REQUESTREVIEW:
            this.batchTab = true;
            this.numberingTab = true;
            this.dispatchTab = true;
            break;
          case LODGEMENTFORM.QUALITYASSURANCE:
            this.batchTab = false;
            this.numberingTab = true;
            this.dispatchTab = true;
            break;
          case LODGEMENTFORM.DISPATCH:
            this.batchTab = false;
            this.numberingTab = true;
            this.dispatchTab = false;
            break;
        }
        this.nodeDetails = res;
      });
  }


}
