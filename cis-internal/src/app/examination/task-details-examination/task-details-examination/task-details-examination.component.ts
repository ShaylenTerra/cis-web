import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { TopMenuService } from '../../../services/topmenu.service';

@Component({
  selector: 'app-task-details-examination',
  templateUrl: './task-details-examination.component.html',
  styleUrls: ['./task-details-examination.component.css']
})
export class TaskDetailsExaminationComponent implements OnInit {
  lodgeData: any;
  lodgeDraftData: any;
  constructor(  private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private topMenu: TopMenuService,
    private dom: DomSanitizer,
    private formBuilder: FormBuilder,
    ) { 
     // this.lodgeData = this.router.getCurrentNavigation().extras.state.lodgeData;
    }

  ngOnInit(): void {
   
  }
  receiveChildData(data) {
    this.lodgeDraftData = data;
  }
  // getLodgementDraftByWorkFlowId() {
  //   this.loaderService.display(true);
  //   this.restService.getLodgementDraftByWorkFlowId(/* this.workflowId */ 284).subscribe(payload => {
  //     this.lodgeDraftData = payload.data;
  //     this.draftId = this.lodgeDraftData?.draftId;
  //     this.loaderService.display(false);
  //   }, error => {
  //     this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
  //     this.loaderService.display(false);
  //   });
  // }
  /* changeTab (event) {
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
 }*/
 /* getDatabyDraftId() {
  debugger
  this.restService.getLodgementDraftById(265).subscribe(payload => {
    debugger;
    this.data1 = payload.data;
    this.loaderService.display(false);
  }, () => {
    this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
    this.loaderService.display(false);
  });
 }

 receiveChildData(data) {
  this.data1 = data;
} */
}
