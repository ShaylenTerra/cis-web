import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProcessID } from '../../../constants/enums';
import { ConfirmDailogComponent } from '../../../search/delivery-page/confirm-dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ExaminationReferenceNumberDialogComponent } from '../../examination-dialog/examination-reference-number-dialog/examination-reference-number-dialog.component';

@Component({
  selector: 'app-examination-list',
  templateUrl: './examination-list.component.html',
  styleUrls: ['./examination-list.component.css']
})
export class ExaminationListComponent implements OnInit {

  lodgementData:any;
  userId: number;
  isSpinnerVisible = false;

  referenceNumber = '';
  triggerPayload: any;
  requestorData: any;

  examination: any;

  /*Lodgement List */
  displayedColumns: string[] = ['Lodgement','referenceNumber', 'reservationName', 'processName', 'provinceName', 'actionRequiredCaption', 'internalStatusCaption', 'triggeredOn', 'lastStatusUpdate'];
  lodgementColumns: string[] = ['draftName', 'username', 'updated'];
  dataLength: number;
  dataSource: any[] = [];

  @ViewChild(MatSort) matSort1: MatSort;
  @ViewChild(MatPaginator) paginator1: MatPaginator;

  @ViewChild('table2', { read: MatSort }) matSort2: MatSort;
  @ViewChild('table2', { read: MatPaginator }) paginator2: MatPaginator;

  dataSourceLodgement: any[] = []
  dataSourceLodgementData: any[] = [];
  dataSourceList: any;
  dataSourceLodgementList: any;
  dataLengthRes: number;
  filteredDrafts: any[] = [];

  filteredDraftsData: any[] = [];
  serverDate: any;
  filteredLodgement: any[] = [];

  selectedDraftId:number;
  lodgement: any;

  constructor( private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userId = userInfoJson.userId;
    this.getAllLodgementDraft('');
    this.getLodgementsList();
  }

  gotoExaminationDetails() {
    
    this.router.navigate(['/examination/task-detail-examination']);
  }

  getExaminationList() {
    this.loaderService.display(true);
    this.restService.getLodgementsList(ProcessID.Examination, this.userId).subscribe(response => {
      if (response.code === 50000) {
        this.loaderService.display(false);
        return;
      } else {
        //this.filteredLodgement = response.data;
       // this.dataSourceLodgement = response.data;

       // this.refreshTableLodgement();
        //this.serverDate = response.timestamp;
       // this.loaderService.display(false);
      }
    }, () => {
      this.loaderService.display(false);
    });
  }

/*   setRequestorData() {
    const loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
    this.requestorData = {
        'requesterInformation': {
            'userId': this.userId,
            'requestLoggedBy': {
                'firstName': loggedUserData.firstName,
                'surName': loggedUserData.surname,
                'contactNo': loggedUserData.mobileNo,
                'email': loggedUserData.email,
                'fax': '',
                'addressLine1': loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': loggedUserData.userProfile.postalAddressLine3,
                'postalCode': loggedUserData.userProfile.postalCode
            },
            'requesterDetails': {
                'firstName': loggedUserData.firstName,
                'surName': loggedUserData.surname,
                'contactNo': loggedUserData.mobileNo,
                'email': loggedUserData.email,
                'fax': '',
                'addressLine1': loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': loggedUserData.userProfile.postalAddressLine3,
                'postalCode': loggedUserData.userProfile.postalCode
            }
        },
        'notifyManagerData': null,
        'queryData': {
            'issueType': '',
            'description': '', //this.form.value.notes,
            'firstName': JSON.parse(sessionStorage.getItem('userInfo')).firstName,
            'surName': JSON.parse(sessionStorage.getItem('userInfo')).surname,
            'email': JSON.parse(sessionStorage.getItem('userInfo')).email
        }
    };
 } */

