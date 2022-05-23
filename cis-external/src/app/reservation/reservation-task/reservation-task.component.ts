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
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { ActionReservationComponent } from '../action-reservation/action-reservation.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';

@Component({
    selector: 'app-reservation-task',
    templateUrl: './reservation-task.component.html',
    styleUrls: ['./reservation-task.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class ReservationTaskComponent implements OnInit, AfterViewInit, OnDestroy {
    dataSourceUserRole: any;
    resubmitData;
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
    searchResult = [];
    userMetaData: any;
    rolesInfo;
    provinces: any;
    province: any;
    roleId: any;
    roles: any;
    tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
    resData: any;
    resDraftData: any;
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

    formApplicant: FormGroup;
    errorMsg = '';
    formApplication: FormGroup;
    electronicEmail;
    disableEmail = false;
    workflowId;
    readonly = true;
    showDelete = true;
    showCancel = true;
    showModify = true;
    topHeaderMenu = true;
    supportingDoc = true;
    processId: any;
    headerText = "Draft";
    workflowTasksData: any[] = [];
    WorkflowTasksLength;
    showTaskDuration = false;
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
            this.router.navigate(['/reservation/reservation-list']);
        }
        this.resData = this.router.getCurrentNavigation().extras.state.resData;

        this.processId = this.resData?.processId
        // this.draftId = this.resData?.draftId;
        /// Action RequiredID for Edit Mode
        /// Resubmit-Modify: if Action RequiredID Resubmit-Modify - 251
        this.resubmitData = this.resData
        this.resData.actionRequired === 251 ? this.readonly = false : this.readonly = true;
        this.workflowId = this.resData?.workflowId;
        this.provinceId = this.resData?.provinceId;
        if (this.processId !== undefined && this.processId === 239) {
            this.headerText = "Transfer"
        }
        this.getDatabyDraftId();
        this.enableMenu();
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
            postalCode: ['']
        });
        this.formApplicant = this.fb.group({
            isApplicant: ['', Validators.required],
            applicantId: ['', Validators.required]
        });
        this.formApplication = this.fb.group({
            name: ['', Validators.required],
            purpose: ['', Validators.required],
            surveyDate: [''],
            isPrimaryEmail: [''],
            deliveryMethod: [''],
            deliveryMethodItemId: ['']
        });
    }

    getDatabyDraftId() {
        this.restService.getReservationDraftByWorkFlowId(this.workflowId).subscribe(payload => {
            this.resDraftData = payload.data;
            this.draftId = this.resDraftData?.draftId;
            this.surveyDate = this.resDraftData.surveyDate;
            this.purpose = this.resDraftData.purpose;
            this.surveyname = this.resDraftData.name;
            this.isPrimary = this.resDraftData.isPrimaryEmail;
            this.formApplication.patchValue({
                name: this.resDraftData.name,
                purpose: this.resDraftData.purpose,
                surveyDate: this.resDraftData.surveyDate,
                isPrimaryEmail: this.resDraftData.isPrimaryEmail,
                deliveryMethodItemId: Number(this.resDraftData.deliveryMethodItemId)
            });
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
                    // this.emailSelect.value = this.findByEmail.email;
                    this.electronicEmail = this.resDraftData.email === null ? this.findByEmail.email : this.resDraftData.email;
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
                this.electronicEmail = this.resDraftData.email === null ? this.findByEmail.email : this.resDraftData.email;
                this.setEmailData();
            }
            this.bindDeliveryData();
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
                method.data.filter(x => x.caption === 'ELECTRONIC')[0].itemId :
                Number(this.resDraftData.deliveryMethodItemId);
            this.formApplication.patchValue({
                deliveryMethodItemId: this.selectedMode
            });
        });
    }

    ngOnInit() {
        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        this.userId = userInfoJson.userId;
        this.getWorkflowTasks();
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
            this.restService.getRoles(this.findByEmail.userType)
        ]).subscribe(([userMetaData, userRoles, provinces, roles]) => {
            this.userMetaData = userMetaData.data;
            this.roles = roles.data;
            this.provinces = provinces.data;
            this.province = this.findByEmail.provinceId;
            this.rolesInfo = userRoles.data;
            this.ppnNo = this.userMetaData.ppnNo;
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

    updateDraft(val) {
        const objData = this.resDraftData;
        if (val === 'Applicant') {
            if (this.formApplicant.invalid) {
                this.formApplicant.get('isApplicant').markAsTouched();
                this.formApplicant.get('applicantId').markAsTouched();
                if (this.formApplicant.get('isApplicant').invalid) {
                    this.errorMsg = 'Please select applicant for reservation';
                    return;
                } else {
                    this.errorMsg = '';
                }
                return;
            } else {
                this.errorMsg = '';
                objData.applicant = this.formApplicant.value.isApplicant === true ? 1 : 0;
                objData.applicantUserId = this.formApplicant.value.applicantId.userId;
            }
        }
        if (val === 'Application') {
            if (this.formApplication.invalid) {
                this.formApplication.get('name').markAsTouched();
                this.formApplication.get('purpose').markAsTouched();
                return;
            } else {
                objData.name = this.formApplication.value.name;
                objData.purpose = this.formApplication.value.purpose;
                objData.surveyDate = this.formApplication.value.surveyDate;
                objData.isPrimaryEmail = this.formApplication.value.isPrimaryEmail;
                objData.email = this.electronicEmail;
                objData.deliveryMethodItemId = this.formApplication.value.deliveryMethodItemId;
                objData.deliveryMethod = this.formApplication.value.deliveryMethodItemId !== null ?
                    this.selectedModes.filter(x => x.itemId === this.formApplication.value.deliveryMethodItemId)[0].caption
                    : null;

                for (let i = 0; i < objData.reservationDraftSteps.length; i++) {
                    if (objData.reservationDraftSteps[i] !== null) {
                        objData.reservationDraftSteps[i].otherData = JSON.stringify(objData.reservationDraftSteps[i].otherData);
                    }
                }
            }
        }
        this.loaderService.display(true);
        this.restService.updateDraft(objData).subscribe(() => {
            this.getDatabyDraftId();
            this.snackbar.openSnackBar(val + 'details updated Successfully', 'Success');
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    setPrimaryEmail(val) {
        this.disableEmail = val.value === 1 ? true : false;
    }
    nvaigateToReservationList() {
        this.router.navigate(['/reservation/reservation-list']);
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
                const dialogRef = this.dialog.open(ActionReservationComponent, {
                    width: '50%',
                    data: {
                        value: 'modify', actionTakenId: actionTakenId, res: this.resData
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

            const dialogRef = this.dialog.open(ActionReservationComponent, {
                width: '50%',
                data: {
                    value: value, actionTakenId: actionTakenId, res: this.resData
                }
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                if (resultCode === 0) {
                }
            });
        }
    }

    receiveChildData(data) {
        this.resDraftData = data;
    }

    enableMenu() {

        switch (Number(this.resData.actionRequired)) {
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

    getWorkflowTasks() {
        this.loaderService.display(true);
        this.restService.getWorkflowTasks(this.workflowId).subscribe(payload => {
            const notesData = payload.data;
            this.WorkflowTasksLength = notesData.filter(x => x.actionReq === 'Resubmit-Modify').length
            this.loaderService.display(false);
        },
            error => {
                this.loaderService.display(false);
            });
    }
}
