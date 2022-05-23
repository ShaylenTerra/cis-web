import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AddtodiaryDialogComponent } from './addtodiary-dialog/addtodiary-dialog.component';
import { ChangeprovinceDialogComponent } from './changeprovince-dialog/changeprovince-dialog.component';
import { ExpeditetaskDialogComponent } from './expeditetask-dialog/expeditetask-dialog.component';
import { EmailModalComponent } from './modal/email-modal';
import { SendEmailModalComponent } from './modal/send-email-modal.dialog';
import { SendSMSModalComponent } from './modal/send-sms-modal.dialog';
import { ReopendialogComponent } from './reopendialog/reopendialog.component';
import { UserinfoDialogComponent } from './userinfo-dialog/userinfo-dialog.component';
import { CanceltaskDialogComponent } from './canceltask-dialog/canceltask-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../interface/user.interface';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDecisionComponent } from './confirm-decision/confirm-decision.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { LoaderService } from '../../services/loader.service';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { MarkAsPendingComponent } from './mark-as-pending/mark-as-pending.component';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../format-datepicket';
import { ViewMapDialogComponent } from '../../search/search-details/view-map/view-map.modal';
import { ViewdispatchComponent } from './viewdispatch/viewdispatch.component';
import { DispatchDocComponent } from './dispatch-doc/dispatch-doc.component';
import { EmployeedetailsComponent } from './employeedetails/employeedetails.component';
import { ViewReviewInfoComponent } from './view-review-info/view-review-info.component';
import { MatSelect } from '@angular/material/select';
import {
    NgxGalleryAnimation,
    NgxGalleryComponent,
    NgxGalleryImage,
    NgxGalleryImageSize,
    NgxGalleryOptions
} from '@kolkov/ngx-gallery';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ReferralInputDialogComponent } from './referralinput-dialog/referralinput-dialog.component';
import { SendsectionDialogComponent } from './sendsection-dialog/sendsection-dialog.component';

const types = [
    { name: 'Type 1' },
    { name: 'Type 2' },
    { name: 'Type 3' },
];

const VIEW_MAP_URL = environment.gisServerUrl + '/InfoMap.aspx?lpi=';

