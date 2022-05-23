import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FeedbackDialogComponent } from '../../reservation/applicant-reservation/feedback-dialog/feedback-dialog.component';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-applicant-lodgement',
  templateUrl: './applicant-lodgement.component.html',
  styleUrls: ['./applicant-lodgement.component.css']
})
export class ApplicantLodgementComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() draftData;
  @Input() readonly;
  @Input() processId;
  @Input() processName;
  @Input() preview;
  formApplicant: FormGroup;
  basicInfoPLSForm: FormGroup;
  errorMsg = '';
  @ViewChild('emailSelect') emailSelect: MatSelect;
  public filteredEmail: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyEmail = new Subject<void>();
  public emailFilterCtrl: FormControl = new FormControl();
  emaildata: any[];
  findByEmail;
  // searchForm: FormGroup;
  searchResult = [];
  userMetaData: any;
  rolesInfo: any[] = [];
  provinces: any;
  province: any;
  dataSourceUserRole: any = new MatTableDataSource<any>();
  firstName = '';
  lastName = '';
  email = '';
  mobileNo = '';
  ppnNo = '';
  url: any = '';
  roles: any;
  roleId: any;
  tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
  isApplicant: any;
  electronicEmail;
  @Output() outputFromChild: EventEmitter<any> = new EventEmitter();
  statuses: any[] = [];
  status = "";
  // @ViewChild(MatSort, { static: false }) matSort: MatSort;
  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  constructor(private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) {

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
    this.formApplicant = this.fb.group({
      isApplicant: ['', Validators.required],
      applicantId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.readonly ? this.formApplicant.disable() : this.formApplicant.enable();
    // this.bindData();
    this.basicInfoPLSForm.disable();
  }

  bindData() {
    if (this.draftData?.applicant === 0) {
      this.isApplicant = false;
      this.formApplicant.patchValue({
        isApplicant: this.isApplicant
      })
      this.restService.getUserByUserID(this.draftData.applicantUserId).subscribe(res => {
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
        this.electronicEmail = this.draftData.email === null ? this.findByEmail.email : this.draftData.email;
        this.setEmailData();
      });
      this.changeApplicant(this.isApplicant)
    } else if (this.draftData?.applicant === 1) {
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
      this.formApplicant.patchValue({
        isApplicant: this.isApplicant
      })
      this.findByEmail = JSON.parse(sessionStorage.userInfo);
      this.electronicEmail = this.draftData.email === null ? this.findByEmail.email : this.draftData.email;
      // this.setEmailData();
      this.changeApplicant(this.isApplicant)
    }
  }

  changeApplicant(e) {
    if (e !== '' && e.length > 3) {
      this.loadEmailData(e);
    }
    if (e === true) {
      this.formApplicant.patchValue({
        applicantId: JSON.parse(sessionStorage.userInfo)
      });
      this.findByEmail = JSON.parse(sessionStorage.userInfo);
      this.setEmailData();
    }
    if (e === false) {
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
      // this.restService.getProfessionalByPPNNumber(this.findByEmail.userProfile.ppnNo),
      this.restService.getListItems(20),
    ]).subscribe(([userMetaData, userRoles, provinces, roles, statuses]) => {
      this.userMetaData = userMetaData.data;
      this.roles = roles.data;
      this.provinces = provinces.data;
      this.province = this.findByEmail.provinceId;
      this.rolesInfo = userRoles.data;
      this.ppnNo = this.userMetaData.ppnNo;
      this.statuses = statuses.data;
      this.roleId = this.rolesInfo[0].roleId;

      if (this.findByEmail.userProfile.ppnNo !== null) {
        this.getProfessionalByPPNNumber();
      }
      if (this.findByEmail.userType === 'INTERNAL') {
        this.dataSourceUserRole = new MatTableDataSource(this.rolesInfo);
        // this.dataSourceUserRole.sort = this.matSort;
        // this.setDataSourceAttributes();
      }

      if (this.userMetaData !== null) {
      }
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

  getProfessionalByPPNNumber() {
    this.loaderService.display(true);
    this.restService.getProfessionalByPPNNumber(this.findByEmail.userProfile.ppnNo).subscribe(payload => {
      this.status = this.statuses.filter(x => x.itemId === payload.data?.statusItemId).length > 0 ?
        this.statuses.filter(x => x.itemId === payload.data?.statusItemId)[0].caption : ''
      if (this.findByEmail.userType === 'EXTERNAL') {
        for (let p = 0; p < this.provinces.length; p++) {
          this.provinces[p].isSelected =
            this.rolesInfo.filter(x => x.provinceId === this.provinces[p].provinceId).length > 0 ? true : false;
        }
        this.provinces = this.provinces.filter(x => x.isSelected === true);
        this.basicInfoPLSForm.patchValue({
          courierService: payload.data.courierService,
          businessName: payload.data.businessName,
          description: payload.data.description,
          generalNotes: payload.data.generalNotes,
          statusItemId: payload.data.statusItemId,
        });
      }
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
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
    const objData = this.draftData;
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
        for (let i = 0; i < objData.lodgementDraftSteps.length; i++) {
          if (objData.lodgementDraftSteps[i] !== null) {
            if (objData.lodgementDraftSteps[i].lodgementDraftRequests !== null) {
              for (let j = 0; j < objData.lodgementDraftSteps[i].lodgementDraftRequests.length; j++) {
                if (objData.lodgementDraftSteps[i].lodgementDraftRequests[j].parentParcels === null) {
                  objData.lodgementDraftSteps[i].lodgementDraftRequests[j].parentParcels = JSON.stringify('');
                } else {
                  objData.lodgementDraftSteps[i].lodgementDraftRequests[j].parentParcels =
                    JSON.stringify(objData.lodgementDraftSteps[i].lodgementDraftRequests[j].parentParcels);
                }
              }
            }
          }
        }
      }
    }
    this.loaderService.display(true);
    this.restService.updateLodgementDraft(objData).subscribe(() => {
      this.getDatabyDraftId();
      this.snackbar.openSnackBar(val + ' details updated Successfully', 'Success');
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  getDatabyDraftId() {
    this.restService.getLodgementDraftById(this.draftData.draftId).subscribe(payload => {
      this.draftData = payload.data;
      this.outputFromChild.emit(this.draftData);
      this.bindData();
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  ngOnChanges() {
    this.readonly ? this.formApplicant.disable() : this.formApplicant.enable();
    this.draftData = this.draftData;
    this.bindData();
  }

  feedBack() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent, {
      width: '80%',
      height: '90%',
      panelClass: 'dialog-container-custom',
      data: this.draftData
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  setDataSourceAttributes() {
    if (this.sort !== undefined) {
      this.dataSourceUserRole.sort = this.sort;
    }
  }
}
