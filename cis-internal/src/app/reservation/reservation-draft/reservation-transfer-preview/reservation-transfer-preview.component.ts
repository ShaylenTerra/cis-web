import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { QuillEditorComponent } from 'ngx-quill';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ReservationAction } from '../../../constants/enums';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../format-datepicket';
import { ConfirmDailogComponent } from '../../../search/delivery-page/confirm-dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmDecisionComponent } from '../../../tasks/task-details/confirm-decision/confirm-decision.component';


@Component({
  selector: 'app-reservation-transfer-preview',
  templateUrl: './reservation-transfer-preview.component.html',
  styleUrls: ['./reservation-transfer-preview.component.css']
})
export class ReservationTransferPreviewComponent implements OnInit {
  statuses: any[] = [];
  status = "";
  statusesTransferee: any[] = [];
  statusTransferee = "";
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
  dataSourceUserRoleTransferee: any;
  userId: number;
  firstName = '';
  lastName = '';
  email = '';
  mobileNo = '';
  firstNameTransferee = '';
  lastNameTransferee = '';
  emailTransferee = '';
  mobileNoTransferee = '';
  ppnNo = '';
  ppnNoTransferee = '';
  url: any = '';
  urlTransferee: any = '';
  userDetail: any;
  rating = 5;
  basicInfoPLSForm: FormGroup;
  basicInfoPLSFormTransferee: FormGroup;
  public ReservationChartData: any;
  public ReservationChartOption: any;
  @ViewChild('Reservation', { static: false }) ReservationChart: ElementRef; // used barStackedChart, barHorizontalChart
  public ReservationChartTag: CanvasRenderingContext2D;
  isApplicant: any;
  @ViewChild('emailSelect') emailSelect: MatSelect;
  @ViewChild('emailSelectTransferee') emailSelectTransferee: MatSelect;
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public filteredEmail: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredEmailTransferee: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyEmail = new Subject<void>();
  protected _onDestroyEmailTransferee = new Subject<void>();
  public emailFilterCtrl: FormControl = new FormControl();
  public emailFilterCtrlTransferee: FormControl = new FormControl();
  emaildata: any[];
  emaildataTransferee: any[];
  findByEmail;
  findByEmailTransferee;
  searchForm: FormGroup;
  searchResult = [];
  userMetaData: any;
  rolesInfo;
  provinces: any;
  province: any;
  roleId: any;
  roles: any;
  userMetaDataTransferee: any;
  rolesInfoTransferee;
  provincesTransferee: any;
  provinceTransferee: any;
  roleIdTransferee: any;
  rolesTransferee: any;
  tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
  tableColumnsTransferee: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
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
  formTransferee: FormGroup;
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
  reservationData: any[] = [];