@Component({
    selector: 'app-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
        DatePipe
    ]
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('gallery', { static: false }) gallery: NgxGalleryComponent;
    @ViewChild('gallery1', { static: false }) gallery1: NgxGalleryComponent;
    @ViewChild('gallery2', { static: false }) gallery2: NgxGalleryComponent;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    @ViewChild('searchUserSelect') searchUserSelect: MatSelect;
    public searchUserFilterCtrl: FormControl = new FormControl();
    showSideCollapser = true;
    users: IUser[];
    isSpinnerVisible = false;
    public assignedFilteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    dispatchMethodName;
    dispatchMedia;
    assignUser: any;
    tooltipText: any;
    activeTabId = 1;
    workflowDoc: any[];
    requestFlow: any[];
    listItems: any[];
    columnType1 = ['sno', 'format', 'type'];
    columnType2 = ['sno', 'certType', 'format', 'type'];
    columnType3 = ['sno', 'type'];
    nodeDetails: any;
    uploadDocForm: FormGroup;
    RequestersInfo: FormGroup;
    confirmPaymentform: FormGroup;
    fileToUpload: File = null;
    paymentFileToUpload: File = null;
    docName: string;
    fileUrl: string;
    requestorInformation: any;
    // datasearchInformation: any;
    requestor: any = 'Yes';
    ownMedia;
    requestorClient = 'ANONYMOUS';
    referrals: any[];
    types = types;
    itemDataSource: any;
    itemColumns = ['items', 'actions', 'cost'];
    flowDataSource: any;
    flowDataLength: number;
    flowColumns = ['date', 'user', 'action', 'duration', 'note'];
    diagramColumns = ['sno', 'format', 'type'];
    refCols: Array<string> = ['referenceNo', 'triggeredOn', 'fromUser', 'requestNote', 'toUser',
        'referralInput', 'createdOn', 'status', 'sms'];
    outLinks: any[] = [];
    nextOutLinks: any[] = [];
    selectedRequestFiles: any;
    selectedPaymentFiles: any;
    selectedInvoiceFiles: any;
    selectedSupportingFiles: any;
    refData: any;
    refDataLength: number;
    timedOutCloser;
    menuItems: Array<MenuItem> = [];
    columns = ['sno', 'Item', 'type', 'details', 'estimate', 'time', 'comment', 'finalCost'];
    dispatchcolumns = ['sno', 'Item', 'type', 'details', 'time', 'comment', 'prepared', 'View'];
    taskDetail: any;
    supportingDocuments: any[];
    state;
    notes = '';
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    userSession = JSON.parse(sessionStorage.getItem('userInfo'));
    decisionform: FormGroup;
    uploadpaymentform: FormGroup;
    dispatchMethod: FormGroup;
    notifyReview: FormGroup;
    referralInput: any[];
    requesterForm: FormGroup;
    cartId = null;
    ItemData;
    tempdata;
    selectedImageID = 'image1';
    notifyRequestorInformation: any;
    queryDescription;
    issueType;
    nodedetailsnext: any;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    imageArray: any;
    selectedImageSource: any;
    selectedModes;
    deliveryMedias;
    deliveryMediasdata;
    selectedMode;
    deliveryMedia;
    deliveryMethodPrice;
    total = 0;
    noOfCD;
    deliveryModePrice;
    tempDeliveryModePrice;
    sendInvoiceData;
    sendDispatchData;
    checked: boolean;
    Process = false;
    uploadedPaymentFileName = 'Upload document';
    formHeading: string;
    formDescription: string;
    processHeading: string;
    DispatchItemData;
    dispatchRefNo;
    dispatchDate;
    paymentInfo;
    popDocInfo: any;
    documentTypeIdSelected = 133;
    step: any = 0;
    deliveryData: any;
    infoReview: any;
    DispatchItemDeliveryData: any;
    filters: any;
    protected _onDestroySearchUser = new Subject<void>();
    showImageLoader: any = false;
    assignDecisionUser: any;
    maxDate: any = new Date();
    decisionSelected: any = true;
    formatType;
    constructor(private router: Router, private dialog: MatDialog,
        private restService: RestcallService,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
        private loaderService: LoaderService,
        private datePipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        if (this.router.getCurrentNavigation().extras.state === undefined) {
            this.router.navigate(['/tasks/task-list']);
        }

        this.taskDetail = this.router.getCurrentNavigation().extras.state.taskDetail;
        this.filters = this.router.getCurrentNavigation().extras.state.filters;
        this.getNodeDetails();
        this.itemDataSource = [
            { items: 'Ariel Photography- & Imagery Related Products', cost: '' },
            { items: 'Search Texts', cost: '' }
        ];
        this.refData = [];
        this.menuItems = [
            {
                id: 1,
                name: 'infoTab',
                isActive: true,
                activeIconUrl: 'assets/images/bootstrap-icons/a-requester.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-requester.svg',
                title: 'Requestor\'s Information',
                description: 'Basic info of the requestor.'
            },
            {
                id: 2,
                name: 'itemTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-items.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-items.svg',
                title: 'Request Item',
                description: 'Information about Request Items.'
            },
            {
                id: 3,
                name: 'flowTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-flow.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-flow.svg',
                title: 'Request Flow',
                description: 'Request flow from one status to another.'
            },
            {
                id: 4,
                name: 'annexTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-doc.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-doc.svg',
                title: 'Supporting Documents',
                description: 'Basic info of the documents attached.'
            },
            {
                id: 5,
                name: 'refTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                title: 'Referral',
                description: 'Referral inputs for the request queries.'
            },
            {
                id: 6,
                name: 'decisionTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                title: 'Decision',
                description: 'Decision inputs for the request queries.'
            },
        ];

        this.requesterForm = this.fb.group({
            requesterName: ['', Validators.required],
            requesterSurame: ['', Validators.required],
            Email: ['', Validators.required],
            Fax: ['', Validators.required],
            Address1: ['', Validators.required],
            Address2: ['', Validators.required],
            Address3: ['', Validators.required],
            PostalCode: ['', Validators.required],
            contactNumber: ['', Validators.required],
        });

        this.dispatchMethod = this.fb.group({
            primaryEmail: '',
            secondaryEmail: '',
            referenceNumber: '',
            dataDispatched: '',
            collectorName: '',
            collectorSurname: '',
            collectorContactNumber: '',
            postaladdressLine1: '',
            postaladdressLine2: '',
            postaladdressLine3: '',
            postalCode: '',
            courierName: '',
            contactPerson: '',
            ftpDetails: '',
            cartDispatchId: 0
        });

        this.RequestersInfo = this.fb.group({
            email: '',
            firstName: '',
            lastName: '',
            requestType: '',
            formatType: '',
            deliveryMethod: '',
            add1: '',
            add2: '',
            add3: '',
            collectionAddress: '',
            zipcode: '',
            phone: ''
        });

        this.notifyReview = this.fb.group({
            email: '',
            name: '',
            searchTypeName: '',
            searchNumber: '',
        });

        this.uploadDocForm = this.fb.group({
            comment: '',
            documentType: '',
            file: {},
            userId: this.userId,
            workflowId: this.taskDetail.workflowId
        });

        this.decisionform = this.fb.group({
            actionTakenId: '',
            processId: this.taskDetail.processId,
            loggedUserId: this.userId,
            notes: ['', Validators.required],
            context: 'This is conext',
            type: 1,
            processData: 'largedata',
            currentNodeId: this.taskDetail.nodeId,
            actionId: this.taskDetail.actionId,
            assignedToUserId: ['', Validators.required]
        });

        this.uploadpaymentform = this.fb.group({
            file: '',
            comments: '',
            paymentId: '',
            documentTypeId: 133,
            paymentReferenceNo: '',
            invoiceAmount: '',
            paymentDate: '',
            userId: '',
            paidAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
            workflowId: '',
            dueDate: '',
        });

        this.confirmPaymentform = this.fb.group({
            Notes: '',
        });

        this.galleryOptions = [
            {
                width: '220px',
                height: '400px',
                thumbnailsColumns: 3,
                arrowPrevIcon: 'fa fa-chevron-left',
                arrowNextIcon: 'fa fa-chevron-right',
                imageAnimation: NgxGalleryAnimation.Slide,
                imageSize: NgxGalleryImageSize.Contain,
                previewRotate: true,
                previewZoom: true,
                previewFullscreen: true,
                previewKeyboardNavigation: true,
                thumbnailsArrows: true,
                imageArrowsAutoHide: true,
                previewArrowsAutoHide: true,
                actions: [
                    {
                        icon: 'fa fa-arrow-circle-down',
                        titleText: 'download',
                        onClick: this.downloadImage.bind(this)
                    }
                ]
            },
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20,
            },
            {
                breakpoint: 400,
                preview: false
            }
        ];
    }

    get getAssignUser() {
        return this.decisionform.get('assignedToUserId');
    }

    ngOnInit() {
        this.getRequestorInformation(); // TAB 1
        this.getWorkflowDataForRequestType();
        this.getWorkflowUploadedDocument();
        forkJoin([
            this.restService.getListItems(16),
            this.restService.getListItems(18),
            this.restService.getListItems(226)
        ]).subscribe(([method, media, formatType]) => {
            this.formatType = formatType.data;
            this.selectedModes = method.data;
            this.selectedMode = method.data[0];
            this.deliveryMedias = media.data;
            this.deliveryMedia = media.data[0];
            if (this.selectedMode.caption === 'ELECTRONIC') {
                this.deliveryMediasdata = [];
                for (let i = 0; i < this.deliveryMedias.length; i++) {
                    if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                        this.deliveryMediasdata.push(this.deliveryMedias[i]);
                    }
                }
            } else {
                this.deliveryMediasdata = [];
                for (let i = 0; i < this.deliveryMedias.length; i++) {
                    if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                    } else {
                        this.deliveryMediasdata.push(this.deliveryMedias[i]);
                    }
                }
            }
            if (this.deliveryData !== undefined && this.deliveryData.length === 0) {
                if (this.selectedMode !== undefined) {
                    const tempInvData = {
                        'dataTypeListItemId': 0,
                        'formatListItemId': this.selectedMode.itemId,
                        'paperSizeListItemId': 0,
                        'searchDataTypeId': -100,
                        'subTypeListItemId': 0
                    };
                    this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                        const tempInvoiceData = {
                            'comment': '',
                            'details': '',
                            'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'format': '',
                            'item': this.selectedMode.caption,
                            'lpiCode': -1111111111,
                            'srNo': '',
                            'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                                'PER HOUR' : response.data.type
                        };
                        this.deliveryMethodPrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                            Number(response.data.fee);
                        this.ItemData.deliveryMethod = tempInvoiceData;
                        this.calculate();
                    });
                }

                if (this.deliveryMedia !== undefined) {
                    const tempInvData = {
                        'dataTypeListItemId': 0,
                        'formatListItemId': this.deliveryMedia.itemId,
                        'paperSizeListItemId': 0,
                        'searchDataTypeId': -100,
                        'subTypeListItemId': 0
                    };
                    this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                        const tempInvoiceData = {
                            'comment': this.notes,
                            'details': '',
                            'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'format': this.noOfCD,
                            'item': this.deliveryMedia.caption,
                            'lpiCode': -1111111111,
                            'srNo': '',
                            'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                                'PER HOUR' : response.data.type
                        };
                        this.deliveryModePrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                            Number(response.data.fee);
                        this.tempDeliveryModePrice = this.deliveryModePrice;
                        this.ItemData.deliveryMedium = tempInvoiceData;
                        this.calculate();
                    });
                }
            } else if (this.deliveryData !== undefined && this.deliveryData.length > 0) {
                this.ItemData.deliveryMethod = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0];
                this.ItemData.deliveryMedium = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0];
                this.deliveryMethodPrice = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].finalCost;
                const selectedMode = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].item;
                this.selectedMode = this.selectedModes.filter(x => x.caption === selectedMode)[0];

                const deliveryMedia = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].item;
                this.deliveryMedia = this.deliveryMediasdata.filter(x => x.caption === deliveryMedia)[0];
                this.noOfCD = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].type;
                this.deliveryModePrice = this.deliveryData[0].cartInvoiceItems
                    .filter(x => x.details === 'Delivery Mode')[0].finalCost / this.noOfCD;
                this.tempDeliveryModePrice = this.deliveryModePrice;
                this.notes = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].comments;
                this.calculate();
            }
        });
    }

    ngOnDestroy() {
        this._onDestroySearchUser.next();
        this._onDestroySearchUser.complete();
    }

    getInformationRequestItem() {
        this.loaderService.display(true);
        this.restService.getInformationRequestItem(this.taskDetail.workflowId).subscribe(response => {
            this.infoReview = response.data.json;
            if (this.infoReview.length > 0) {
                // if (this.taskDetail.processName === 'Single Request') {
                //     this.requestorInformation = this.infoReview[0].requesterDetails;
                //     this.setRequestorInfoData();
                // }
                for (let i = 0; i < this.infoReview.length; i++) {
                    if (this.infoReview[i].searchDetails.leaseNo) {
                        this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.leaseNo;
                        this.infoReview[i].searchDetails.filterName = 'Lease Number';
                    } else if (this.infoReview[i].searchDetails.surveyRecordNo) {
                        this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.surveyRecordNo;
                        this.infoReview[i].searchDetails.filterName = 'Survey Record Number';
                    } else if (this.infoReview[i].searchDetails.deedNo) {
                        this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.deedNo;
                        this.infoReview[i].searchDetails.filterName = 'Deed Number';
                    } else if (this.infoReview[i].searchDetails.compilationNo) {
                        this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.compilationNo;
                        this.infoReview[i].searchDetails.filterName = 'Compilation Number';
                    }
                    this.showImageLoader = true;
                    this.getDocument(this.infoReview[i].searchDetails.recordId, i);
                }
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    getWorkflowUploadedDocument() {
        this.loaderService.display(true);
        this.restService.getWorkflowUploadedDocument(this.taskDetail.workflowId).subscribe((res: any) => {
            this.popDocInfo = res.data;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    selectPaymentFile(event) {
        this.paymentFileToUpload = event.target.files;
        this.uploadedPaymentFileName = event.target.files[0]['name'];
    }

    getWorkflowDataForRequestType() {
        this.restService.getWorkflowDataForRequestType(this.taskDetail.workflowId).subscribe(res => {
        });
    }

    getWorkflowBasedItem() {
        this.loaderService.display(true);
        this.restService.getWorkflowBasedItem(this.taskDetail.workflowId).subscribe(res => {
            if (this.taskDetail.processName === 'Notify Manager') {
                this.notifyRequestorInformation = res.data;
                this.requesterForm.patchValue({
                    requesterName: this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName,
                    requesterSurame: this.notifyRequestorInformation.requesterInformation.requesterDetails.surName,
                    Email: this.notifyRequestorInformation.requesterInformation.requesterDetails.email,
                    Fax: this.notifyRequestorInformation.requesterInformation.requesterDetails.fax,
                    Address1: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine1,
                    Address2: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine2,
                    Address3: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine3,
                    PostalCode: this.notifyRequestorInformation.requesterInformation.requesterDetails.postalCode,
                    contactNumber: this.notifyRequestorInformation.requesterInformation.requesterDetails.contactNo
                });
                if (this.notifyRequestorInformation != null && this.notifyRequestorInformation !== undefined) {
                    this.RequestersInfo.patchValue({
                        email: this.notifyRequestorInformation.requesterInformation.requesterDetails.email,
                        firstName: this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName,
                        lastName: this.notifyRequestorInformation.requesterInformation.requesterDetails.lastName,
                        add1: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine1,
                        add2: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine2,
                        add3: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine3,
                        collectionAddress: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine1 + ' ' +
                            this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine2 + ' ' +
                            this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine3,
                        zipcode: this.notifyRequestorInformation.requesterInformation.requesterDetails.postalCode,
                        phone: this.notifyRequestorInformation.requesterInformation.requesterDetails.contactNo,
                        requestType: this.taskDetail.processName,
                    });
                }

                this.notifyReview.patchValue({
                    email: this.notifyRequestorInformation ? this.notifyRequestorInformation.requesterInformation.requesterDetails.email : '',
                    name: this.notifyRequestorInformation ? this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName
                     + ' ' + this.notifyRequestorInformation.requesterInformation.requesterDetails.surName : '',
                    searchTypeName: this.notifyRequestorInformation ?
                        this.notifyRequestorInformation.notifyManagerData.searchType : '',
                    searchNumber: this.notifyRequestorInformation ? this.notifyRequestorInformation.notifyManagerData.searchNumber : '',
                });
            }

            if (this.taskDetail.processName === 'Referral Task') {
                this.notifyRequestorInformation = res.data;
                this.RequestersInfo.patchValue({
                    email: this.notifyRequestorInformation.requesterInformation.requesterDetails.email,
                    firstName: this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName,
                    lastName: this.notifyRequestorInformation.requesterInformation.requesterDetails.lastName,
                    phone: this.notifyRequestorInformation.requesterInformation.requesterDetails.contactNo
                });
            }
            this.ownMedia = undefined;
            this.requestor = undefined;
            if (this.taskDetail.processName === 'Query') {
                this.queryDescription = res.data.queryData.description;
                this.issueType = res.data.queryData.issueType;
                this.requestorInformation = res.data.json != null ? res.data.json : res.data;
                this.requesterForm.patchValue({
                    requesterName: this.requestorInformation.requesterInformation.requesterDetails.firstName,
                    requesterSurame: this.requestorInformation.requesterInformation.requesterDetails.surName,
                    Email: this.requestorInformation.requesterInformation.requesterDetails.email,
                    Fax: this.requestorInformation.requesterInformation.requesterDetails.fax,
                    Address1: this.requestorInformation.requesterInformation.requesterDetails.addressLine1,
                    Address2: this.requestorInformation.requesterInformation.requesterDetails.addressLine2,
                    Address3: this.requestorInformation.requesterInformation.requesterDetails.addressLine3,
                    PostalCode: this.requestorInformation.requesterInformation.requesterDetails.postalCode,
                    contactNumber: this.requestorInformation.requesterInformation.requesterDetails.contactNo
                });

                if (this.requestorInformation != null && this.requestorInformation !== undefined) {
                    this.RequestersInfo.patchValue({
                        email: this.requestorInformation.requesterInformation.requesterDetails.email,
                        firstName: this.requestorInformation.requesterInformation.requesterDetails.firstName,
                        lastName: this.requestorInformation.requesterInformation.requesterDetails.lastName,
                        add1: this.requestorInformation.requesterInformation.requesterDetails.addressLine1,
                        add2: this.requestorInformation.requesterInformation.requesterDetails.addressLine2,
                        add3: this.requestorInformation.requesterInformation.requesterDetails.addressLine3,
                        collectionAddress: this.requestorInformation.requesterInformation.requesterDetails.addressLine1 + ' ' +
                            this.requestorInformation.requesterInformation.requesterDetails.addressLine2 + ' ' +
                            this.requestorInformation.requesterInformation.requesterDetails.addressLine3,
                        zipcode: this.requestorInformation.requesterInformation.requesterDetails.postalCode,
                        phone: this.requestorInformation.requesterInformation.requesterDetails.contactNo,
                        requestType: this.taskDetail.processName,
                    });
                }
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    getInvoiceData() {
        this.loaderService.display(true);
        this.restService.getInvoiceData(this.taskDetail.workflowId).subscribe(res => {
            if (res.data) {
                this.ItemData = res.data.filter(x => x.searchDetails !== null);
                this.deliveryData = res.data.filter(x => x.searchDetails === null);
                if (this.ItemData.length > 0) {
                    for (let i = 0; i < this.ItemData.length; i++) {
                        if (this.ItemData[i].searchDetails.leaseNo) {
                            this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.leaseNo;
                            this.ItemData[i].searchDetails.filterName = 'Lease Number';
                        } else if (this.ItemData[i].searchDetails.surveyRecordNo) {
                            this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.surveyRecordNo;
                            this.ItemData[i].searchDetails.filterName = 'Survey Record Number';
                        } else if (this.ItemData[i].searchDetails.deedNo) {
                            this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.deedNo;
                            this.ItemData[i].searchDetails.filterName = 'Deed Number';
                        } else if (this.ItemData[i].searchDetails.compilationNo) {
                            this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.compilationNo;
                            this.ItemData[i].searchDetails.filterName = 'Compilation Number';
                        }
                        this.showImageLoader = true;
                        this.getDocument(this.ItemData[i].searchDetails.recordId, i);
                    }
                }
                if (this.deliveryData !== undefined && this.deliveryData.length === 0) {
                    if (this.selectedMode !== undefined) {
                        const tempInvData = {
                            'dataTypeListItemId': 0,
                            'formatListItemId': this.selectedMode.itemId,
                            'paperSizeListItemId': 0,
                            'searchDataTypeId': -100,
                            'subTypeListItemId': 0
                        };
                        this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                            const tempInvoiceData = {
                                'comment': '',
                                'details': '',
                                'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                                    Number(response.data.fee),
                                'format': '',
                                'item': this.selectedMode.caption,
                                'lpiCode': -1111111111,
                                'srNo': '',
                                'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                                    Number(response.data.fee),
                                'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                                    'PER HOUR' : response.data.type
                            };
                            this.deliveryMethodPrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee);
                            this.ItemData.deliveryMethod = tempInvoiceData;
                            this.calculate();
                        });
                    }

                    if (this.deliveryMedia !== undefined) {
                        const tempInvData = {
                            'dataTypeListItemId': 0,
                            'formatListItemId': this.deliveryMedia.itemId,
                            'paperSizeListItemId': 0,
                            'searchDataTypeId': -100,
                            'subTypeListItemId': 0
                        };
                        this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                            const tempInvoiceData = {
                                'comment': this.notes,
                                'details': '',
                                'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                                    Number(response.data.fee),
                                'format': this.noOfCD,
                                'item': this.deliveryMedia.caption,
                                'lpiCode': -1111111111,
                                'srNo': '',
                                'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                                    Number(response.data.fee),
                                'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                                    'PER HOUR' : response.data.type
                            };
                            this.deliveryModePrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee);
                            this.tempDeliveryModePrice = this.deliveryModePrice;
                            this.ItemData.deliveryMedium = tempInvoiceData;
                            this.calculate();
                        });
                    }
                } else if (this.deliveryData !== undefined && this.deliveryData.length > 0) {
                    if (this.selectedModes !== undefined && this.deliveryMedias !== undefined) {
                        this.ItemData.deliveryMethod = this.deliveryData[0].cartInvoiceItems
                            .filter(x => x.details === 'Delivery Method')[0];
                        this.ItemData.deliveryMedium = this.deliveryData[0].cartInvoiceItems
                            .filter(x => x.details === 'Delivery Mode')[0];
                        this.deliveryMethodPrice = this.deliveryData[0].cartInvoiceItems
                            .filter(x => x.details === 'Delivery Method')[0].finalCost;
                        const selectedMode = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].item;
                        this.selectedMode = this.selectedModes.filter(x => x.caption === selectedMode)[0];

                        const deliveryMedia = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].item;
                        this.deliveryMedia = this.deliveryMediasdata.filter(x => x.caption === deliveryMedia)[0];
                        this.noOfCD = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].type;
                        this.deliveryModePrice = this.deliveryData[0].cartInvoiceItems
                            .filter(x => x.details === 'Delivery Mode')[0].finalCost / this.noOfCD;
                        this.tempDeliveryModePrice = this.deliveryModePrice;
                        this.notes = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].comments;
                        this.calculate();
                    } else {
                        this.calculate();
                    }
                }
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    UpdatedItem(val, property, index, cartindex) {
        if (property === 'time') {
            this.ItemData[cartindex].cartInvoiceItems[index].timeRequired = val;
        }
        if (property === 'comment') {
            this.ItemData[cartindex].cartInvoiceItems[index].comments = val;
        }
        if (property === 'finalCost') {
            this.ItemData[cartindex].cartInvoiceItems[index].finalCost = Math.round((val + Number.EPSILON) * 100) / 100;
        }
        this.calculate();
    }

    calculate() {
        this.total = 0;
        for (let i = 0; i < this.ItemData.length; i++) {
            for (let j = 0; j < this.ItemData[i].cartInvoiceItems.length; j++) {
                this.total = this.total + (
                    (this.ItemData[i].cartInvoiceItems[j].finalCost !== '' ? this.ItemData[i].cartInvoiceItems[j].finalCost : 0));
            }
        }
        this.total = (Math.round((this.total + Number.EPSILON) * 100) / 100) +
            (this.deliveryMethodPrice !== undefined ?
                (Math.round((this.deliveryMethodPrice + Number.EPSILON) * 100) / 100) : 0);
        this.noOfCD = this.noOfCD !== undefined ? this.noOfCD : 1;
        this.deliveryModePrice = ((this.noOfCD !== undefined ? this.noOfCD : 0) *
            (this.tempDeliveryModePrice !== undefined ? (Math.round((this.tempDeliveryModePrice + Number.EPSILON) * 100) / 100) : 0));
        this.deliveryMethodPrice = (Math.round((this.deliveryMethodPrice + Number.EPSILON) * 100) / 100);
        this.deliveryModePrice = (Math.round((this.deliveryModePrice + Number.EPSILON) * 100) / 100);
        this.total = (Math.round((this.total + Number.EPSILON) * 100) / 100) +
            (Math.round((this.deliveryModePrice + Number.EPSILON) * 100) / 100);
    }

    calculatePrice() {
        this.total = 0;
        for (let i = 0; i < this.ItemData.length; i++) {
            for (let j = 0; j < this.ItemData[i].cartInvoiceItems.length; j++) {
                this.total = this.total + (
                    (this.ItemData[i].cartInvoiceItems[j].finalCost !== '' ? this.ItemData[i].cartInvoiceItems[j].finalCost : 0));
            }
        }
        this.total = (Math.round((this.total + Number.EPSILON) * 100) / 100) +
            (this.deliveryMethodPrice !== undefined ?
                (Math.round((this.deliveryMethodPrice + Number.EPSILON) * 100) / 100) : 0);
        this.noOfCD = this.noOfCD !== undefined ? this.noOfCD : 1;
        // this.deliveryModePrice = ((this.noOfCD !== undefined ? this.noOfCD : 0) *
        //     (this.tempDeliveryModePrice !== undefined ? (Math.round((this.tempDeliveryModePrice + Number.EPSILON) * 100) / 100) : 0));
        this.deliveryMethodPrice = (Math.round((this.deliveryMethodPrice + Number.EPSILON) * 100) / 100);
        // this.deliveryModePrice = (Math.round((this.deliveryModePrice + Number.EPSILON) * 100) / 100);
        this.total = (Math.round((this.total + Number.EPSILON) * 100) / 100) +
            (Math.round((this.deliveryModePrice + Number.EPSILON) * 100) / 100);
    }

    saveInvoiceData(downloadVal, value) {
        if (this.paymentInfo === null) {
            const finalData = [];
            for (let i = 0; i < this.ItemData.length; i++) {
                for (let j = 0; j < this.ItemData[i].cartInvoiceItems.length; j++) {
                    finalData.push(this.ItemData[i].cartInvoiceItems[j]);
                }
            }
            if (this.ItemData.deliveryMedium) {
                const tempInvoiceData = {
                    'cartDataId': -1,
                    'cartItemId': this.deliveryData.length > 0 ? this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].cartItemId : null,
                    'comments': this.notes,
                    'details': 'Delivery Mode',
                    'finalCost': this.deliveryModePrice,
                    'type': this.noOfCD,
                    'item': this.deliveryMedia.caption,
                    'lpicode': -1111111111,
                    'sno': '',
                    'systemEstimate': this.deliveryModePrice,
                    'timeRequired': '',
                    'workflowId': this.taskDetail.workflowId
                };
                this.ItemData.deliveryMedium = tempInvoiceData;
                finalData.push(tempInvoiceData);
            }
            if (this.ItemData.deliveryMethod != null) {
                const tempInvoiceData = {
                    'cartDataId': -1,
                    'cartItemId': this.deliveryData.length > 0 ? this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].cartItemId : null,
                    'comments': '',
                    'details': 'Delivery Method',
                    'finalCost': this.deliveryMethodPrice,
                    'type': '',
                    'item': this.selectedMode.caption,
                    'lpicode': -1111111111,
                    'sno': '',
                    'systemEstimate': this.deliveryMethodPrice,
                    'timeRequired': '',
                    'workflowId': this.taskDetail.workflowId
                };
                this.ItemData.deliveryMethod = tempInvoiceData;
                finalData.push(tempInvoiceData);
            }
            const arr = {
                notes: this.notes,
                totalInvoiceCost: this.total,
                userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
                workflowId: this.taskDetail.workflowId,
                cartInvoiceItems: finalData
            };
            if (value === 'view') {
                this.loaderService.display(true);
                this.restService.generateInvoicePdf(this.taskDetail.workflowId).subscribe((res: any) => {
                    this.downloadBlob(res, 'invoice.pdf');
                    this.loaderService.display(false);
                }, error => {
                    this.loaderService.display(false);
                });
            } else if (value === 'save') {
                this.loaderService.display(true);
                this.restService.partialSaveInvoiceData(arr).subscribe(payload => {
                    if (payload.data.update === true) {
                        this.snackbar.openSnackBar('Invoice data saved successfully', 'Success');
                        this.getInvoiceData();
                        // if (downloadVal) {
                        //     this.downloadInvoice();
                        // }
                    }
                    this.loaderService.display(false);
                }, error => {
                    this.loaderService.display(false);
                });
            } else if (value === 'submit') {
                this.loaderService.display(true);
                this.restService.saveInvoiceData(arr).subscribe(payload => {
                    if (payload.data.update === true) {
                        this.snackbar.openSnackBar('Invoice data submitted successfully', 'Success');
                        // this.restService.generateInvoicePdf(this.taskDetail.workflowId).subscribe((res: any) => {
                        this.getInvoiceData();
                        this.changeTab(6);
                        // }, error => {
                        //     this.loaderService.display(false);
                        // });
                    }
                }, error => {
                    this.loaderService.display(false);
                });
            }
        }
    }

    getRequestorInformation() {
        if (this.taskDetail.processName === 'Information Request' || this.taskDetail.processName === 'Single Request') {
            this.loaderService.display(true);
            this.restService.getRequestorInformation(this.taskDetail.workflowId).subscribe((res: any) => {
                this.requestorInformation = res.data;
                this.setRequestorInfoData();
                this.loaderService.display(false);
            }, error => {
                this.loaderService.display(false);
            });
        } else {
            this.getWorkflowBasedItem();
        }
    }

    setRequestorInfoData() {
        this.RequestersInfo.patchValue({
            email: this.requestorInformation.requestLoggedBy.email,
            firstName: this.requestorInformation.requestLoggedBy.firstName,
            lastName: this.requestorInformation.requestLoggedBy.surName,
            requestType: this.requestorInformation.requesterType,
            formatType: this.requestorInformation.deliveryMedium,
            deliveryMethod: this.requestorInformation.deliveryMethod,
        });
        this.ownMedia = this.requestorInformation.isMediaToDepartment === 1 ? 'Yes' : 'No';
        this.requestorClient = this.requestorInformation.requesterType;
        if (this.requestorClient === 'SELF') {
            this.requestor = 'Yes';
        } else {
            this.requestor = 'No';
        }
        this.requesterForm.patchValue({
            requesterName: this.requestorInformation.requesterDetails.firstName,
            requesterSurame: this.requestorInformation.requesterDetails.surName,
            Email: this.requestorInformation.requesterDetails.email,
            Fax: this.requestorInformation.requesterDetails.fax,
            Address1: this.requestorInformation.requesterDetails.addressLine1,
            Address2: this.requestorInformation.requesterDetails.addressLine2,
            Address3: this.requestorInformation.requesterDetails.addressLine3,
            PostalCode: this.requestorInformation.requesterDetails.postalCode,
            contactNumber: this.requestorInformation.requesterDetails.contactNo
        });

        if (this.requestorInformation != null && this.requestorInformation !== undefined) {
            // if (this.requestorInformation.deliveryMedium === 'ELECTRONIC') {
            this.RequestersInfo.patchValue({
                add1: this.requestorInformation.requesterDetails.addressLine1,
                add2: this.requestorInformation.requesterDetails.addressLine2,
                add3: this.requestorInformation.requesterDetails.addressLine3,
                collectionAddress: this.requestorInformation.requesterDetails.addressLine1 + ' ' +
                    this.requestorInformation.requesterDetails.addressLine2 + ' ' +
                    this.requestorInformation.requesterDetails.addressLine3,
                zipcode: this.requestorInformation.requesterDetails.postalCode,
                phone: this.requestorInformation.requesterDetails.contactNo
            });
            // }
        }
    }

    selectImage(event) {
        this.selectedImageSource = event;
        this.selectedImageID = event.preview;
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ImageDialogComponent, {
            width: '750px',
            data: {
                images: this.imageArray
            }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            if (resultCode) {
                this.snackbar.openSnackBar('Province added Successfully', 'Success');
            }
        });
    }

    openReferralInput(element) {
        const dialogRef = this.dialog.open(ReferralInputDialogComponent, {
            width: '750px',
            data: {
                value: element
            }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    getAllUserByUserType(roleid) {
        this.assignUser = '';
        this.notes = '';
        this.loaderService.display(true);
        this.restService.getUserByRoleIdProvinceId(this.taskDetail.provinceId, roleid).subscribe(response => {
            this.users = response.data;
            this.assignedFilteredUsers.next(this.users.slice());
            this.loaderService.display(false);
            this.assignDecisionUser = this.users[0].userId;
            this.assignedUserSelected(this.assignDecisionUser);
            this.decisionform.patchValue({
                assignedToUserId: this.assignDecisionUser
            });
            this.searchUserFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroySearchUser))
                .subscribe(() => {
                    this.filterSeachUser();
                });
        });
    }

    protected filterSeachUser() {
        if (!this.users) {
            return;
        }
        let search = this.searchUserFilterCtrl.value;
        if (!search) {
            this.assignedFilteredUsers.next(this.users.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.assignedFilteredUsers.next(
            this.users.filter(value => (value.firstName + ' ' + value.surname).toLowerCase().indexOf(search) > -1)
        );
    }

    filterUsers(value: string) {
        const filterValue = value.toLowerCase();
        return this.users.filter(user => (user.firstName + ' ' + user.surname).toLowerCase().includes(filterValue));
    }

    assignedUserSelected(event) {
        this.assignUser = this.users.filter(x => x.userId === event)[0];
        this.tooltipText = this.assignUser.firstName !== undefined ? 'UserName: ' + this.assignUser.firstName + ' '
            + this.assignUser.surname + '\n' + 'User Type: ' + (this.assignUser.userType) : '';
    }

    displayFn(user) {
        return user ? (user.firstName + ' ' + user.surname) : '';
    }

    getNodeDetails() {
        this.restService.getNodeDetails(this.taskDetail.processId, this.taskDetail.nodeId)
            .subscribe((res: any) => {
                this.nodeDetails = res;
                this.menuItems[1].title = res.formName;
                this.menuItems[1].description = res.Description;
                this.outLinks = this.nodeDetails.OutLink.filter(x => x.actionCaption !== '');
                if (this.outLinks.length > 0) {
                    for (let i = 0; i < this.outLinks.length; i++) {
                        this.outLinks[i].checked = false;
                    }
                }

            });
    }

    getWorkflowDocument() {
        this.restService.getWorkflowDocument(this.taskDetail.workflowId).subscribe((res: any) => {
            this.workflowDoc = res.data;
        });
    }


    listItemsByListCode() {
        this.restService.listItemsByListCode(28).subscribe((res: any) => {
            this.listItems = res.data;
        });
    }


    getAllReferrals() {
        this.loaderService.display(true);
        this.restService.getAllReferrals(this.taskDetail.workflowId).subscribe((res: any) => {
            this.loaderService.display(false);
            this.referrals = res.data;
            this.refData = new MatTableDataSource(this.referrals);
            this.refData.paginator = this.paginator;
            this.refDataLength = this.refData.data.length || 0;
        });
    }

    loadTaskFlow() {
        this.restService.loadTaskFlow(this.taskDetail.workflowId).subscribe((res: any) => {
            this.requestFlow = res.data;
            this.refreshflowTable();
        });
    }


    refreshflowTable() {
        this.flowDataSource = new MatTableDataSource(this.requestFlow);
        this.flowDataSource.paginator = this.paginator;
        this.flowDataLength = this.flowDataSource.data.length || 0;
    }

    getReferralInputData() {
        this.restService.getReferralInputData(this.taskDetail.workflowId).subscribe((res: any) => {
            this.referralInput = res.data;
        });
    }


    changeTab(id: number) {
        this.menuItems = this.menuItems.map((item) => {
            item.isActive = false;
            if (item.id === id) {
                item.isActive = true;
                this.activeTabId = id;
            }
            return item;
        });
        if (id === 1) {
            this.getRequestorInformation(); // TAB 1
        } else if (id === 2 && this.nodeDetails.FormID === '2') {
            this.getInformationRequestItem(); // TAB 2 && FORMID 2
        } else if (id === 2 && this.nodeDetails.FormID === '3') {
            this.getInvoiceData();  // TAB 2 && FORMID 3
            this.getPaymentInfo();
        } else if (id === 2 && this.nodeDetails.FormID === '4') {
            this.getPaymentInfo(); // TAB 2 && FORMID 6 && FORMID 4
        } else if (id === 2 && this.nodeDetails.FormID === '5') {
            this.getInformationRequestDispatchItem(); // TAB 2 && FORMID 5
            this.getPaymentInfo();
        } else if (id === 2 && this.nodeDetails.FormID === '6') {
            this.getPaymentInfo(); // TAB 2 && FORMID 6 && FORMID 4
        } else if (id === 3) {
            this.loadTaskFlow(); // TAB 3
        } else if (id === 4) {
            this.getSupportingDocuments(); // TAB 4
            this.listItemsByListCode();
        } else if (id === 5) {
            this.getAllReferrals(); // TAB 5
        } else if (id === 6) {
            // this.getAllUserByUserType(); // TAB 5
        } else if (id === 2 && this.nodeDetails.FormID === '11') {
            this.getReferralInputData(); // TAB 2 && FORMID 6 && FORMID 4
        }
    }

    viewReferral() {
        const dialogRef = this.dialog.open(ViewReviewInfoComponent, {
            width: '100%',
            data: this.taskDetail,
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    previewEmail() {
        const dialogRef = this.dialog.open(EmailModalComponent, {
            width: '600px',
            data: this.taskDetail.workflowId
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    close() {
        this.router.navigate(['/tasks/task-list']);
    }

    MarkAsPending(): void {
        const dialogRef = this.dialog.open(MarkAsPendingComponent, {
            width: '750px',
            data: { value: this.taskDetail },
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    userdailogReassign(): void {
        const dialogRef = this.dialog.open(UserinfoDialogComponent, {
            width: '750px',
            data: { value: 'ReAssign', actionId: this.taskDetail.actionId },
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    sendtosection(): void {
        const dialogRef = this.dialog.open(SendsectionDialogComponent, {
            width: '750px',
            data: { value: 'SendSection', actionId: this.taskDetail.actionId, provinceId: this.taskDetail.provinceId },
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    userdailogReferralinfo(): void {
        const dialogRef = this.dialog.open(UserinfoDialogComponent, {
            width: '750px',
            data: { value: 'Referral Information', data: this.taskDetail, actionId: this.taskDetail.actionId },
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    closeTask(): void {
        const dialogRef = this.dialog.open(UserinfoDialogComponent, {
            width: '750px',
            data: { value: 'Close Task', data: this.taskDetail, actionId: this.taskDetail.actionId },
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    reopenTask(): void {
        const dialogRef = this.dialog.open(UserinfoDialogComponent, {
            width: '750px',
            data: { value: 'Reopen Task', data: this.taskDetail, actionId: this.taskDetail.actionId },
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    changeProvince(): void {
        const dialogRef = this.dialog.open(ChangeprovinceDialogComponent, {
            width: '750px',
            autoFocus: false,
            data: { value: this.taskDetail },
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    reOpen(): void {
        const dialogRef = this.dialog.open(ReopendialogComponent, {
            width: '750px',
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    addToDiary(): void {
        const dialogRef = this.dialog.open(AddtodiaryDialogComponent, {
            width: '750px',
            data: { value: this.taskDetail.workflowId, actionId: this.taskDetail.actionId },
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    dispatchdoc(): void {
        const dialogRef = this.dialog.open(DispatchDocComponent, {
            width: '400px',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    employeedetails(): void {
        if (this.assignUser === '') {
            this.decisionform.get('assignedToUserId').markAsTouched();
        } else {
            const dialogRef = this.dialog.open(EmployeedetailsComponent, {
                width: '750px',
                data: this.assignUser.userId,
                panelClass: 'custom-modalbox'
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {

            });
        }
    }

    expediteTask(): void {
        const dialogRef = this.dialog.open(ExpeditetaskDialogComponent, {
            width: '750px',
            data: { value: this.taskDetail.workflowId },
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    cancelTask(): void {
        const dialogRef = this.dialog.open(CanceltaskDialogComponent, {
            width: '750px',
            data: { value: this.taskDetail },
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    sendEmail() {
        const dialogRef = this.dialog.open(SendEmailModalComponent, {
            width: '800'
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
            }
        });
    }

    sendSMS() {
        const dialog = this.dialog.open(SendSMSModalComponent, {
            width: '50%'
        });

        dialog.afterClosed().subscribe(data => {
            if (data) {
                this.restService.sendSMS(data.to, data.body).subscribe(() => {
                    this.snackbar.openSnackBar('SMS send Succesfully', 'Success');
                });
            }
        });
    }

    viewdispatch(element): void {
        const dialogRef = this.dialog.open(ViewdispatchComponent, {
            width: '750px',
            data: { value: element },
        });
        dialogRef.afterClosed().subscribe(async (res) => {

        });
    }

    getWorkflowTasks() {
        this.loaderService.display(true);
        this.restService.getWorkflowTasks(this.taskDetail.workflowId).subscribe(payload => {
            this.flowDataSource = payload.data;
            this.loaderService.display(false);
        },
            error => {
                this.loaderService.display(false);
                if (error.message === 'No tasks found.') {
                    this.snackbar.openSnackBar('No tasks found.', 'Message');
                } else {
                    this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
                }
            });
    }

    getSupportingDocuments() {
        this.loaderService.display(true);
        this.restService.getSupportingDocuments(this.taskDetail.workflowId).subscribe(payload => {
            this.supportingDocuments = payload.data;
            this.loaderService.display(false);
        },
            error => {
                this.loaderService.display(false);
                if (error.message === 'No tasks found.') {
                    this.snackbar.openSnackBar('No tasks found.', 'Message');
                } else {
                    this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
                }
            });
    }

    mouseEnter(trigger) {
        if (this.timedOutCloser) {
            clearTimeout(this.timedOutCloser);
        }
        trigger.openMenu();
    }

    mouseLeave(trigger) {
        this.timedOutCloser = setTimeout(() => {
            trigger.closeMenu();
        }, 50);
    }

    selectFile(file: FileList) {

        this.fileToUpload = file.item(0);


        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.fileUrl = event.target.value;
        };
        this.docName = this.fileToUpload.name;
        this.uploadDocForm.patchValue({
            file: this.fileToUpload
        });
    }


    submitDoc() {
        this.loaderService.display(true);
        const obj = this.uploadDocForm.value;
        this.restService.uploadSupportingDocs(obj)
            .subscribe((res) => {
                this.getSupportingDocuments();
                this.uploadDocForm.patchValue({
                    comment: '',
                    documentType: '',
                    file: {},
                });
                this.docName = '';
                this.loaderService.display(false);
                this.changeTab(6);
            }, error => {
                this.loaderService.display(false);
            });
    }

    deleteDoc(doc) {
        this.loaderService.display(true);
        const docId = doc.documentId;
        const workflowI = doc.workflowId;
        this.restService.deleteWorkflowDocs(docId, workflowI).subscribe((res) => {
            this.getSupportingDocuments();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    downloaddoc(doc) {
        this.loaderService.display(true);
        const docId = doc.documentId;
        this.restService.downloadWorkflowSupportingDocs(docId).subscribe((res) => {
            this.downloadBlob(res, doc.documentName);
            this.getSupportingDocuments();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    onProcessChange(event) {
        this.decisionform.patchValue({
            actionTakenId: Number(event.value.Action)
        });
        this.decisionSelected = false;
        this.restService.getNodeDetails(this.taskDetail.processId, event.value.NextNodeID)
            .subscribe((res: any) => {
                this.nodedetailsnext = res;
                this.formHeading = this.nodedetailsnext.formName;
                this.formDescription = this.nodedetailsnext.Description;
                this.getAllUserByUserType(event.value.nextNodeRoleId);
                this.nextOutLinks = this.nodedetailsnext.OutLink.filter(x => x.actionCaption !== '');
                if (this.nextOutLinks.length > 0) {
                    for (let i = 0; i < this.nextOutLinks.length; i++) {
                        this.nextOutLinks[i].checked = false;
                    }
                }
            });
    }


    decisionDialog(data): void {
        const dialogRef = this.dialog.open(ConfirmDecisionComponent, {
            width: '546px',
            data: { value: data }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.router.navigate(['tasks/task-list']);
        });
    }

    submitDecision() {
        this.loaderService.display(true);
        if (this.decisionform.invalid) {
            this.decisionform.get('assignedToUserId').markAsTouched();
            this.decisionform.get('notes').markAsTouched();
            this.loaderService.display(false);
            return;
        } else {
            const decision = this.decisionform.value;
            decision.assignedToUserId = this.assignUser.userId,

                this.restService.processtask(decision).subscribe((res: any) => {
                    this.decisionDialog(res);
                    this.loaderService.display(false);
                    this.addUserNotification();
                }, error => {
                    this.loaderService.display(false);
                });

        }
    }

    addUserNotification() {
        const decision = this.decisionform.value;

        const notification = {
            'loggedInUserId': this.userId,
            'notifyUserId': this.assignUser.userId,
            'subject': this.taskDetail.processName + ': ' + this.taskDetail.actionRequiredDescription + ' ' + this.taskDetail.referenceNo,
            'description': decision.notes,
            'contextTypeId': 5055,
            'contextId': this.taskDetail.workflowId

        };

        this.restService.addUserNotification(notification).subscribe(async (result) => { });

    }
    // onProcessChange2(event) {
    //     this.Process = event.value;
    // }

    // DISPATCH ACTION

    getInformationRequestDispatchItem() {
        this.loaderService.display(true);
        this.restService.getDispatchTemplateData(this.taskDetail.workflowId).subscribe(response => {

            if (response.data) {
                this.DispatchItemData = response.data.filter(x => x.searchDetails !== null);
                const temp = response.data.filter(x => x.searchDetails === null)[0];
                const dispathAddInfo = response.data.filter(x => x.searchDetails === null)[0].cartDispatchAdditionalInfo;
                if (temp !== null && temp !== undefined) {
                    if (dispathAddInfo === null) {
                        this.dispatchMethodName = temp.cartDispatchItems.filter(x => x.details === 'Delivery Method')[0].item;
                        this.dispatchMedia = temp.cartDispatchItems.filter(x => x.details === 'Delivery Mode')[0].item;
                        if (temp.cartDispatchItems.filter(x => x.details === 'Delivery Method')[0].item !== 'ELECTRONICS') {
                            this.DispatchItemDeliveryData = temp.cartDispatchItems.filter(x => x.details === 'Delivery Method')[0].item;
                        } else {
                            this.DispatchItemDeliveryData = temp.cartDispatchItems.filter(x => x.details === 'Delivery Mode')[0].item;
                        }
                    } else {
                        this.dispatchMethodName = this.selectedModes.filter(x => x.caption === dispathAddInfo.deliveryMethod)[0].caption;
                        this.dispatchMedia = this.deliveryMedias.filter(x => x.caption === dispathAddInfo.deliveryMedium)[0].caption;
                        this.dispatchMethod.patchValue({
                            primaryEmail: dispathAddInfo.primaryEmail,
                            secondaryEmail: dispathAddInfo.secondaryEmail,
                            referenceNumber: dispathAddInfo.referenceNumber,
                            dataDispatched: dispathAddInfo.dataDispatched,
                            collectorName: dispathAddInfo.collectorName,
                            collectorSurname: dispathAddInfo.collectorSurname,
                            collectorContactNumber: dispathAddInfo.collectorContactNumber,
                            postaladdressLine1: dispathAddInfo.postaladdressLine1,
                            postaladdressLine2: dispathAddInfo.postaladdressLine2,
                            postaladdressLine3: dispathAddInfo.postaladdressLine3,
                            postalCode: dispathAddInfo.postalCode,
                            courierName: dispathAddInfo.courierName,
                            contactPerson: dispathAddInfo.contactPerson,
                            ftpDetails: dispathAddInfo.ftpDetails,
                            cartDispatchId: dispathAddInfo.cartDispatchId == null ? 0 : dispathAddInfo.cartDispatchId
                        });
                    }
                }
                if (this.DispatchItemData !== null || this.DispatchItemData !== undefined) {
                    if (this.DispatchItemData.length > 0) {
                        for (let i = 0; i < this.DispatchItemData.length; i++) {
                            // const arr1 = this.DispatchItemData[i].searchDetails.preview.split(',').filter(function (el) {
                            //     return el !== '';
                            //   });
                            // this.DispatchItemData[i].searchDetails.tempPreview = arr1;
                            // this.DispatchItemData[i].searchDetails.firstImgPreview = arr1[0];
                            if (this.DispatchItemData[i].searchDetails.leaseNo) {
                                this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.leaseNo;
                                this.DispatchItemData[i].searchDetails.filterName = 'Lease Number';
                            } else if (this.DispatchItemData[i].searchDetails.surveyRecordNo) {
                                this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.surveyRecordNo;
                                this.DispatchItemData[i].searchDetails.filterName = 'Survey Record Number';
                            } else if (this.DispatchItemData[i].searchDetails.deedNo) {
                                this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.deedNo;
                                this.DispatchItemData[i].searchDetails.filterName = 'Deed Number';
                            } else if (this.DispatchItemData[i].searchDetails.compilationNo) {
                                this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.compilationNo;
                                this.DispatchItemData[i].searchDetails.filterName = 'Compilation Number';
                            }
                            this.showImageLoader = true;
                            this.getDocument(this.DispatchItemData[i].searchDetails.recordId, i);
                        }
                        // this.selectedImageSource = this.DispatchItemData[0].searchDetails.preview.split(',')[0];
                    }
                    // this.selectedImageSource = this.DispatchItemData[0].searchDetails.preview.split(',')[0];
                }
            } else {
                this.DispatchItemData = [];
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    UpdatedDispatchItem(val, property, index, cartindex) {
        if (property === 'comment') {
            this.DispatchItemData[cartindex].cartDispatchItems[index].comments = val;
        }
        if (property === 'dispatchStatus') {
            this.DispatchItemData[cartindex].cartDispatchItems[index].dispatchStatus = val;
            const data = {
                'cartItemId': this.DispatchItemData[cartindex].cartDispatchItems[index].cartItemId,
                'comments': this.DispatchItemData[cartindex].cartDispatchItems[index].comments,
                'dispatchStatus': val === true ? 1 : 0
            };
            this.restService.addCartItemDispatchInfo(data).subscribe(response => {
                if (response.data.update) {
                    // TODO get data from API after update
                }
            });
        }
    }

    saveDispatchData() {
        const tempPayload = this.dispatchMethod.value;
        this.dispatchMethodName = this.selectedModes.filter(x => x.caption === this.dispatchMethodName)[0].itemId;
        this.dispatchMedia = this.deliveryMedias.filter(x => x.caption === this.dispatchMedia)[0].itemId;
        tempPayload.deliveryMethod = this.dispatchMethodName;
        tempPayload.deliveryMedium = this.dispatchMedia;
        const obj = JSON.stringify(tempPayload);
        const data = {
            'cartDispatchId': this.dispatchMethod.value.cartDispatchId,
            'dispatchDetails': obj,
            'workflowId': this.taskDetail.workflowId
        };
        this.loaderService.display(true);
        this.restService.addDispatchDetails(data).subscribe(response => {
            if (response !== null) {
                this.getInformationRequestDispatchItem();
                this.changeTab(6);
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });

    }

    dispatchDeliveryMethodChange(val) {
        this.selectedMode = val;
        if (this.selectedMode === 'ELECTRONIC') {
            this.deliveryMediasdata = [];
            for (let i = 0; i < this.deliveryMedias.length; i++) {
                if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                    this.deliveryMediasdata.push(this.deliveryMedias[i]);
                }
            }
        } else {
            this.deliveryMediasdata = [];
            for (let i = 0; i < this.deliveryMedias.length; i++) {
                if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                } else {
                    this.deliveryMediasdata.push(this.deliveryMedias[i]);
                }
            }
        }
        this.dispatchMedia = this.deliveryMediasdata[0].caption;
    }

    deliveryMethodChange(val) {
        this.selectedMode = val;
        if (this.selectedMode.caption === 'ELECTRONIC') {
            this.deliveryMediasdata = [];
            for (let i = 0; i < this.deliveryMedias.length; i++) {
                if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                    this.deliveryMediasdata.push(this.deliveryMedias[i]);
                }
            }
        } else {
            this.deliveryMediasdata = [];
            for (let i = 0; i < this.deliveryMedias.length; i++) {
                if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                } else {
                    this.deliveryMediasdata.push(this.deliveryMedias[i]);
                }
            }
        }
        const tempInvData = {
            'dataTypeListItemId': 0,
            'formatListItemId': this.selectedMode.itemId,
            'paperSizeListItemId': 0,
            'searchDataTypeId': -100,
            'subTypeListItemId': 0
        };
        this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
            // if (response.data != null) {
            const tempInvoiceData = {
                'comment': '',
                'details': '',
                'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 : Number(response.data.fee),
                'format': '',
                'item': this.selectedMode.caption,
                'lpiCode': -1111111111,
                'srNo': '',
                'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 : Number(response.data.fee),
                'timeRequiredInHrs': ''
            };
            this.deliveryMethodPrice = response.data == null ? 0 : response.data.fee == null ? 0 : Number(response.data.fee);
            this.ItemData.deliveryMethod = tempInvoiceData;
            this.calculate();
            // }
        });

    }

    deliveryMediumChange(val) {
        this.deliveryMedia = val;
        const tempInvData = {
            'dataTypeListItemId': 0,
            'formatListItemId': this.deliveryMedia.itemId,
            'paperSizeListItemId': 0,
            'searchDataTypeId': -100,
            'subTypeListItemId': 0
        };
        this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
            // if (response.data != null) {
            const tempInvoiceData = {
                'comment': this.notes,
                'details': '',
                'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 : Number(response.data.fee),
                'format': this.noOfCD,
                'item': this.deliveryMedia.caption,
                'lpiCode': -1111111111,
                'srNo': '',
                'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 : Number(response.data.fee),
                'timeRequiredInHrs': ''
            };
            this.deliveryModePrice = response.data == null ? 0 : response.data.fee == null ? 0 : Number(response.data.fee);
            this.tempDeliveryModePrice = this.deliveryModePrice;
            this.ItemData.deliveryMedium = tempInvoiceData;
            this.calculate();
            // }
        });
    }

    uploadProofOfPayment() {
        if (!this.uploadpaymentform.valid) {
            this.uploadpaymentform.get('file').markAsTouched();
            this.uploadpaymentform.get('comments').markAsTouched();
            this.uploadpaymentform.get('paymentReferenceNo').markAsTouched();
            this.uploadpaymentform.get('paidAmount').markAsTouched();
            this.uploadpaymentform.get('paymentDate').markAsTouched();
            return;
        }
        const obj = this.uploadpaymentform.value;
        const uid = this.userId;
        const formData: FormData = new FormData();
        formData.append('file', this.paymentFileToUpload[0]);
        formData.append('documentTypeId', obj.documentTypeId);
        formData.append('comments', obj.comments);
        formData.append('paymentId', this.paymentInfo.paymentId);
        formData.append('paymentReferenceNo', obj.paymentReferenceNo);
        formData.append('invoiceAmount', this.paymentInfo.invoiceAmount);
        formData.append('paymentDate', obj.paymentDate);
        formData.append('userId', uid);
        formData.append('paidAmount', obj.paidAmount);
        formData.append('workflowId', this.taskDetail.workflowId);
        formData.append('invoiceDueDate', this.paymentInfo.invoiceDueDate);
        this.loaderService.display(true);
        this.restService.uploadProofOfPayment(formData).subscribe(payload => {
            if (payload.data === 50000) {
                this.snackbar.openSnackBar('Proof of payment failed', 'Error');
            } else {
                this.uploadpaymentform.reset();
                this.uploadedPaymentFileName = '';
                this.snackbar.openSnackBar('Proof of payment added successfully', 'Success');
                this.changeTab(6);
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Proof of payment failed', 'Error');
        });
    }

    downloadInvoice() {
        this.loaderService.display(true);
        // if (this.paymentInfo != null) {
        //     this.restService.generateInvoicePdf(this.taskDetail.workflowId).subscribe((res: any) => {
        //         // this.downloadBlob(res, 'invoice.pdf');
        //         this.loaderService.display(false);
        //     }, error => {
        //         this.loaderService.display(false);
        //     });
        // } else {
        this.restService.downloadInvoicePdf(this.taskDetail.workflowId).subscribe((res: any) => {
            this.downloadBlob(res, 'invoice.pdf');
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
        // }
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

    downloadPOP() {
        this.loaderService.display(true);
        this.restService.paymentDocument(this.popDocInfo.documentId).subscribe((res1: any) => {
            this.downloadBlob(res1, this.popDocInfo.docName);
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    getPaymentInfo() {
        this.restService.getPaymentInfo(this.taskDetail.workflowId).subscribe(payload => {
            this.paymentInfo = payload.data;
        });
    }

    setStep(step) {
    }

    openViewMapDialog(searchDetails): void {
        this.dialog.open(ViewMapDialogComponent, {
            width: '90%',
            height: '90%',
            data: {
                url: VIEW_MAP_URL + searchDetails.lpi
            }
        });
    }

    navigate(item) {
        this.router.navigate(['/land-profile'], { state: { lpi: item.searchDetails.lpi, recordId: item.searchDetails.recordId } });
    }

    navigateTaskProfile() {
        this.router.navigate(['/task-profile'], { state: { taskDetail: this.taskDetail } });
    }
    navigateReferralTaskProfile(value) {
        this.router.navigate(['/task-profile'], { state: { taskDetail: value } });
    }

    getDocument(id, i) {
        this.restService.getDcoumentForRecord(id).subscribe(payload => {
            if (this.infoReview !== undefined) {
                this.infoReview[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
                this.infoReview[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
                this.infoReview[i].searchDetails.tempPreview = payload.body.data[0];
                this.infoReview[i].searchDetails.imageArray = [];
                for (let j = 0; j < payload.body.data.length; j++) {
                    const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
                    this.infoReview[i].searchDetails.imageArray.push(
                        {
                            small: payload.body.data[j].thumbnail,
                            medium: payload.body.data[j].preview,
                            big: payload.body.data[j].preview,
                            description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                            url: payload.body.data[j].url
                        }
                    );
                }
                this.galleryImages = this.infoReview[i].searchDetails.imageArray;
            }
            if (this.ItemData !== undefined) {
                this.ItemData[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
                this.ItemData[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
                this.ItemData[i].searchDetails.tempPreview = payload.body.data[0];
                this.ItemData[i].searchDetails.imageArray = [];
                for (let j = 0; j < payload.body.data.length; j++) {
                    const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
                    this.ItemData[i].searchDetails.imageArray.push(
                        {
                            small: payload.body.data[j].thumbnail,
                            medium: payload.body.data[j].preview,
                            big: payload.body.data[j].preview,
                            description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                            url: payload.body.data[j].url
                        }
                    );
                }
                this.galleryImages = this.ItemData[i].searchDetails.imageArray;
            }
            if (this.DispatchItemData !== undefined) {
                this.DispatchItemData[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
                this.DispatchItemData[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
                this.DispatchItemData[i].searchDetails.tempPreview = payload.body.data[0];
                this.DispatchItemData[i].searchDetails.imageArray = [];
                for (let j = 0; j < payload.body.data.length; j++) {
                    const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
                    this.DispatchItemData[i].searchDetails.imageArray.push(
                        {
                            small: payload.body.data[j].thumbnail,
                            medium: payload.body.data[j].preview,
                            big: payload.body.data[j].preview,
                            description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                            url: payload.body.data[j].url
                        }
                    );
                }
                this.galleryImages = this.DispatchItemData[i].searchDetails.imageArray;
            }
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
        }, error => {
        });
    }

    back() {
        this.router.navigate(['/tasks/task-list'], { state: { filter: this.filters } });
    }

    downloadImage(event, index) {
        const imageUrl = this.galleryImages[index].url;
        const image: any[] = [];
        image.push(imageUrl);
        const fileName = imageUrl.toString().split('/').pop();
        const obj = {
            'dataKeyName': 'sgdata',
            'documentName': fileName,
            'documentUrl': image,
            'provinceId': this.taskDetail.provinceId,
            'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
        };
        this.loaderService.display(true);
        this.restService.downloadSgDataImage(obj).subscribe(payload => {
            this.downloadBlob(payload, fileName);
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }
}

export interface MenuItem {
    id: number;
    name: string;
    activeIconUrl: string;
    inActiveIconUrl: string;
    isActive: boolean;
    title: string;
    description: string;
}
