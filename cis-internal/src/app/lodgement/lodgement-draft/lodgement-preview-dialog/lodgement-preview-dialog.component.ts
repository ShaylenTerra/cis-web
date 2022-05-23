import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { QuillEditorComponent } from 'ngx-quill';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ReservationAction, ReservationReason } from '../../../constants/enums';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../format-datepicket';
import { ConfirmDailogComponent } from '../../../search/delivery-page/confirm-dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmDecisionComponent } from '../../../tasks/task-details/confirm-decision/confirm-decision.component';


@Component({
  selector: 'app-lodgement-preview-dialog',
  templateUrl: './lodgement-preview-dialog.component.html',
  styleUrls: ['./lodgement-preview-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class LodgementPreviewDialogComponent implements OnInit {
  ReservationReason = ReservationReason;
  statuses: any[] = [];
  status = "";
  uploadedFileName1 = 'Upload document';
  fileToUpload1: File = null;
  isSpinnerVisible = false;
  displayedColumns1: string[] = ['Outcome'];
  dataLength1: number;
  dataSource1: any;
  displayedColumns2: string[] = ['Outcome'];
  dataLength2: number;
  dataSource2: any;
  displayedColumns3: string[] = ['Outcome'];
  dataLength3: number;
  dataSource3: any;
  dataSourceUserRole: any;
  userId: number;
  firstName = '';
  lastName = '';
  email = '';
  mobileNo = '';
  ppnNo = '';
  url: any = '';
  userDetail: any;
  rating = 5;
  basicInfoPLSForm: FormGroup;
  public ReservationChartData: any;
  public ReservationChartOption: any;
  @ViewChild('Reservation', { static: false }) ReservationChart: ElementRef; // used barStackedChart, barHorizontalChart
  public ReservationChartTag: CanvasRenderingContext2D;
  isApplicant: any;
  @ViewChild('emailSelect') emailSelect: MatSelect;
  public filteredEmail: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyEmail = new Subject<void>();
  public emailFilterCtrl: FormControl = new FormControl();
  emaildata: any[];
  findByEmail;
  searchForm: FormGroup;
  townshipForm: FormGroup;
  searchResult = [];
  userMetaData: any;
  rolesInfo;
  provinces: any;
  province: any;
  roleId: any;
  roles: any;
  dataSource;
  columns = ['documentType', 'purposeType', 'count', 'totalCost'];
  tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
  lodgeData: any;
  resubmitData: any;
  lodgeDraftData: any;
  layoutDoc: any[] = [];
  consentDoc: any[] = [];
  additionalDoc: any[] = [];
  minDate = new Date();
  surveyDate;
  purpose;
  readonly = true;
  selectedModes;
  cartData;
  selectedMode;
  preview = true;
  form: FormGroup;
  name = '';
  emailDelivery = '';
  phone = '';
  add1 = '';
  add2 = '';
  add3 = '';
  postalCode = '';
  collectionAddress;
  deliveryEmailElec;
  isPrimary;
  surveyname;
  draftId;
  provinceId;
  annexure;

  formApplicant: FormGroup;
  errorMsg = '';
  formApplication: FormGroup;
  electronicEmail;
  disableEmail = false;
  @ViewChild('quill') quill: QuillEditorComponent;
  triggerPayload: any;
  requestorData: any;
  disableProcess = true;
  err1 = false;
  err2 = false;
  err3 = false;
  err4 = false;
  townshipdata: any[];
  workflowId;
  processName = '';
  public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public townshipFilterCtrl: FormControl = new FormControl();
  protected _onDestroyTownship = new Subject<void>();
  totalAmount = 0;
  totalDoc = 0;
  paymentDetailsData: any[] = [];
  lodgementDocumentData: any[] = [];
  lodgeDocumentcolumns = ['documentName', 'documentType', 'purposeType', 'dated', 'notes', 'Action'];
  lodgeDocumentDataSource: any;
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  constructor(public dialogRef: MatDialogRef<LodgementPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService, private formBuilder: FormBuilder,
    private router: Router, private dialog: MatDialog) {


    this.workflowId = this.lodgeData?.workflowId;
    this.processName = this.lodgeData?.processName
    this.provinceId = this.lodgeData?.provinceId;
  }

  ngOnInit(): void {
    const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userId = userInfoJson.userId;
    // this.getDatabyDraftId();
    this.initialize();

  }

  initialize() {
    this.loaderService.display(true);
    this.lodgeData = this.data.value;
    if (this.lodgeData.applicantUserId === null) {
      this.err1 = true;
    }
    if (this.lodgeData.deliveryMethodItemId === null) {
      this.err2 = true;
    }
    if (this.err1 || this.err2) {
      this.disableProcess = true;
    } else {
      this.disableProcess = false;
    }
    forkJoin([
      this.restService.getLodgementDraftById(this.lodgeData?.draftId),
      this.restService.getLodgementAllDocument(this.lodgeData?.draftId),
      this.restService.getDocumentSummary(this.lodgeData?.draftId, 0)
    ]).subscribe(([DraftRequest, ldgDoc, paymentData]) => {
      this.lodgeDraftData = DraftRequest.data;
      this.draftId = this.lodgeDraftData?.draftId;

      this.lodgementDocumentData = ldgDoc.data;
      this.refreshDocumentTable();
      if (paymentData.data.length > 0) {
        for (let i = 0; i < paymentData.data.length; i++) {
          this.totalDoc = this.totalDoc + paymentData.data[i].count;
          this.totalAmount = this.totalAmount + paymentData.data[i].totalCost;
        }
        this.paymentDetailsData = paymentData.data;
        this.refreshPaymentTable();
      }
      this.paymentDetailsData = paymentData.data;
      if (this.paymentDetailsData !== null && this.paymentDetailsData.length > 0) {
        this.err3 = false;
      } else {
        this.err3 = true;
      }
      if (this.err3) {
        this.disableProcess = true;
      } else {
        this.disableProcess = false;
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  refreshDocumentTable() {
    this.lodgeDocumentDataSource = new MatTableDataSource(this.lodgementDocumentData);
    this.lodgeDocumentDataSource.sort = this.sort.toArray()[1];
    setTimeout(() => this.lodgeDocumentDataSource.sort = this.sort.toArray()[1]);
  }

  refreshPaymentTable() {
    this.dataSource = new MatTableDataSource(this.paymentDetailsData);
    this.dataSource.sort = this.sort.toArray()[0];
    setTimeout(() => this.dataSource.sort = this.sort.toArray()[0]);
  }
  // getDatabyDraftId() {
  //   // this.lodgeData = this.data.value;
  //   // if (this.lodgeData.applicantUserId === null) {
  //   //   this.err1 = true;
  //   // }
  //   // if (this.lodgeData.deliveryMethodItemId === null) {
  //   //   this.err2 = true;
  //   // }
  //   // if (this.err1 || this.err2) {
  //   //   this.disableProcess = true;
  //   // } else {
  //   //   this.disableProcess = false;
  //   // }
  //   this.restService.getLodgementDraftById(this.lodgeData?.draftId).subscribe(payload => {
  //     this.lodgeDraftData = payload.data;
  //     this.err3 = false;
  //     for (let i = 0; i < this.lodgeDraftData.lodgementDraftSteps.length; i++) {
  //       if (this.err3 === false) {
  //         if (this.lodgeDraftData.lodgementDraftSteps[i].lodgementDraftRequests.length > 0) {
  //           this.err3 = this.lodgeDraftData.lodgementDraftSteps[i].lodgementDraftRequests.filter(x => x.lodgementDraftDocuments.length > 0).length > 0 ?
  //             false : true;
  //         } else {
  //           this.err3 = true;
  //         }
  //       }
  //     }

  //     // this.draftId = this.lodgeDraftData?.draftId;
  //     // this.getLodgementAllDocument();
  //     this.documentCost()
  //   }, error => {
  //     this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
  //   });
  // }

  receiveChildData(data) {
    this.lodgeDraftData = data;
  }

  // documentCost() {
  //   this.loaderService.display(true);
  //   this.restService.getDocumentSummary(this.draftId, 0).subscribe((res) => {
  //     this.loaderService.display(false);
  //     if (res.data.length > 0) {
  //       for (let i = 0; i < res.data.length; i++) {
  //         this.totalDoc = this.totalDoc + res.data[i].count;
  //         this.totalAmount = this.totalAmount + res.data[i].totalCost;
  //       }
  //       this.paymentDetailsData = res.data;
  //       if (this.paymentDetailsData !== null && this.paymentDetailsData.length > 0) {
  //         this.err3 = false;
  //       } else {
  //         this.err3 = true;
  //       }
  //       if (this.err3) {
  //         this.disableProcess = true;
  //       } else {
  //         this.disableProcess = false;
  //       }
  //       this.dataSource = new MatTableDataSource(res.data);
  //     }

  //   }, error => {
  //     this.loaderService.display(false);
  //   });
  // }


  postRequest() {
    this.loaderService.display(true);
    if (this.resubmitData !== undefined && this.resubmitData?.actionRequired === ReservationAction.RESUBMITMODIFY) {
      const data: any = {
        actionId: this.resubmitData.actionId,
        actionTakenId: 13,
        assignedToUserId: 0,
        context: "This is context",
        currentNodeId: this.resubmitData.nodeId,
        loggedUserId: this.userId,
        notes: "This is notes",
        processData: "largedata",
        processId: this.resubmitData.processId,
        type: 1,

      };
      this.restService.processtask(data).subscribe((res: any) => {
        this.decisionDialog(res);
        this.loaderService.display(false);
        this.addUserNotification();
        this.dialogRef.close();
      }, error => {
        this.loaderService.display(false);
      });
    } else {

      this.setRequestorData();
      const payload: any = {
        processid: 278,
        provinceid: this.lodgeDraftData.provinceId,
        loggeduserid: this.userId,
        notes: '',
        context: 'context',
        type: 1,
        processdata: JSON.stringify(this.requestorData), // queryData: data}),
        parentworkflowid: 0,
        assignedtouserid: 0
      };
      this.restService.triggertask(payload).subscribe(response => {
        this.triggerPayload = {
          'referenceNo': response.ReferenceNumber,
          'templateId': response.TemplateID,
          'transactionId': response.TransactionId,
          'userId': response.userId,
          'workflowId': response.WorkflowID
        };
        this.loaderService.display(false);
        this.notification();
        this.restService.checkoutLodgementDraft(this.lodgeDraftData.draftId, response.WorkflowID).subscribe(res => {
          this.loaderService.display(false);
          this.lodgementNotification();
          this.dialogRef.close();
        });
        this.openDialog(response.ReferenceNumber, response.WorkflowID);
      });
    }


  }

  decisionDialog(data): void {
    const dialogRef = this.dialog.open(ConfirmDecisionComponent, {
      width: '546px',
      data: { value: data }
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
      this.router.navigate(['/reservation/reservation-list']);

    });
  }

  addUserNotification() {

    const notification = {
      'loggedInUserId': this.userId,
      'notifyUserId': this.resubmitData.userId,
      'subject': this.resubmitData.processName + ': ' + this.resubmitData.actionRequiredCaption + ' ' + this.resubmitData.referenceNumber,
      'description': "This is notes",
      'contextTypeId': 5055,
      'contextId': this.resubmitData.workflowId

    };

    this.restService.addUserNotification(notification).subscribe(async (result) => { });

  }

  notification() {
    this.loaderService.display(true);
    this.restService.notification(this.triggerPayload).subscribe((res => {
      this.loaderService.display(false);
    }), error => {
      this.loaderService.display(false);
    });
  }



  lodgementNotification() {
    this.loaderService.display(true);
    const obj = {
      'referenceNumber': this.triggerPayload.referenceNo,
      'templateId': this.triggerPayload.templateId,
      'transactionId': this.triggerPayload.transactionId,
      'context': this.triggerPayload.workflowId,
      'workflowId': this.triggerPayload.workflowId
    };
    this.restService.notifyForLodgement(obj).subscribe((res => {
      this.loaderService.display(false);
    }), error => {
      this.loaderService.display(false);
    });
  }

  openDialog(requestCode, workflowId): void {
    const dialogRef = this.dialog.open(ConfirmDailogComponent, {
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
        this.router.navigate(['/lodgement/lodgement-list']);
      });
    });
  }

  setRequestorData() {
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
  }

  // getLodgementAllDocument() {
  //   this.loaderService.display(true);
  //   this.restService.getLodgementAllDocument(this.draftId).subscribe(payload => {
  //     this.lodgementDocumentData = payload.data;
  //     this.lodgeDocumentDataSource = new MatTableDataSource(this.lodgementDocumentData);
  //     this.loaderService.display(false);

  //   }, error => {
  //     this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
  //     this.loaderService.display(false);
  //   });
  // }


  downloadDoc(document) {
    this.loaderService.display(true);
    this.restService.getLdgResDetailDoc(document.documentId).subscribe((res) => {
      this.loaderService.display(false);
      this.downloadBlob(res, document.name);
    }, error => {
      this.loaderService.display(false);
    })
  }

  downloadBlob(blob, name) {
    this.loaderService.display(true);
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    // link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    // Remove link from body
    document.body.removeChild(link);
    this.loaderService.display(false);
  }


  close() {
    this.dialogRef.close();
  }

}