  displayedColumnsTransfer: any[] = ['designation', 'lpi', 'status', 'reason', 'issueDate', 'expiryDate', 'expiryInDays', 'referenceNumber', 'name', 'provinceName'];
  dataLengthTransfer: number;
  dataSourceTransfer: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  myReservationTransfer: any[] = [];
  filteredTasks: any[] = [];
  constructor(public dialogRef: MatDialogRef<ReservationTransferPreviewComponent>,
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
    this.basicInfoPLSFormTransferee = this.formBuilder.group({
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
      isApplicant: [''],
      applicantId: ['']
    });
    this.formTransferee = this.fb.group({
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
  }

  getDatabyDraftId() {
    forkJoin([
      this.restService.getReservationDraftById(this.resData?.draftId),
      this.restService.getAllDraftTransfer(this.draftId),
      this.restService.getReservationTransfers(),
    ]).subscribe(([reservationDraft, tDrafts, reservationTransfers]) => {


      this.resDraftData = reservationDraft.data;
      let outcomeIds = [];
      for (let j = 0; j < tDrafts.data.length; j++) {
        outcomeIds.push(tDrafts.data[j].outcomeId);
      }

      this.reservationData = reservationTransfers.data.filter(x => !outcomeIds.includes(x.outcomeId));
      this.myReservationTransfer = reservationTransfers.data.filter(x => outcomeIds.includes(x.outcomeId));

      for (let i = 0; i < this.reservationData.length; i++) {
        this.reservationData[i].owner = this.reservationData[i].firstName + ' ' + this.reservationData[i].surName;
      }
      for (let i = 0; i < this.myReservationTransfer.length; i++) {
        this.myReservationTransfer[i].owner = this.myReservationTransfer[i].firstName + ' ' + this.myReservationTransfer[i].surName;
      }
      this.filteredTasks = reservationTransfers.data.filter(x => !outcomeIds.includes(x.outcomeId));
      for (let i = 0; i < this.filteredTasks.length; i++) {
        this.filteredTasks[i].owner = this.filteredTasks[i].firstName + ' ' + this.filteredTasks[i].surName
      }
      this.refreshTable2();

      this.surveyDate = this.resDraftData.surveyDate;
      this.purpose = this.resDraftData.purpose;
      this.surveyname = this.resDraftData.name;
      this.isPrimary = this.resDraftData.isPrimaryEmail;
      this.bindData()
      this.err1 = reservationDraft.data.applicantUserId === null ? true : false;
      this.err2 = reservationDraft.data.deliveryMethodItemId === null ? true : false;
      this.err4 = reservationDraft.data.toUserId === null ? true : false;
      this.err3 = tDrafts.data.length > 0 ? false : true;
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

  bindData() {

    if (this.resDraftData?.toUserId !== null) {

      this.isApplicant = false;
      this.restService.getUserByUserID(this.resDraftData.toUserId).subscribe(res => {
        const arr = [];
        arr.push(res.data);


        this.emaildataTransferee = arr;
        this.filteredEmailTransferee.next(this.emaildataTransferee.slice());
        this.emailFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroyEmail))
          .subscribe(() => {
            this.filterByEmailTransferee();
          });
        this.findByEmailTransferee = res.data;
        this.emailSelectTransferee.value = this.findByEmailTransferee.email;
        this.electronicEmail = this.resDraftData.email === 0 ? this.findByEmailTransferee.email : this.resDraftData.email;
        this.name = res.data.title + ' ' + res.data.firstName + ' ' + res.data.surname;
        this.emailDelivery = res.data.email;
        this.phone = res.data.mobileNo;
        this.add1 = res.data.userProfile.postalAddressLine1;
        this.add2 = res.data.userProfile.postalAddressLine2;
        this.add3 = res.data.userProfile.postalAddressLine3;
        this.postalCode = res.data.userProfile.postalCode;
        this.setEmailDataTransferee();
      });
    }
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
    this.basicInfoPLSFormTransferee.disable()
  }

  getAddressBasedOnProvinceId() {
    this.restService.getAddressBasedOnProvinceId(this.provinceId).subscribe(payload => {
      this.collectionAddress = payload.data.provinceAddress;
    });
  }

  changeApplicantTransferee(e) {
    if (e !== '' && e.length > 3) {
      this.loadEmailDataTransferee(e);
    }
    if (e?.value === true) {
      this.formTransferee.patchValue({
        applicantId: JSON.parse(sessionStorage.userInfo)
      });
      this.findByEmailTransferee = JSON.parse(sessionStorage.userInfo);
      this.setEmailDataTransferee();
    }
    if (e?.value === false) {
      this.findByEmailTransferee = undefined;
      this.firstNameTransferee = '';
      this.lastNameTransferee = '';
      this.emailTransferee = '';
      this.mobileNoTransferee = '';
      this.dataSourceUserRoleTransferee = undefined;
    }
    // this.isApplicant = e.source._value !== 'No';
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



  refreshTable2() {
    this.dataSourceTransfer = new MatTableDataSource(this.myReservationTransfer);
    this.dataSourceTransfer.paginator = this.paginator;
    this.dataSourceTransfer.sort = this.sort.toArray()[1];
    setTimeout(() => this.dataSourceTransfer.sort = this.sort.toArray()[1]);

  }


  ngAfterViewInit() {
    this.setInitialEmailValue();
    this.setInitialEmailValueTransferee();
    if (this.dataSourceTransfer !== undefined) {
      this.dataSourceTransfer.paginator = this.paginator;
      this.dataSourceTransfer.sort = this.sort.toArray()[1];
      setTimeout(() => this.dataSourceTransfer.sort = this.sort.toArray()[1]);
    }
  }

  ngOnDestroy() {
    this._onDestroyEmail.next();
    this._onDestroyEmail.complete();
    this._onDestroyEmailTransferee.next();
    this._onDestroyEmailTransferee.complete();
  }

  protected setInitialEmailValueTransferee() {
    this.filteredEmailTransferee
      .pipe(take(1), takeUntil(this._onDestroyEmailTransferee))
      .subscribe(() => {
        if (this.emailSelectTransferee !== undefined) {
          this.emailSelectTransferee.compareWith = (a: any, b: any) => a && b && a.email === b.email;
        }
      });
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

  protected filterByEmailTransferee() {
    if (!this.emaildataTransferee) {
      return;
    }
    let search = this.emailFilterCtrlTransferee.value;
    if (!search) {
      this.filteredEmailTransferee.next(this.emaildataTransferee.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredEmailTransferee.next(
      this.emaildataTransferee.filter(bank => bank.email.toLowerCase().indexOf(search) > -1)
    );
  }

  loadEmailDataTransferee(val) {
    forkJoin([
      this.restService.searchUserByKey(val),
    ]).subscribe(([searchbyKey]) => {
      this.emaildataTransferee = searchbyKey.data;
      this.filteredEmailTransferee.next(this.emaildataTransferee.slice());
      this.emailFilterCtrlTransferee.valueChanges
        .pipe(takeUntil(this._onDestroyEmailTransferee))
        .subscribe(() => {
          this.filterByEmailTransferee();
        });
    });
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

  setEmailDataTransferee() {
    this.firstNameTransferee = this.findByEmailTransferee.firstName;
    this.lastNameTransferee = this.findByEmailTransferee.surname;
    this.emailTransferee = this.findByEmailTransferee.email;
    this.mobileNoTransferee = this.findByEmailTransferee.mobileNo;

    this.loadInitialsTransferee();
  }



  loadInitialsTransferee() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.getUserMetaData(this.findByEmailTransferee.userId),
      this.restService.getUserRole(this.findByEmailTransferee.userId),
      this.restService.getProvinces(),
      this.restService.getRoles(this.findByEmailTransferee.userType),
      this.restService.getProfessionalByPPNNumber(this.findByEmailTransferee.userProfile.ppnNo),
      this.restService.getListItems(20)
    ]).subscribe(([userMetaData, userRoles, provinces, roles, professional, statuses]) => {

      this.userMetaDataTransferee = userMetaData.data;
      this.rolesTransferee = roles.data;
      this.provincesTransferee = provinces.data;

      this.provinceTransferee = this.findByEmailTransferee.provinceId;
      this.rolesInfoTransferee = userRoles.data;
      this.ppnNoTransferee = this.userMetaDataTransferee.ppnNo;
      this.statusesTransferee = statuses.data;
      this.statusTransferee = this.statusesTransferee.filter(x => x.itemId === professional.data?.statusItemId).length > 0 ?
        statuses.data.filter(x => x.itemId === professional.data?.statusItemId)[0].caption : ''

      if (this.findByEmailTransferee.userType === 'INTERNAL') {
        this.dataSourceUserRoleTransferee = new MatTableDataSource(this.rolesInfoTransferee);
        this.dataSourceUserRoleTransferee.sort = this.sort.toArray()[2];
        setTimeout(() => this.dataSourceUserRoleTransferee.sort = this.sort.toArray()[2]);

      }
      if (this.findByEmailTransferee.userType === 'EXTERNAL') {
        this.roleIdTransferee = this.rolesInfoTransferee[0].roleId;

        for (let p = 0; p < this.provincesTransferee.length; p++) {
          this.provincesTransferee[p].isSelected =
            this.rolesInfoTransferee.filter(x => x.provinceId === this.provincesTransferee[p].provinceId).length > 0 ? true : false;
        }
        this.provincesTransferee = this.provincesTransferee.filter(x => x.isSelected === true);
        this.basicInfoPLSFormTransferee.patchValue({
          courierService: professional.data.courierService,
          businessName: professional.data.businessName,
          description: professional.data.description,
          generalNotes: professional.data.generalNotes,
          statusItemId: professional.data.statusItemId,
        });
      }
      if (this.userMetaDataTransferee !== null) {

      }
      //   this.titles = titles.data;
      if (this.findByEmailTransferee.userType === 'INTERNAL' || this.findByEmailTransferee.userType === 'EXTERNAL') {
        this.setProfileImagesTransferee();
      }

      this.loaderService.display(false);
    },
      error => {
        this.loaderService.display(false);
        this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
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
        this.dataSourceUserRole.sort = this.sort.toArray()[0];
        setTimeout(() => this.dataSourceUserRole.sort = this.sort.toArray()[0]);
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

  setProfileImagesTransferee() {

    this.restService.getDisplayProfileImage(this.findByEmailTransferee.userId).subscribe(response => {
      const readerTransferee = new FileReader();
      readerTransferee.readAsDataURL(response);
      readerTransferee.onload = (_event) => {
        this.urlTransferee = readerTransferee.result;
      };
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
        processid: 239,
        provinceid: this.resDraftData.provinceId,
        loggeduserid: this.userId,
        notes: '',
        context: 'context',
        type: 1,
        processdata: JSON.stringify(this.requestorData), // queryData: data}),
        parentworkflowid: 0,
        assignedtouserid: this.resDraftData.toUserId
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
        'description': this.form.value.notes,
        'firstName': JSON.parse(sessionStorage.getItem('userInfo')).firstName,
        'surName': JSON.parse(sessionStorage.getItem('userInfo')).surname,
        'email': JSON.parse(sessionStorage.getItem('userInfo')).email
      }
    };
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
