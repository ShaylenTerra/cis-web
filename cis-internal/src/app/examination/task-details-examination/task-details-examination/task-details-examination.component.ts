import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TopMenuService } from '../../../services/topmenu.service';
import { Location } from '@angular/common';
import { EXAMINATIONFORM } from '../../../constants/enums';
@Component({
  selector: 'app-task-details-examination',
  templateUrl: './task-details-examination.component.html',
  styleUrls: ['./task-details-examination.component.css']
})
export class TaskDetailsExaminationComponent implements OnInit {

  examData: any;
  lodgeDraftData: any;
  draftId: any;

  /*Tab variables*/
  tabIndex = 0;
  nodeDetails: any;

  signApprovalTab = false;
  postApprovalTab = false;
  dispatchTab = false;
  docketTab = true;

  /* Examination */
  examinationDetails: any;
  batchDetails

  constructor(  private router: Router,
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
      this.examData = this.router.getCurrentNavigation().extras.state.examData;
      this.getExaminationDetailsByWorkflowId();
    }

  ngOnInit(): void {
    this.getNodeDetails();
  }

  navigateToExaminationList() {
    this._location.back();
  }
 
   changeTab (event) {
    switch (event.tab.textLabel) {
      case 'Lodgement Details':
            this.tabIndex = 0;
          break;
     /*  case 'Batch Management':
            this.tabIndex = 1;
          break; */
      case 'Docket':
            this.tabIndex = 2;
          break;
      case 'Request Flow':
            this.tabIndex = 3;
          break;
      case 'Referral Input':
            this.tabIndex = 4;
          break;
      case 'Sign Approval Document':
            this.tabIndex = 5;
          break;
      case 'Post Approval Process':
            this.tabIndex = 6;
          break;
      case 'Dispatch':
            this.tabIndex = 7;
          break;
      case 'Decision':
            this.tabIndex = 8;
          break;
  } 
 }

  getNodeDetails() {
  this.restService.getNodeDetails(this.examData.processId, this.examData.nodeId)
      .subscribe((res: any) => {
          switch (Number(res.FormID)) {
            case EXAMINATIONFORM.DOCKET:
                  this.docketTab = true;
                  this.signApprovalTab = false;
                  this.postApprovalTab = false;
                  this.dispatchTab = false;
                  break;

            case EXAMINATIONFORM.SIGNAPPROVALDOCUMENT:
                  this.docketTab = true;
                  this.signApprovalTab = true;
                  this.postApprovalTab = false;
                  this.dispatchTab = false;
                break;
            case EXAMINATIONFORM.POSTAPPROVALPROCESS:
                  this.docketTab = true;
                  this.signApprovalTab = true;
                  this.postApprovalTab = true;
                  this.dispatchTab = false;
                break;
            case EXAMINATIONFORM.DISPATCH:
                  this.docketTab = true;
                  this.signApprovalTab = true;
                  this.postApprovalTab = true;
                  this.dispatchTab = true;
                break;
        }
        this.nodeDetails = res;
      });
  }

  getExaminationDetailsByWorkflowId(){
    this.restService.getExaminationByWorkflowId(this.examData.workflowId).subscribe(examResponse=>{
        this.examinationDetails = examResponse;
    });
  }

  receiveChildBtachData(data){
    this.batchDetails = data;
  }
  

}