 openDialog(requestCode, workflowId): void {
  const dialogRef = this.dialog.open(ExaminationReferenceNumberDialogComponent, {
      width: '546px',
      data: {
          requestCode: requestCode,
          workflowId: workflowId
      }
  });
  dialogRef.afterClosed().subscribe(() => {
      this.restService.notificationForWorkflowRequest({
          'referenceNo': this.triggerPayload.referenceNo,
          'templateId': this.triggerPayload.templateId,
          'transactionId': this.triggerPayload.transactionId,
          'userId': this.userId,
          'workflowId': this.triggerPayload.workflowId,
      }).subscribe(payload1 => {
          this.router.navigate(['/examination/examination-list']);
      });
  });
}

 createExamination(){
    this.loaderService.display(true);

    if(this.lodgement==null){
        alert("Select Lodgment Below");
        this.loaderService.display(false);
    }
    else{
        const payload: any = {
          processid: 322,
          //provinceid: this.lodgement?.provinceId,
          provinceid: 6,
          loggeduserid: this.userId,
          notes: '',
          context: 'context',
          type: 1,
          //processdata: JSON.stringify(this.requestorData), // queryData: data}),
          processdata:null,
          parentworkflowid: 0,
          assignedtouserid: 0
        };

        this.restService.triggertask(payload).subscribe(response => {
          debugger;

          const examinationPayLoad: any ={
            name:this.lodgement?.reservationName,
            //createdDate:,
            lodgementId:this.lodgement?.draftId,
            allocatedUserId:1442,
            workflowId:response.WorkflowID,
            statusId:108
          }

          this.restService.saveExamination(examinationPayLoad).subscribe(data=>{
            this.triggerPayload = {
              'referenceNo': response.ReferenceNumber,
              'templateId': response.TemplateID,
              'transactionId': response.TransactionId,
              'userId': response.userId,
              'workflowId': response.WorkflowID
            };
            this.loaderService.display(false);
          });
          //this.notification();
          this.loaderService.display(false);
          debugger;
          this.openDialog(response.ReferenceNumber, response.WorkflowID);
        });
    }
  }

 /* Lodgement */
  refreshTable() {
    this.dataSourceList = new MatTableDataSource(this.filteredDrafts);
    this.dataSourceList.paginator = this.paginator2;
    this.dataSourceList.sort = this.matSort2;
    this.dataLength = this.filteredDrafts.length || 0;
  }

  getLodgementsList() {
    this.loaderService.display(true);
    this.restService.getLodgementsList(ProcessID.Lodgement, this.userId).subscribe(response => {
      if (response.code === 50000) {
        this.loaderService.display(false);
        return;
      } else {
        debugger;
        this.filteredLodgement = response.data;
        this.dataSourceLodgement = response.data;

        this.refreshTableLodgement();
        this.serverDate = response.timestamp;
        this.loaderService.display(false);
      }
    }, () => {
      this.loaderService.display(false);
    });
  }

  refreshTableLodgement() {
    this.dataSourceLodgementList = new MatTableDataSource(this.filteredLodgement);
    this.ref.detectChanges();
    this.dataSourceLodgementList.paginator = this.paginator1;
    this.dataSourceLodgementList.sort = this.matSort1;
    this.dataLengthRes = this.dataSourceLodgement.length || 0;
    setTimeout(() => this.dataSourceLodgementList.sort = this.matSort1);
  }

  getAllLodgementDraft(stat: any) {
    this.loaderService.display(true);
    this.restService.getAllLodgementDraft().subscribe(response => {
      if (response.code === 50000) {
        this.loaderService.display(false);
        return;
      } else {
        this.filteredDraftsData = response.data;
        this.dataSource = response.data;
        this.filteredDrafts = this.filteredDraftsData;
        this.refreshTable()
        this.loaderService.display(false);
      }
    }, () => {
      this.loaderService.display(false);
    });
  }
   
  selectLodgement(element:any){
    //alert(element?.draftId);
    //this.selectedDraftId=element?.draftId;
    debugger
    this.lodgement = element;
  }



}
