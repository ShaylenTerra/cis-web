import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
    selector: 'app-reservation-preview-dialog',
    templateUrl: './reservation-preview-dialog.component.html',
    styleUrls: ['./reservation-preview-dialog.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class ReservationPreviewDialogComponent implements OnInit, AfterViewInit, OnDestroy {
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
    tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
    resData: any;
    resubmitData: any;
    resDraftData: any;
    layoutDoc: any[] = [];
    consentDoc: any[] = [];
    additionalDoc: any[] = [];
    minDate = new Date();
    surveyDate;
    purpose;

    selectedModes;
    cartData;
    selectedMode;

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
    public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public townshipFilterCtrl: FormControl = new FormControl();
    protected _onDestroyTownship = new Subject<void>();

    private sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }
    constructor(public dialogRef: MatDialogRef<ReservationPreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
        private restService: RestcallService, private snackbar: SnackbarService,
        private loaderService: LoaderService, private formBuilder: FormBuilder,
        private router: Router, private dialog: MatDialog) {
        this.resData = data.draftData;
        this.resubmitData = data.resubmitData;

        this.draftId = this.resData?.draftId;
        this.provinceId = this.resData?.provinceId;
        this.getDatabyDraftId();
        this.getAnnexurebyDraftId();
        this.basicInfoPLSForm = this.formBuilder.group({
            'ppnNo': [''],
            'initials': [''],
            'firstName': [''],
            'surname': [''],
            'cellPhoneNo': [''],
            'telephoneNumber': [''],
            'faxNo': [''],
            'email': [''],
            'provinceId': [''],
            'statusItemId': [''],
            'courierService': [''],
            'businessName': [''],
            'description': [''],
            'generalNotes': ['']
        });
        this.searchForm = this.fb.group({
            searchBar: ''
        });
        this.form = this.fb.group({
            name: [''],
            emailDelivery: [''],
            phone: [''],
            add1: [''],
            add2: [''],
            add3: [''],
            postalCode: [''],
            assignedTownship: ['']
        });
        this.formApplicant = this.fb.group({
            isApplicant: [''],
            applicantId: ['']
        });
        this.formApplication = this.fb.group({
            name: [''],
            purpose: [''],
            surveyDate: [''],
            isPrimaryEmail: [''],
            deliveryMethod: [''],
            deliveryMethodItemId: ['']
        });

        this.townshipForm = this.fb.group({
            newTownshipName: ''
        });
    }

    getDatabyDraftId() {
        this.restService.getReservationDraftById(this.resData?.draftId).subscribe(payload => {
            this.resDraftData = payload.data;


            if (this.resDraftData !== null && this.resDraftData !== undefined) {
                for (let i = 0; i < this.resDraftData.reservationDraftSteps.length; i++) {
                    if (this.resDraftData.reservationDraftSteps[i].reasonItemId === ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
                        this.townshipForm.patchValue({
                            newTownshipName: this.resDraftData.reservationDraftSteps[i].otherData.toLocationName
                        })
                    }
                }
            }
            this.surveyDate = this.resDraftData.surveyDate;
            this.purpose = this.resDraftData.purpose;
            this.surveyname = this.resDraftData.name;
            this.isPrimary = this.resDraftData.isPrimaryEmail;

            this.err1 = payload.data.applicantUserId === null ? true : false;
            this.err2 = payload.data.deliveryMethodItemId === null ? true : false;
            this.err4 = payload.data.reservationDraftSteps.length === 0 ? true : false;
            this.err3 = payload.data.reservationDraftSteps.filter(x => x.reservationDraftRequestOutcome.length === 0).length > 0
                ? true : false;
            if (this.err1 || this.err2 || this.err3 ||
                this.err4) {
                this.disableProcess = true;
            } else {
                // let outcome = payload.data.reservationDraftSteps.filter(x=>x.reservationDraftRequestOutcome.length === 0).length
                // if (outcome > 0) {
                //     this.disableProcess = true;
                //     this.err3 = true;
                // } else {
                this.disableProcess = false;
                this.err1 = false;
                this.err2 = false;
                this.err3 = false;
                this.err4 = false;
                // }
            }
            this.formApplication.patchValue({
                name: this.resDraftData.name,
                purpose: this.resDraftData.purpose,
                surveyDate: this.resDraftData.surveyDate,
                isPrimaryEmail: this.resDraftData.isPrimaryEmail,
                deliveryMethodItemId: Number(this.resDraftData.deliveryMethodItemId)
            });
            // this.quill.setDisabledState(true);
            this.disableEmail = this.formApplication.value.isPrimaryEmail === 1 || this.formApplication.value.isPrimaryEmail === undefined
                || this.formApplication.value.isPrimaryEmail === null ? true : false;
            if (this.resDraftData.applicant === 0) {
                this.isApplicant = false;
                this.restService.getUserByUserID(this.resDraftData.applicantUserId).subscribe(res => {
                    const arr = [];
                    arr.push(res.data);

                    this.emaildata = arr;
                    this.filteredEmail.next(this.emaildata.slice());
                    this.emailFilterCtrl.valueChanges
                        .pipe(takeUntil(this._onDestroyEmail))
                        .subscribe(() => {
                            this.filterByEmail();
                        });
                    this.findByEmail = res.data;
                    this.emailSelect.value = this.findByEmail.email;
                    this.electronicEmail = this.resDraftData.email === 0 ? this.findByEmail.email : this.resDraftData.email;
                    this.name = res.data.title + ' ' + res.data.firstName + ' ' + res.data.surname;
                    this.emailDelivery = res.data.email;
                    this.phone = res.data.mobileNo;
                    this.add1 = res.data.userProfile.postalAddressLine1;
                    this.add2 = res.data.userProfile.postalAddressLine2;
                    this.add3 = res.data.userProfile.postalAddressLine3;
                    this.postalCode = res.data.userProfile.postalCode;
                    this.setEmailData();
                });
            } else if (this.resDraftData.applicant === 1) {
                const arr = [];
                arr.push(JSON.parse(sessionStorage.userInfo));
                this.emaildata = arr;
                this.filteredEmail.next(this.emaildata.slice());
                this.emailFilterCtrl.valueChanges
                    .pipe(takeUntil(this._onDestroyEmail))
                    .subscribe(() => {
                        this.filterByEmail();
                    });
                this.isApplicant = true;
                this.findByEmail = JSON.parse(sessionStorage.userInfo);
                this.electronicEmail = (this.resDraftData.email === 1 || this.resDraftData.email === null) ? this.findByEmail.email : this.resDraftData.email;
                this.name = this.findByEmail.title + ' ' + this.findByEmail.firstName + ' ' + this.findByEmail.surname;
                this.emailDelivery = this.findByEmail.email;
                this.phone = this.findByEmail.mobileNo;
                this.add1 = this.findByEmail.userProfile.postalAddressLine1;
                this.add2 = this.findByEmail.userProfile.postalAddressLine2;
                this.add3 = this.findByEmail.userProfile.postalAddressLine3;
                this.postalCode = this.findByEmail.userProfile.postalCode;
                this.setEmailData();
            }
            this.bindDeliveryData();
            this.loaderService.display(false);

        }, error => {
            this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            this.loaderService.display(false);
        });
    }

    getAnnexurebyDraftId() {
        this.restService.getAnnexurebyDraftId(this.resData?.draftId).subscribe(payload => {
            this.annexure = payload.data;
            if (this.annexure !== null) {
                this.layoutDoc = this.annexure.filter(x => x.typeId === 746);
                this.consentDoc = this.annexure.filter(x => x.typeId === 747);
                this.additionalDoc = this.annexure.filter(x => x.typeId === 748);
            }
            this.loaderService.display(false);

        }, error => {
            this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            this.loaderService.display(false);
        });
    }

    bindDeliveryData() {
        forkJoin([
            this.restService.getListItems(16)
        ]).subscribe(([method]) => {
            this.selectedModes = method.data;
            this.selectedMode = this.resDraftData.deliveryMethodItemId === null ?
                method.data.filter(x => x.caption === 'ELECTRONIC')[0].caption : '';
            const selectedm = this.resDraftData.deliveryMethodItemId === null ?
                method.data.filter(x => x.caption === 'ELECTRONIC')[0].itemId :
                Number(this.resDraftData.deliveryMethodItemId);
            this.formApplication.patchValue({
                deliveryMethodItemId: selectedm
            });
        });
    }
    ngOnInit() {
        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        this.userId = userInfoJson.userId;
        this.getAddressBasedOnProvinceId();
        this.basicInfoPLSForm.disable();
        this.getAllTownship();
        this.resubmitData = this.data.resubmitData;
    }

    getAddressBasedOnProvinceId() {
        this.restService.getAddressBasedOnProvinceId(this.provinceId).subscribe(payload => {
            this.collectionAddress = payload.data.provinceAddress;
        });
    }

    changeApplicant(e) {
        if (e !== '' && e.length > 3) {
            this.loadEmailData(e);
        }
        if (e?.value === true) {
            this.formApplicant.patchValue({
                applicantId: JSON.parse(sessionStorage.userInfo)
            });
            this.findByEmail = JSON.parse(sessionStorage.userInfo);
            this.setEmailData();
        }
        if (e?.value === false) {
            this.findByEmail = undefined;
            this.firstName = '';
            this.lastName = '';
            this.email = '';
            this.mobileNo = '';
            this.dataSourceUserRole = undefined;
        }
        if (this.formApplicant.get('isApplicant').invalid) {
            this.errorMsg = 'Please select applicant for reservation';
            return;
        } else {
            this.errorMsg = '';
        }
        // this.isApplicant = e.source._value !== 'No';
    }

    ngAfterViewInit() {
        this.setInitialEmailValue();
    }

    ngOnDestroy() {
        this._onDestroyEmail.next();
        this._onDestroyEmail.complete();
    }

    protected setInitialEmailValue() {
        this.filteredEmail
            .pipe(take(1), takeUntil(this._onDestroyEmail))
            .subscribe(() => {
                if (this.emailSelect !== undefined) {
                    this.emailSelect.compareWith = (a: any, b: any) => a && b && a.email === b.email;
                }
            });
    }

    protected filterByEmail() {
        if (!this.emaildata) {
            return;
        }
        let search = this.emailFilterCtrl.value;
        if (!search) {
            this.filteredEmail.next(this.emaildata.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredEmail.next(
            this.emaildata.filter(bank => bank.email.toLowerCase().indexOf(search) > -1)
        );
    }

    loadEmailData(val) {
        forkJoin([
            this.restService.searchUserByKey(val),
        ]).subscribe(([searchbyKey]) => {
            this.emaildata = searchbyKey.data;
            this.filteredEmail.next(this.emaildata.slice());
            this.emailFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroyEmail))
                .subscribe(() => {
                    this.filterByEmail();
                });
        });
    }

    setEmailData() {
        this.firstName = this.findByEmail.firstName;
        this.lastName = this.findByEmail.surname;
        this.email = this.findByEmail.email;
        this.mobileNo = this.findByEmail.mobileNo;

        this.loadInitials();
    }

    loadInitials() {
        this.loaderService.display(true);
        forkJoin([
            this.restService.getUserMetaData(this.findByEmail.userId),
            this.restService.getUserRole(this.findByEmail.userId),
            this.restService.getProvinces(),
            this.restService.getRoles(this.findByEmail.userType),
            this.restService.getProfessionalByPPNNumber(this.findByEmail.userProfile.ppnNo),
            this.restService.getListItems(20)
        ]).subscribe(([userMetaData, userRoles, provinces, roles, professional, statuses]) => {
            this.userMetaData = userMetaData.data;
            this.roles = roles.data;
            this.provinces = provinces.data;
            this.province = this.findByEmail.provinceId;
            this.rolesInfo = userRoles.data;
            this.ppnNo = this.userMetaData.ppnNo;
            this.statuses = statuses.data;
            this.status = this.statuses.filter(x => x.itemId === professional.data?.statusItemId).length > 0 ?
                statuses.data.filter(x => x.itemId === professional.data?.statusItemId)[0].caption : ''

            if (this.findByEmail.userType === 'INTERNAL') {
                this.dataSourceUserRole = new MatTableDataSource(this.rolesInfo);
            }
            if (this.findByEmail.userType === 'EXTERNAL') {
                this.roleId = this.rolesInfo[0].roleId;
                for (let p = 0; p < this.provinces.length; p++) {
                    this.provinces[p].isSelected =
                        this.rolesInfo.filter(x => x.provinceId === this.provinces[p].provinceId).length > 0 ? true : false;
                }
                this.provinces = this.provinces.filter(x => x.isSelected === true);
                this.basicInfoPLSForm.patchValue({
                    courierService: professional.data.courierService,
                    businessName: professional.data.businessName,
                    description: professional.data.description,
                    generalNotes: professional.data.generalNotes,
                    statusItemId: professional.data.statusItemId,
                });
            }
            if (this.userMetaData !== null) {

            }
            //   this.titles = titles.data;
            if (this.findByEmail.userType === 'INTERNAL' || this.findByEmail.userType === 'EXTERNAL') {
                this.setProfileImages();
            }

            this.loaderService.display(false);
        },
            error => {
                this.loaderService.display(false);
                this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            });
    }

    setProfileImages() {
        this.restService.getDisplayProfileImage(this.findByEmail.userId).subscribe(response => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = (_event) => {
                this.url = reader.result;
            };
        });
    }

    downloaddoc(doc) {
        this.loaderService.display(true);
        const docId = doc.documentId;
        this.restService.downloadWorkAnnexureFile(docId).subscribe((res) => {
            this.downloadBlob(res, doc.documentName);
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
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

    navigateToLandProfile(lpi, recordId) {
        this.router.navigate(['/land-profile'], { state: { lpi: lpi, recordId: recordId } });
    }

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
                processid: 229,
                provinceid: this.resDraftData.provinceId,
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
                this.restService.checkoutDraft(this.resDraftData.draftId, response.WorkflowID).subscribe(res => {
                    this.loaderService.display(false);
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
                this.router.navigate(['/reservation/reservation-list']);
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


    getAllTownship() {
        this.loaderService.display(true);
        // this.assignTownship = '';
        this.form.get('assignedTownship').reset();
        this.restService.getReservationTownshipAllotment(this.provinceId).subscribe(response => {
            this.townshipdata = response.data;
            this.filteredTownship.next(this.townshipdata.slice());
            this.townshipFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroyTownship))
                .subscribe(() => {
                    this.filterTownships();
                });
            // this.setInitialTownshipValue();
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    protected filterTownships() {
        if (!this.townshipdata) {
            return;
        }
        let search = this.townshipFilterCtrl.value;
        if (!search) {
            this.filteredTownship.next(this.townshipdata.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredTownship.next(
            this.townshipdata.filter(bank => bank.majorRegionOrAdminDistrict.toLowerCase().indexOf(search) > -1)
        );
    }

    setDataSourceAttributes() {
        if (this.sort !== undefined) {
            this.dataSourceUserRole.sort = this.sort;
        }
    }

    close() {
        this.dialogRef.close();
    }
}
