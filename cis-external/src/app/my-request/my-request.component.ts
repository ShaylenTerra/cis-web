import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {StorageConstants} from '../constants/storage-keys';
import {IUser} from '../interface/user.interface';
import {RestcallService} from '../services/restcall.service';
import {SnackbarService} from '../services/snackbar.service';
import {CancelDialogComponent} from './cancel-dialog/cancel-dialog.component';
import {APP_DATE_FORMATS, AppDateAdapter} from './format-datepicket';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { DatePipe } from '@angular/common';
import { LoaderService } from '../services/loader.service';
import { ConfirmDecisionComponent } from './confirm-decision/confirm-decision.component';
import { forkJoin } from 'rxjs';

const types = [
    {name: 'Type 1'},
    {name: 'Type 2'},
    {name: 'Type 3'},
];

@Component({
    selector: 'app-my-request',
    templateUrl: './my-request.component.html',
    styleUrls: ['./my-request.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
        DatePipe
    ],
})
export class MyRequestComponent implements OnInit {
    @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    showImageLoader: any = false;
    showSideCollapser = true;
    ownMedia: any;
    users: IUser[];
    isSpinnerVisible = false;
    uploadedFileName = 'Upload document';
    nextOutLinks: any[] = [];
    Process = false;
    assignedFilteredUsers;
    confirmPaymentform: FormGroup;
    formHeading: string;
    formDescription: string;
    processHeading: string;
    nodedetailsnext: any;
    assignUser: any;
    tooltipText: any;
    activeTabId = 1;
    workflowDoc: any[];
    requestFlow: any[];
    listItems: any[] = ['POP', 'Genral', 'Invoice'];
    columnType1 = ['sno', 'format', 'type'];
    columnType2 = ['sno', 'certType', 'format', 'type'];
    columnType3 = ['sno', 'type'];
    columnType4 = ['sno', 'type'];
    nodeDetails: any;
    uploadDocForm: FormGroup;
    RequestersInfo: FormGroup;
    fileToUpload: File = null;
    docName: string;
    fileUrl: string;
    requestorInformation: any;
    requestorInformation2: any[];
    notifyRequestorInformation: any;
    referrals: any[];
    itemDataSource: any;
    itemColumns = ['items', 'actions', 'cost'];
    flowDataSource: any;
    flowDataLength: number;
    flowColumns = ['date', 'user', 'action', 'duration'];
    diagramColumns = ['sno', 'format', 'type'];
    refCols: Array<string> = ['refno', 'dated', 'note', 'toUser', 'fromUser', 'referralInput', 'inputDate', 'sms', 'email'];
    outLinks: any[] = [];
    selectedRequestFiles: any;
    selectedPaymentFiles: any;
    selectedInvoiceFiles: any;
    selectedSupportingFiles: any;
    refData: any;
    refDataLength: number;
    timedOutCloser;
    menuItems: Array<Menu> = [];
    columns = ['sno', 'format', 'data', 'conversion', 'estimate', 'time', 'comment', 'finalCost'];
    dataSource1: any;
    myRequest: any;
    supportingDocuments: any[];
    state;
    notes = '';
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    userSession = JSON.parse(sessionStorage.getItem('userInfo'));
    decisionform: FormGroup;
    proofOfPayment: FormGroup;
    cartId = null;
    ItemData;
    tempdata;
    selectedImageID = 'image1';
    contexttype = 'Query';
    queryDescription;
    issueType;
    searchColumns = ['province', 'searchType', 'searchFilter', 'searchNo'];
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    imageArray: any;
    selectedImageSource: any;
    paymentInfo;
    step: any = 0;
    types = types;
    requestorClient = 'ANONYMOUS';
    requestor: any = 'Yes';
    requesterForm: FormGroup;
    notifyReview: FormGroup;
    documentTypeIdSelected = 133;
    maxDate: any = new Date();
    formatType;
    constructor(private router: Router, private dialog: MatDialog,
                private restService: RestcallService,
                private snackbar: SnackbarService,
                private fb: FormBuilder,
                private datePipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef,
                private loaderService: LoaderService
    ) {
        if (this.router.getCurrentNavigation().extras.state === undefined) {
            this.router.navigate(['home']);
        }

        this.myRequest = this.router.getCurrentNavigation().extras.state.myRequest;
        this.itemDataSource = [
            {items: 'Ariel Photography- & Imagery Related Products', cost: ''},
            {items: 'Search Texts', cost: ''}
        ];
        this.refData = [];
        if (this.myRequest.processName === 'Information Request' || this.myRequest.processName === 'Single Request') {
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
                }
            ];
        } else if (this.myRequest.processName === 'Query') {
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
                    id: 4,
                    name: 'queryTab',
                    isActive: false,
                    activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                    inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                    title: 'Query Details',
                    description: ''
                },
                {
                    id: 5,
                    name: 'queryfeedbackTab',
                    isActive: false,
                    activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                    inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                    title: 'Query Feedback',
                    description: ''
                },
            ];
        } else if (this.myRequest.processName === 'Notify Manager') {
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
                    id: 6,
                    name: 'notifyManagerTab',
                    isActive: false,
                    activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                    inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                    title: 'Notify Manager Details',
                    description: ''
                }
            ];
        } else if (this.myRequest.processName === 'Referral Task') {
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
                    id: 7,
                    name: 'referralTaskTab',
                    isActive: false,
                    activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                    inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                    title: 'Referral Task Details',
                    description: ''
                }
            ];
        }

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

        this.proofOfPayment = this.fb.group({
            file: '',
            comments: '',
            paymentId: '',
            documentTypeId: 133,
            paymentReferenceNo: '',
            invoiceAmount: '',
            paymentDate: '',
            userId: '',
            paidAmount: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
            workflowId: ''
        });

        this.confirmPaymentform = this.fb.group({
            Notes: '',
        });

        this.decisionform = this.fb.group({
            actionTakenId: 13,
            processId: this.myRequest.processId,
            loggedUserId: this.userId,
            notes: '',
            context: 'This is conext',
            type: 1,
            processData: '',
            currentNodeId: this.myRequest.nodeId,
            actionId: this.myRequest.actionId,
            assignedToUserId: 0
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
        return this.decisionform.get('assignedtouserid');
    }

    ngOnInit() {
        this.showImageLoader = true;
        this.listItemsByListCode();
        this.getInformationRequestItem();
        this.getRequestorInformation();
        this.getWorkflowDataForRequestType();
        this.getPaymentInfo();
        forkJoin([
            this.restService.getListItems(226)
        ]).subscribe(([formatType]) => {
            this.formatType = formatType.data;
        });
    }

    getWorkflowDataForRequestType() {
        this.restService.getWorkflowDataForRequestType(this.myRequest.workflowId).subscribe(res => {
        });
    }

    getWorkflowBasedItem() {
        this.restService.getWorkflowBasedItem(this.myRequest.workflowId).subscribe(res => {
            if (this.myRequest.processName === 'Notify Manager') {
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
                        requestType: this.myRequest.processName,
                    });
                // }
            }
            this.notifyReview.patchValue({
                email: this.notifyRequestorInformation ? this.notifyRequestorInformation.requesterInformation.requesterDetails.email : '',
            name: this.notifyRequestorInformation ? this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName + ' ' +
            this.notifyRequestorInformation.requesterInformation.requesterDetails.surName : '',
            searchTypeName: this.notifyRequestorInformation ?
                            this.notifyRequestorInformation.notifyManagerData.searchType : '',
            searchNumber: this.notifyRequestorInformation ? this.notifyRequestorInformation.notifyManagerData.searchNumber : '',
            });
            }
            if (this.myRequest.processName === 'Referral Task') {
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
            if (this.myRequest.processName === 'Query') {
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
                        requestType: this.myRequest.processName,
                    });
            }
            }
        });
    }

    getRequestorInformation() {
        if (this.myRequest.processName === 'Information Request' || this.myRequest.processName === 'Single Request') {
            this.restService.getRequestorInformation(this.myRequest.workflowId).subscribe((res: any) => {
                this.requestorInformation = res.data;
                this.setRequestorInfoData();
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

    listItemsByListCode() {
        this.restService.listItemsByListCode(28).subscribe((res: any) => {
            this.listItems = res.data;
        });
    }

    getInformationRequestItem() {
        this.restService.getInformationRequestItem(this.myRequest.workflowId).subscribe(response => {
            this.ItemData = response.data.json;
            if (this.ItemData.length > 0) {
                // if (this.myRequest.processName === 'Single Request') {
                //     this.requestorInformation = this.ItemData[0].requesterDetails;
                //     this.setRequestorInfoData();
                // }
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
        });
    }

    selectImage(event) {
        this.selectedImageSource = event.srcElement.src;
        this.selectedImageID = event.srcElement.id;
    }

    cancelRequest(): void {
        const dialogRef = this.dialog.open(CancelDialogComponent, {
            width: '750px',
            data: {value: this.myRequest}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }

    filterUsers(value: string) {
        const filterValue = value.toLowerCase();
        return this.users.filter(user => (user.firstName + ' ' + user.surname).toLowerCase().includes(filterValue));
    }

    assignedUserSelected(event) {
        this.assignUser = event.option.value;
        this.tooltipText = this.assignUser.firstName !== undefined ?
            'UserName: ' + this.assignUser.firstName + ' ' + this.assignUser.surname + '\n'
            + 'User Type: ' + (this.assignUser.userTypeItemId) : '';

    }

    displayFn(user) {
        return user ? (user.firstName + ' ' + user.surname) : '';
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

    changeTab(id: number) {
        this.menuItems = this.menuItems.map((item) => {
            item.isActive = false;
            if (item.id === id) {
                item.isActive = true;
                this.activeTabId = id;
            }
            return item;
        });
    }

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    uploadProofOfPayment() {
        this.loaderService.display(true);
        if (!this.proofOfPayment.valid) {
            this.proofOfPayment.get('file').markAsTouched();
            this.proofOfPayment.get('comments').markAsTouched();
            this.proofOfPayment.get('paymentReferenceNo').markAsTouched();
            this.proofOfPayment.get('paidAmount').markAsTouched();
            this.proofOfPayment.get('paymentDate').markAsTouched();
            this.loaderService.display(false);
            return;
        }
        const obj = this.proofOfPayment.value;
        const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload[0]);
        formData.append('documentTypeId', obj.documentTypeId);
        formData.append('comments', obj.comments);
        formData.append('paymentId', this.paymentInfo.paymentId);
        formData.append('paymentReferenceNo', obj.paymentReferenceNo);
        formData.append('invoiceAmount', this.paymentInfo.invoiceAmount);
        formData.append('paymentDate', obj.paymentDate);
        formData.append('userId', uid);
        formData.append('paidAmount', obj.paidAmount);
        formData.append('workflowId', this.myRequest.workflowId);
        formData.append('invoiceDueDate', this.paymentInfo.invoiceDueDate);
        this.restService.uploadProofOfPayment(formData).subscribe(payload => {
            this.proofOfPayment.reset();
            this.uploadedFileName = '';
            this.decisionform.patchValue({
                notes: obj.comments
            });
            this.restService.processtask(this.decisionform.value).subscribe((res: any) => {
                this.decisionDialog(res);
                this.loaderService.display(false);
                this.snackbar.openSnackBar('Proof of payment added successfully', 'Success');
            }, error => {
                this.loaderService.display(false);
            });
        }, error => {
            this.snackbar.openSnackBar('Proof of payment failed', 'Error');
        });
    }

    downloadInvoice() {
        this.restService.generateInvoicePdf(this.myRequest.workflowId).subscribe((res: any) => {
            this.downloadBlob(res, 'invoice.pdf');
        }, error => {
        });
    }

    downloadBlob(blob, name) {
        // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');

        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name;

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
    }

    getPaymentInfo() {
        this.restService.getPaymentInfo(this.myRequest.workflowId).subscribe(payload => {
            this.paymentInfo = payload.data;

            if (this.myRequest.actionRequired === 217) {
                this.menuItems.push({
                    id: 3,
                    name: 'paymentTab',
                    isActive: false,
                    activeIconUrl: 'assets/images/bootstrap-icons/a-doc.svg',
                    inActiveIconUrl: 'assets/images/bootstrap-icons/ia-doc.svg',
                    title: 'Proof of payment upload',
                    description: ''
                });
            }
        });
    }

    setStep(step) {
    }

    close() {
        this.router.navigate(['/home']);
    }

    getDocument(id, i) {
        this.restService.getDcoumentForRecord(id).subscribe(payload => {
            this.ItemData[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
            this.ItemData[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
            // this.imageArray = payload.body.data;
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
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
        }, error => {
        });
    }

    downloadImage(event, index) {
        const imageUrl = this.imageArray[index].url;
        const image: any[] = [];
        image.push(imageUrl);
        const fileName = imageUrl.split('/').pop();
        const obj = {
            'dataKeyName': 'sgdata',
            'documentName': fileName,
            'documentUrl': image,
            'provinceId': this.myRequest.provinceId,
            'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
        };
        this.restService.downloadSgDataImage(obj).subscribe(payload => {
            this.downloadBlob(payload, fileName);
        }, error => {
        });
    }

    decisionDialog(data): void {
        const dialogRef = this.dialog.open(ConfirmDecisionComponent, {
            width: '546px',
            data: {value: data}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.router.navigate(['/home']);
        });
    }
}

export interface Menu {
    id: number;
    name: string;
    activeIconUrl: string;
    inActiveIconUrl: string;
    isActive: boolean;
    title: string;
    description: string;
}
