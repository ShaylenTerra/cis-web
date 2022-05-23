import * as enums from './../../constants/enums';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {User} from './../../models/externalUser';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RestcallService} from '../../services/restcall.service';
import {CustomValidators} from 'ng2-validation';
import {forkJoin} from 'rxjs';
import {SnackbarService} from '../../services/snackbar.service';
import {MatStepper} from '@angular/material/stepper';
import {UtilityService} from '../../services/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { TAndCDialogComponent } from './tandc-details.dialog';


const email = new FormControl('', [Validators.required, CustomValidators.email]);
const confirmEmail = new FormControl('', [Validators.required, CustomValidators.equalTo(email)]);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isSpinnerVisible = false;
  user: User = new User();
  roleFormGroup: FormGroup;
  personalFormGroup: FormGroup;
  moreFormGroup: FormGroup;
  tabs = ['Role Information', 'Personal Information', 'More Information'];
  selected = new FormControl(0);
  roleInformationForm: FormGroup;
  personalInformationForm: FormGroup;
  moreInformationForm: FormGroup;
  public form: FormGroup;
  organizationTypes: any;
  sectors: any;
  orgtype: any;
  sector: any;
  roles: any;
  role: any;
  allExternalroles: any;
  provinces: any;
  province: any;
  securityQuestions: any;
  communcationTypes: any;
  titles: any;
  showProfDetail = false;
  prefixText = '';
  fileData: any;
  isLSA = false;
  ppno: string;
  practicename: string;
  selectedFiles: any;
  fileToUpload: File = null;
  hasError = false;
  comType: any;
  secq1: any;
  secq2: any;
  secq3: any;
  seca1: string;
  seca2: string;
  seca3: string;
  countryCode = '+27';
  validPPN = false;
  ppnNoWithPrefix = '';
  isEditable = true;
  @ViewChild('stepper') private myStepper: MatStepper;
  errormsg: any;
  constructor(private router: Router, private formBuilder: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private utility: UtilityService,
    private dialog: MatDialog) { }

  ngOnInit() {
    sessionStorage.clear();
    this.loadInitials();
    this.roleInformationForm = this.formBuilder.group({
      'role': ['', Validators.required],
      'province': ['', Validators.required],
      'email': email,
      'confirmEmail': confirmEmail,
      'roleInfo': this.formBuilder.array([])
    });
    this.personalInformationForm = this.formBuilder.group({
      'register': ['', Validators.compose([Validators.pattern('^(?:Y)$')])],
      'salutation': ['', Validators.required],
      'firstname': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'lastname': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'orgtype': ['', Validators.required],
      'sector': ['', Validators.required],
      'mobile': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('^\\+?[0-9]+$')])],
      'telephone': ['', Validators.compose([Validators.pattern('^[0-9]+$')])],
      'addressline1': ['', Validators.required],
      'addressline2': ['', Validators.required],
      'addressline3': '',
      'zipcode': ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      'countryCode': ['', Validators.required]
    });
    this.moreInformationForm = this.formBuilder.group({
      'communication': ['', Validators.required],
      'secq1': ['', Validators.compose([Validators.required])],
      'ans1': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'secq2': ['', Validators.compose([Validators.required])],
      'ans2': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'secq3': ['', Validators.compose([Validators.required])],
      'ans3': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      'news': '',
      'events': '',
      'information': '',
      'tc': [false, Validators.requiredTrue]
    });
  }

  // async goForward(stepper: MatStepper) {
  //   if (this.user.roles[0].USERROLECODE === enums.RoleCodes.ARCHITECT ||
  //        this.user.roles[0].USERROLECODE === enums.RoleCodes.LAND_SURVEYOR
  //     || this.user.roles[0].USERROLECODE === enums.RoleCodes.LAND_SURVEYOR_ASSISTANT) {
  //     try {
  //       const result = await this.restService.checkUserExist(this.user.email.toLowerCase()).toPromise();
  //       if (result.exists === 'false') {
  //         const plsCode = '';
  //         const data: any = await this.restService.validatePlsUser(plsCode).toPromise();
  //         if (data.plscode && data.plscode === plsCode) {
  //           const response: any = await this.restService.getPpNumber(plsCode).toPromise();
  //           if ((this.user.roles[0].USERROLECODE === enums.RoleCodes.ARCHITECT
  //             || this.user.roles[0].USERROLECODE === enums.RoleCodes.LAND_SURVEYOR)
  //             && response.exists === 'true') {
  //             this.snackbar.openSnackBar('User already registered with this PPN number', 'Error');
  //           } else if (this.user.roles[0].USERROLECODE === enums.RoleCodes.LAND_SURVEYOR_ASSISTANT && response.exists === 'true') {
  //             stepper.next();
  //           } else {
  //             stepper.next();
  //           }
  //         } else {
  //           this.snackbar.openSnackBar('PLS user doesnt exist', 'Error');
  //         }
  //       } else {
  //         this.snackbar.openSnackBar('Email Id already Exists', 'Warning');
  //       }
  //     } catch (err) {
  //       this.snackbar.openSnackBar('Technical Error. Try again', 'Error');
  //     }
  //   } else {
  //     stepper.next();
  //   }
  // }

  roleinfo() {
    if (this.roleInformationForm.invalid) {
      this.roleInformationForm.get('role').markAsTouched();
      this.roleInformationForm.get('province').markAsTouched();
      this.roleInformationForm.get('email').markAsTouched();
      this.roleInformationForm.get('confirmEmail').markAsTouched();
      this.myStepper.selected.completed = false;
    } else {
        this.isSpinnerVisible = true;
        this.restService.userEmailAvailability(this.user.email).subscribe((res) => {
          if (!res.data) {
            this.errormsg = 'User already registered in system. Use another email address to register';
            this.snackbar.openSnackBar('User already registered in system. Use another email address to register', 'Error');
          } else {
            this.errormsg = '';
            this.myStepper.selected.completed = true;
            this.myStepper.next();
          }
          this.isSpinnerVisible = false;
      }, error => {
          this.isSpinnerVisible = false;
          this.snackbar.openSnackBar('Error logging in.', 'Error');
      });
    }
  }

  personelinfo() {
    if (this.personalInformationForm.invalid) {
      this.personalInformationForm.get('register').markAsTouched();
      this.personalInformationForm.get('salutation').markAsTouched();
      this.personalInformationForm.get('firstname').markAsTouched();
      this.personalInformationForm.get('lastname').markAsTouched();
      this.personalInformationForm.get('orgtype').markAsTouched();
      this.personalInformationForm.get('sector').markAsTouched();
      this.personalInformationForm.get('mobile').markAsTouched();
      this.personalInformationForm.get('telephone').markAsTouched();
      this.personalInformationForm.get('addressline1').markAsTouched();
      this.personalInformationForm.get('addressline2').markAsTouched();
      this.personalInformationForm.get('zipcode').markAsTouched();
      this.personalInformationForm.get('countryCode').markAsTouched();
      this.myStepper.selected.completed = false;
    } else {
      this.myStepper.selected.completed = true;
      this.myStepper.next();
    }
  }

  getFormFields(id: number) {
    if (id === 1) {
      return this.formBuilder.group({
        'ppn': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
        'nameofpractise': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        'companydoc': ['', Validators.compose([Validators.required])]
      });
    } else {
      return this.formBuilder.group({
        'ppn': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
      });
    }
  }

  onRoleChange(obj: any) {
    const pickedRole = obj.value;
    const arrayControl = <FormArray>this.roleInformationForm.controls['roleInfo'];
    arrayControl.removeAt(0);
    this.prefixText = '';
    this.ppno = '';
    this.practicename = '';
    this.isLSA = false;
    this.showProfDetail = false;

    if (pickedRole.roleCode === enums.RoleCodes.ARCHITECT || pickedRole.roleCode === enums.RoleCodes.LAND_SURVEYOR ||
      pickedRole.roleCode === enums.RoleCodes.LAND_SURVEYOR_ASSISTANT) {
      const id = (pickedRole.roleCode === enums.RoleCodes.ARCHITECT || pickedRole.roleCode === enums.RoleCodes.LAND_SURVEYOR) ? 1 : 2;
      const newGroup = this.getFormFields(id);
      arrayControl.push(newGroup);
      this.prefixText = pickedRole.roleCode === enums.RoleCodes.ARCHITECT ? 'PRaRCHT' : 'GPR LS';
      this.isLSA = pickedRole.roleCode === enums.RoleCodes.LAND_SURVEYOR_ASSISTANT;
      this.showProfDetail = !this.isLSA;
    }
  }

  loadInitials() {
    this.isSpinnerVisible = true;
    forkJoin([
      this.restService.getExternalRoles(),
      this.restService.getListItems(enums.list_master.SECTORS),
      this.restService.getListItems(enums.list_master.SECURITYQUESTION),
      this.restService.getProvinces(),
      this.restService.getListItems(enums.list_master.ORGANIZATIONS),
      this.restService.getListItems(enums.list_master.COMMUNICATIONMODE),
      this.restService.getListItems(enums.list_master.TITLE)
    ]).subscribe(([roles, sectors, secQuestions, provinces, orgTypes, commTypes, titles]) => {
      this.roles = roles.data;
      this.sectors = sectors.data;
      this.provinces = provinces.data;
      this.securityQuestions = secQuestions.data;
      this.communcationTypes = commTypes.data;
      this.organizationTypes = orgTypes.data;
      this.titles = titles.data;
      this.isSpinnerVisible = false;
    },
      error => {
        this.isSpinnerVisible = false;
        this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      });
  }

  onFileChange(ev: any) {
    if (ev.target.value.length !== 0) {
      const fileList: FileList = ev.target.files;
      if (fileList.length > 0) {
        this.fileData = fileList[0];
      }
    }
  }

  confirm() {
    if (this.moreInformationForm.invalid) {
      this.moreInformationForm.get('communication').markAsTouched();
      this.moreInformationForm.get('secq1').markAsTouched();
      this.moreInformationForm.get('ans1').markAsTouched();
      this.moreInformationForm.get('secq2').markAsTouched();
      this.moreInformationForm.get('ans2').markAsTouched();
      this.moreInformationForm.get('secq3').markAsTouched();
      this.moreInformationForm.get('ans3').markAsTouched();
      this.moreInformationForm.get('tc').markAsTouched();
    } else {
    if (this.hasError) {
      this.snackbar.openSnackBar('Security questions should be Unique', 'Error');
      return;
    }
    this.isSpinnerVisible = true;
    const observables: Array<any> = [];
    if (this.role.roleCode === enums.RoleCodes.ARCHITECT || this.role.roleCode === enums.RoleCodes.LAND_SURVEYOR ||
      this.role.roleCode === enums.RoleCodes.LAND_SURVEYOR_ASSISTANT) {
      if (!this.validPPN) {
        this.isSpinnerVisible = false;
        this.snackbar.openSnackBar('PPN number is not valid', 'Error');
        return;
      }
      // const formData: FormData = this.fillPLSDetails();
      // observables.push(this.restService.registerPLSUser(formData));
    }
      const payloadUser = this.fillPLSDetails();
      // observables.push(this.restService.registerExternalUser(payloadUser));
      this.restService.registerExternalUser(payloadUser).subscribe((res) => {

          this.isSpinnerVisible = false;
          if (res.code === 50000) {
              this.snackbar.openSnackBar(res.data, 'Error');
          } else {
              this.utility.setMessage(res.data != null ? res.data.message : 'Please contact administrator');
              this.router.navigate(['/authentication/Confirmation']);
          }
      }, error => {
          this.isSpinnerVisible = false;
          this.snackbar.openSnackBar('Error logging in.', 'Error');
      });
    // forkJoin(observables).subscribe(async ([response]) => {
    //   const res: any = response;
    //   this.isSpinnerVisible = false;
    //   if (res.message === 'Email Id already exists') {
    //     this.snackbar.openSnackBar('Email id already Exists', 'Warning');
    //     return;
    //   }
    //   this.snackbar.openSnackBar('Successfully Registered', 'Success');
    //   this.utility.setMessage(res.data);
    //   console.log(res);
    //   // this.router.navigate(['/authentication/Confirmation']);
    // }, error => {
    //   this.isSpinnerVisible = false;
    //   this.snackbar.openSnackBar('Error while Registration', 'Error');
    // });
  }
  }

  validateppno() {
      const plsCode = `${this.prefixText} ${this.ppno}`;
      this.ppnNoWithPrefix = plsCode;
      this.isSpinnerVisible = true;
      this.restService.validatePPNO(plsCode).subscribe((result) => {
          this.isSpinnerVisible = false;
          this.validPPN = result.data;
          if (!this.validPPN) {
              this.snackbar.openSnackBar('Not a Valid PPN number', 'Warning');
          }
      }, error => {
          this.isSpinnerVisible = false;
          this.snackbar.openSnackBar('Error while validating PLS Code', 'Error');
      });
  }

  fillDetails() {
    return {
      addrLine1: this.user.postalAddrLine1,
      addrLine2: this.user.postalAddrLine2,
      addrLine3: this.user.postalAddrLine3 || '',
      email: this.user.email,
      firstName: this.user.firstName,
      lastName: this.user.surname,
      mobile: this.user.mobileNo,
      modeOfComm: this.comType.caption,
      modeOfCommCode: this.comType.itemCode,
      organization: this.orgtype.caption,
      organizationTypeCode: this.orgtype.itemCode,
      postalCode: this.user.postalCode,
      primaryProvince: this.province.provinceName,
      primaryProvinceCode: this.province.orgCode,
      role: this.role.roleName,
      roleCode: this.role.roleCode,
      sector: this.sector.caption,
      sectorCode: this.sector.itemCode,
      securityA1: this.seca1,
      securityA2: this.seca2,
      securityA3: this.seca3,
      securityQ1: this.secq1.caption,
      securityQ2: this.secq2.caption,
      securityQ3: this.secq3.caption,
      securityQTypeCode1: this.secq1.itemCode,
      securityQTypeCode2: this.secq2.itemCode,
      securityQTypeCode3: this.secq3.itemCode,
      subscribeNews: this.user.subscribeNews ? 'Y' : 'N',
      subscribeNotifications: this.user.subscribeNotifications ? 'Y' : 'N',
      subscribeEvents: this.user.subscribeEvents ? 'Y' : 'N',
      titleItemId: String(this.user.titleItemId)
    };
  }

  fillPLSDetails() {
      const formData: FormData = new FormData();
      if (this.role.roleCode === enums.RoleCodes.ARCHITECT || this.role.roleCode === enums.RoleCodes.LAND_SURVEYOR) {
          formData.append('uploadDocument', this.fileData);
      }
      formData.append('addrLine1', this.user.postalAddrLine1);
      formData.append('addrLine2', this.user.postalAddrLine2);
      formData.append('addrLine3', this.user.postalAddrLine3 || '');
      formData.append('userName', this.user.email);
      formData.append('email', this.user.email);
      formData.append('alternateEmail', this.user.email);
      formData.append('firstName', this.user.firstName);
      formData.append('lastName', this.user.surname);
      formData.append('mobile', this.user.mobileNo);
      formData.append('communicationTypeId', this.comType.itemId);
      formData.append('organization', this.orgtype.caption);
      formData.append('organizationTypeId', this.orgtype.itemId);
      formData.append('postalCode', this.user.postalCode);
      formData.append('primaryProvinceId', this.province.provinceId);
      formData.append('roleId', this.role.roleId);
      formData.append('sectorId', this.sector.itemId);
      formData.append('securityA1', this.seca1);
      formData.append('securityA2', this.seca2);
      formData.append('securityA3', this.seca3);
      formData.append('securityQItemId1', this.secq1.itemId);
      formData.append('securityQItemId2', this.secq2.itemId);
      formData.append('securityQItemId3', this.secq3.itemId);
      formData.append('subscribeNews', this.user.subscribeNews ? '1' : '0');
      formData.append('subscribeNotifications', this.user.subscribeNotifications ? '1' : '0');
      formData.append('subscribeEvents', this.user.subscribeEvents ? '1' : '0');
      formData.append('titleItemId', String(this.user.titleItemId));
      formData.append('ppNo', this.ppnNoWithPrefix);
      formData.append('practiceName', this.practicename);
      formData.append('countryCode', this.countryCode);
      formData.append('userTypeItemId', 'EXTERNAL');
      return formData;
  }

  selectFile(event) {
    this.fileToUpload = event.target.files;
  }

  onSecqChange() {
    this.hasError = false;
    const condition1 = this.secq1 !== null && this.secq2 != null && this.secq1 === this.secq2,
      condition2 = this.secq2 !== null && this.secq3 != null && this.secq2 === this.secq3,
      condition3 = this.secq1 !== null && this.secq3 != null && this.secq1 === this.secq3;
    if (condition1 || condition2 || condition3) {
      this.hasError = true;
      this.snackbar.openSnackBar('Two security questions cannot be same', 'Warning');
    }
  }
  openTAndC() {
    const dialogRef = this.dialog.open(TAndCDialogComponent, {
      width: '450px',
      height: '550px'
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
  });
  }
}
