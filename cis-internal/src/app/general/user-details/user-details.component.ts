import {Component, OnInit, ViewChild} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoaderService} from '../../services/loader.service';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../format-datepicket';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import * as enums from './../../constants/enums';
import * as constants from './../../constants/localstorage-keys';
import { ViewUserRoleComponent } from './view-user-role/view-user-role.component';
import { PasswordConfirmDialogComponent } from './password-confirm-dialog/password-confirm-dialog.component';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class UserDetailsComponent implements OnInit {
    showSideCollapser = true;
    isSpinnerVisible = false;
    activeTabId = 1;
    menuItems: Array<MenuItem> = [];
    state;
    userDetail: any;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    step: any = 0;

    securityInfo = {
        securityQuestion1: '',
        securityQuestion2: '',
        securityQuestion3: '',
        securityAnswer1: '',
        securityAnswer2: '',
        securityAnswer3: '',
    };
    securityData = {
        securityA1: '',
        securityA2: '',
        securityA3: '',
        securityQ1: '',
        securityQ2: '',
        securityQ3: '',
        securityQTypeCode1: '',
        securityQTypeCode2: '',
        securityQTypeCode3: '',
        userId: ''
    };
    rolesInfo;
    secq1;
    secq2;
    secq3;
    date;
    hasError = false;
    tableColumns: string[] = ['userRoleName', 'userProvinceName', 'sectionName', 'isActive', 'action'];
    supportingTableColumns: string[] = ['documentTypeId', 'fileName', 'action'];
    supprotingDoc;
    userMetaData: any;
    organizationTypes: any;
    sectors: any;
    comType: any;
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
    personalInformationForm: FormGroup;
    moreInformationForm: FormGroup;
    basicInformationForm: FormGroup;
    basicInfoPLSForm: FormGroup;
    title: any;
    titleName: any;
    statuses: any;
    status: any;
    statusName: any;
    AdditionaRolesInfo: any;
    documentTypes: any;
    url: any = '';
    plProvinceName: any;
    provinceId: any;
    roleId: any;
    extrenalRoleForm: FormGroup;
    public toggleEdit: any = true;
    filters: any;
    org: any;
    constructor(private router: Router, private dialog: MatDialog,
                private restService: RestcallService,
                private snackbar: SnackbarService,
                private fb: FormBuilder,
                private loaderService: LoaderService,
                private _location: Location,
                private formBuilder: FormBuilder
    ) {
        if (this.router.getCurrentNavigation().extras.state === undefined) {

            if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'Internal') {
                sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
                this.router.navigate(['/general/internal-users']);
            } else if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'External') {
                sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
                this.router.navigate(['/general/external-users']);
            } else if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'PLS') {
                sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
                this.router.navigate(['/general/pls-users']);
            } else if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'Architect') {
                sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
                this.router.navigate(['/general/architect-users']);
            }
        }

        this.userDetail = this.router.getCurrentNavigation().extras.state.userDetail;
        this.filters = this.router.getCurrentNavigation().extras.state.filters;
        sessionStorage.setItem(constants.userTypeConstants.USERTYPE, this.userDetail.type);
        this.menuItems = [
            {
                id: 1,
                name: 'basic Tab',
                isActive: true,
                activeIconUrl: 'assets/images/bootstrap-icons/a-requester.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-requester.svg',
                title: 'Basic Information',
                description: 'Basic info of the user.'
            },
            {
                id: 2,
                name: 'personal Tab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-requester.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-requester.svg',
                title: 'Personal Information',
                description: 'Personal info of the user.'
            },
            {
                id: 3,
                name: 'securityTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-flow.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-flow.svg',
                title: 'Security Information',
                description: 'Security Information'
            },
            {
                id: 4,
                name: 'roleTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                title: 'Role Information',
                description: 'Role Information'
            },
            {
                id: 5,
                name: 'supportingTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                title: 'Supporting Document',
                description: 'Supporting Document'
            },
            {
                id: 6,
                name: 'passwordTab',
                isActive: false,
                activeIconUrl: 'assets/images/bootstrap-icons/a-referral.svg',
                inActiveIconUrl: 'assets/images/bootstrap-icons/ia-referral.svg',
                title: 'Others',
                description: 'Others'
            },
        ];

        if (this.userDetail.type === 'Internal') {
            this.menuItems = this.menuItems.filter(x => x.id !== 3 && x.id !== 6);
        }
        if (this.userDetail.type === 'PLS' || this.userDetail.type === 'Architect') {
            this.menuItems = this.menuItems.slice(0, 2);
        }
    }

    ngOnInit() {
        this.moreInformationForm = this.formBuilder.group({
            'alternativeEmail': [''],
            'communicationTypeItemId': [''],
            'createdDate': [''],
            'organizationTypeItemId': [''],
            'postalAddressLine1': [''],
            'postalAddressLine2': [''],
            'postalAddressLine3': [''],
            'postalCode': [''],
            'ppnNo': [''],
            'practiseName': [''],
            'sectorItemId': '',
            'subscribeEvents': [''],
            'subscribeNews': [''],
            'subscribeNotifications': [''],
            'userCode': [''],
            'userID': [''],
            'userMetaDataId': [''],
            'securityAnswer1': [''],
            'securityAnswer2': [''],
            'securityAnswer3': [''],
            'securityQuestionItemId1': [''],
            'securityQuestionItemId2': [''],
            'securityQuestionItemId3': ['']
          });

          this.basicInformationForm = this.formBuilder.group({
            'countryCode': [''],
            'createdDate': [''],
            'email': [''],
            'firstName': [''],
            'mobileNo': [''],
            'province': [''],
            'provinceId': [''],
            'status': [''],
            'statusId': [''],
            'surname': [''],
            'telephoneNo': [''],
            'title': [''],
            'titleItemId': [''],
            'userCode': [''],
            'userId': [''],
            'userName': [''],
            'userType': ['']
          });

          this.basicInfoPLSForm = this.formBuilder.group({
            'alternateEmail': [''],
            'businessName': [''],
            'cellPhoneNo': [''],
            'courierService': [''],
            'createdByUserid': [''],
            'createdDate': [''],
            'description': [''],
            'email': [''],
            'faxNo': [''],
            'firstName': [''],
            'generalNotes': [''],
            'initials': [''],
            'isValid': [''],
            'modifiedByUserid': [''],
            'modifiedDate': [''],
            'postalAddress1': [''],
            'postalAddress2': [''],
            'postalAddress3': [''],
            'postalAddress4': [''],
            'postalCode': [''],
            'ppnNo': [''],
            'professionTypeItemId': [''],
            'provinceId': [''],
            'restrictedIndicator': [''],
            'sectionalPlanInd': [''],
            'sgOfficeId': [''],
            'statusItemId': [''],
            'surname': [''],
            'surveyorId': [''],
            'telephoneNumber': [''],
            'userProfessionalId': [''],
            'userid': ['']
          });

          this.extrenalRoleForm = this.formBuilder.group({
            'isPrimary': 0,
            'provinceId': [''],
            'provinceName': [''],
            'roleId': [''],
            'roleName': [''],
            'sectionItemId': [''],
            'sectionName': [''],
            'userId': [''],
            'userRoleId': 0
          });

        this.loadInitials();
        // this.rolesInfo = this.userDetail.details.userRoles;
        this.date = new Date(this.userDetail.details.createdDate);

    }

    loadInitials() {
        this.loaderService.display(true);
        forkJoin([
          this.restService.getUserMetaData(this.userDetail.details.userId),
          this.restService.getUserRole(this.userDetail.details.userId),
          this.restService.getRoles(this.userDetail.details.userType),
          this.restService.getListItems(enums.List_Master.SECTORS),
          this.restService.getListItems(enums.List_Master.SECURITYQUESTION),
          this.restService.getProvinces(),
          this.restService.getListItems(enums.List_Master.ORGANIZATIONS),
          this.restService.getListItems(enums.List_Master.COMMUNICATIONMODE),
          this.restService.getListItems(enums.List_Master.TITLE),
          this.restService.getListItems(20),
          this.restService.getListItems(181),
          this.restService.getListItems(221)
        ]).subscribe(([userMetaData, userRoles, roles, sectors, secQuestions,
                    provinces, orgTypes, commTypes, titles, statuses, documentType, org]) => {
          this.userMetaData = userMetaData.data;
          this.roles = roles.data;
          this.sectors = sectors.data;
          this.provinces = provinces.data;
          if (this.userDetail.type === 'Internal' || this.userDetail.type === 'External') {
            this.rolesInfo = userRoles.data.filter(x => x.isPrimary === 1);
            this.AdditionaRolesInfo = userRoles.data.filter(x => x.isPrimary === 0);
          }
          this.statuses = statuses.data;
          this.documentTypes = documentType.data;
          this.securityQuestions = secQuestions.data;
          this.communcationTypes = commTypes.data;
          this.organizationTypes = orgTypes.data;
          this.org = org.data;
          if (this.userMetaData !== null) {
            this.moreInformationForm.patchValue({
                'alternativeEmail': this.userMetaData.alternativeEmail,
                'communicationTypeItemId': this.userMetaData.communicationTypeItemId,
                'createdDate': this.userMetaData.createdDate,
                'organizationTypeItemId': this.userMetaData.organizationTypeItemId,
                'postalAddressLine1': this.userMetaData.postalAddressLine1,
                'postalAddressLine2': this.userMetaData.postalAddressLine2,
                'postalAddressLine3': this.userMetaData.postalAddressLine3,
                'postalCode': this.userMetaData.postalCode,
                'ppnNo': this.userMetaData.ppnNo,
                'practiseName': this.userMetaData.practiseName,
                'sectorItemId': this.userMetaData.sectorItemId,
                'subscribeEvents': this.userMetaData.subscribeEvents,
                'subscribeNews': this.userMetaData.subscribeNews,
                'subscribeNotifications': this.userMetaData.subscribeNotifications,
                'userCode': this.userMetaData.userCode,
                'userID': this.userMetaData.userID,
                'userMetaDataId': this.userMetaData.userMetaDataId,
                'securityAnswer1': this.userMetaData.securityAnswer1,
                'securityAnswer2': this.userMetaData.securityAnswer2,
                'securityAnswer3': this.userMetaData.securityAnswer3,
                'securityQuestionItemId1': this.userMetaData.securityQuestionItemId1,
                'securityQuestionItemId2': this.userMetaData.securityQuestionItemId2,
                'securityQuestionItemId3': this.userMetaData.securityQuestionItemId3
              });
              this.comType = this.userMetaData.communicationTypeItemId;
              this.orgtype = this.userMetaData.organizationTypeItemId;
              this.sector = this.userMetaData.sectorItemId;

            if (this.userDetail.type === 'External') {
                this.secq1 = this.userMetaData.securityQuestionItemId1;
                this.secq2 = this.userMetaData.securityQuestionItemId2;
                this.secq3 = this.userMetaData.securityQuestionItemId3;
                this.securityData.securityA1 = this.userMetaData.securityAnswer1;
                this.securityData.securityA2 = this.userMetaData.securityAnswer2;
                this.securityData.securityA3 = this.userMetaData.securityAnswer3;
                this.securityData.securityQTypeCode1 = this.userMetaData.securityQuestionItemId1;
                this.securityData.securityQTypeCode2 = this.userMetaData.securityQuestionItemId2;
                this.securityData.securityQTypeCode3 = this.userMetaData.securityQuestionItemId3;
                this.securityData.userId = this.userDetail.details.userId;
            } else {
                this.securityData = {
                    securityA1: '',
                    securityA2: '',
                    securityA3: '',
                    securityQ1: '',
                    securityQ2: '',
                    securityQ3: '',
                    securityQTypeCode1: '',
                    securityQTypeCode2: '',
                    securityQTypeCode3: '',
                    userId: ''
                };
            }
          }
          this.titles = titles.data;
          if (this.userDetail.type === 'Internal' || this.userDetail.type === 'External') {
                this.basicInformationForm.patchValue({
                    'countryCode': this.userDetail.details.countryCode,
                    'createdDate': this.userDetail.details.createdDate,
                    'email': this.userDetail.details.email,
                    'firstName': this.userDetail.details.firstName,
                    'mobileNo': this.userDetail.details.mobileNo,
                    'province': this.userDetail.details.province,
                    'provinceId': this.userDetail.details.provinceId,
                    'status': this.userDetail.details.status,
                    'statusId': this.userDetail.details.statusId,
                    'surname': this.userDetail.details.surname,
                    'telephoneNo': this.userDetail.details.telephoneNo,
                    'title': this.userDetail.details.title,
                    'titleItemId': this.userDetail.details.titleItemId,
                    'userCode': this.userDetail.details.userCode,
                    'userId': this.userDetail.details.userId,
                    'userName': this.userDetail.details.userName,
                    'userType': this.userDetail.details.userType
                });
                this.title = this.userDetail.details.titleItemId;
                if (this.title !== null) {
                    this.titleName = this.titles.filter(x => x.itemId === this.title).length > 0 ?
                                    this.titles.filter(x => x.itemId === this.title)[0].caption : '';
                                    this.status = this.userDetail.details.statusId;
                }
                if (this.status !== null) {
                    this.statusName = this.statuses.filter(x => x.itemId === this.status) > 0 ?
                                    this.statuses.filter(x => x.itemId === this.status)[0].caption : '';
                }
                this.setProfileImages();
            }
            if (this.userDetail.type === 'PLS' || this.userDetail.type === 'Architect') {
                this.statuses = this.statuses.filter(x => x.caption === 'ACTIVE' || x.caption === 'INACTIVE');
                this.status = this.userDetail.details.statusItemId;
                this.basicInfoPLSForm = this.formBuilder.group({
                    'alternateEmail': this.userDetail.details.alternateEmail,
                    'businessName': this.userDetail.details.businessName,
                    'cellPhoneNo': this.userDetail.details.cellPhoneNo,
                    'courierService': this.userDetail.details.courierService,
                    'createdByUserid': this.userDetail.details.createdByUserid,
                    'createdDate': this.userDetail.details.createdDate,
                    'description': this.userDetail.details.description,
                    'email': this.userDetail.details.email,
                    'faxNo': this.userDetail.details.faxNo,
                    'firstName': this.userDetail.details.firstName,
                    'generalNotes': this.userDetail.details.generalNotes,
                    'initials': this.userDetail.details.initials,
                    'isValid': this.userDetail.details.isValid,
                    'modifiedByUserid': this.userDetail.details.modifiedByUserid,
                    'modifiedDate': this.userDetail.details.modifiedDate,
                    'postalAddress1': this.userDetail.details.postalAddress1,
                    'postalAddress2': this.userDetail.details.postalAddress2,
                    'postalAddress3': this.userDetail.details.postalAddress3,
                    'postalAddress4': this.userDetail.details.postalAddress4,
                    'postalCode': this.userDetail.details.postalCode,
                    'ppnNo': this.userDetail.details.ppnNo,
                    'professionTypeItemId': this.userDetail.details.professionTypeItemId,
                    'provinceId': this.userDetail.details.provinceId,
                    'restrictedIndicator': (this.userDetail.details.restrictedIndicator !== null ||
                                            this.userDetail.details.restrictedIndicator !== undefined
                                            ? Number(this.userDetail.details.restrictedIndicator) : 0),
                    'sectionalPlanInd': (this.userDetail.details.sectionalPlanInd !== null ||
                                        this.userDetail.details.sectionalPlanInd !== undefined
                                        ? Number(this.userDetail.details.sectionalPlanInd) : 0),
                    'sgOfficeId': this.userDetail.details.sgOfficeId,
                    'statusItemId': this.userDetail.details.statusItemId,
                    'surname': this.userDetail.details.surname,
                    'surveyorId': this.userDetail.details.surveyorId,
                    'telephoneNumber': this.userDetail.details.telephoneNumber,
                    'userProfessionalId': this.userDetail.details.userProfessionalId,
                    'userid': this.userDetail.details.userid
                  });
                  this.plProvinceName =
                  this.provinces.filter(x => x.provinceId === this.userDetail.details.provinceId)[0] !== undefined ?
                  this.provinces.filter(x => x.provinceId === this.userDetail.details.provinceId)[0].provinceId : null;
            }

            if (this.rolesInfo !== undefined) {
            this.extrenalRoleForm.patchValue({
                'isPrimary': this.rolesInfo[0].isPrimary,
                'provinceId': this.rolesInfo[0].provinceId,
                'provinceName': this.rolesInfo[0].provinceName,
                'roleId': this.rolesInfo[0].roleId,
                'roleName': this.rolesInfo[0].roleName,
                'sectionItemId': this.rolesInfo[0].sectionItemId,
                'sectionName': this.rolesInfo[0].sectionName,
                'userId': this.rolesInfo[0].userId,
                'userRoleId': this.rolesInfo[0].userRoleId
              });
              this.roleId = this.rolesInfo[0].roleId;
              for (let p = 0; p < this.provinces.length; p++) {
                  this.provinces[p].isSelected =
                  this.rolesInfo.filter(x => x.provinceId === this.provinces[p].provinceId).length > 0 ? true : false;
              }
              this.provinceId = this.rolesInfo[0].provinceId;
            }


          this.loaderService.display(false);
        },
          error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
          });
      }

      setProfileImages() {
        this.restService.getDisplayProfileImage(this.userDetail.details.userId).subscribe(response => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = (_event) => {
                this.url = reader.result;
            };
        });
    }

    deleteExternalRole(val) {
        this.loaderService.display(true);
        this.restService.deleteUserRole(val.userRoleId).subscribe((res: any) => {
        if (res.code === 50000) {
            this.snackbar.openSnackBar(`Error occured`, 'Error');
            this.loaderService.display(false);
        } else {
            this.snackbar.openSnackBar(`Role province assignement deleted`, 'Success');
            this.getUserRoles();
            this.loaderService.display(false);
            this.toggleEdit = true;
        }
        }, error => {
            this.loaderService.display(false);
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

        if (id === 5) {
            this.getUserDocuments(this.userDetail.details.userId); // TAB 1
        }
    }

    close() {
        this.router.navigate(['/tasks/task-list']);
    }

    setStep(step) {

    }

    onSecqChange() {
        // if (this.secq1 !== this.secq2 && this.secq2 !== this.secq3 && this.secq3 !== this.secq1) {
        //     this.securityData.securityQTypeCode1 = this.secq1.itemCode;
        //     this.securityData.securityQTypeCode2 = this.secq2.itemCode;
        //     this.securityData.securityQTypeCode3 = this.secq3.itemCode;
        //     this.securityData.securityQ1 = this.secq1.caption;
        //     this.securityData.securityQ2 = this.secq2.caption;
        //     this.securityData.securityQ3 = this.secq3.caption;
        //     this.hasError = false;
        // } else {
        //     this.snackbar.openSnackBar('Each security question needs to be unique', 'Warning');
        //     this.hasError = true;
        // }
    }

    updateProfile() {
    }

    updateSecurityInfo() {
        if (!this.hasError) {
            this.securityData.securityA1 = this.securityInfo.securityAnswer1;
            this.securityData.securityA2 = this.securityInfo.securityAnswer2;
            this.securityData.securityA3 = this.securityInfo.securityAnswer3;

            this.restService.updateSecurityQuestions(this.securityData).subscribe(data => {
                this.snackbar.openSnackBar('Security Questions Updated Successfully', 'Success');
            }, error => {
                this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
            });
        } else {
            this.snackbar.openSnackBar('Cannot Update. All security questions should be Unique', 'Error');
        }
    }

    updateUserMetaData() {
        this.loaderService.display(true);
        this.moreInformationForm.patchValue({
            'subscribeEvents': this.moreInformationForm.value.subscribeEvents === true ? 1 : 0,
            'subscribeNews': this.moreInformationForm.value.subscribeNews === true ? 1 : 0,
            'subscribeNotifications': this.moreInformationForm.value.subscribeNotifications === true ? 1 : 0,
        });
        this.restService.saveUserMetaData(this.moreInformationForm.value).subscribe(data => {
            this.snackbar.openSnackBar('User meta data Updated Successfully', 'Success');
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
        });
    }

    updateInExUserBasicInfo() {
        this.loaderService.display(true);
        this.basicInformationForm.patchValue({
            'title': this.titles.filter(x => x.itemId === this.basicInformationForm.value.titleItemId)[0].caption,
            'status': this.statuses.filter(x => x.itemId === this.basicInformationForm.value.statusId)[0].caption
        });

        this.restService.updatePersonalInfo(this.basicInformationForm.value).subscribe(data => {
            this.snackbar.openSnackBar('User meta data Updated Successfully', 'Success');
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
        });
    }

    updatePLSUserBasicInfo() {
        this.loaderService.display(true);
        this.restService.saveProfessional(this.basicInfoPLSForm.value).subscribe(data => {
            if (data.code === 50000) {
                this.snackbar.openSnackBar(data.msg, 'Error');
            } else {
                this.snackbar.openSnackBar('User data Updated Successfully', 'Success');
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
        });
    }

    viewRole(roleData: any, state: any) {
        const dialogRef = this.dialog.open(ViewUserRoleComponent, {
            width: '40%',
            data: {role: roleData, userType: this.userDetail.details.userType, state: state, userId: this.userDetail.details.userId},
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getUserRoles();
        });
    }

    addAdditionalRole() {
        const dialogRef = this.dialog.open(ViewUserRoleComponent, {
            width: '40%',
            data: {role: null, userType: this.userDetail.details.userType, state: 'Add', userId: this.userDetail.details.userId},
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getUserRoles();
        });
    }

    getUserRoles() {
        this.loaderService.display(false);
        this.restService.getUserRole(this.userDetail.details.userId).subscribe(userRoles => {
            this.rolesInfo = userRoles.data.filter(x => x.isPrimary === 1);
            this.AdditionaRolesInfo = userRoles.data.filter(x => x.isPrimary === 0);
            if (this.rolesInfo !== undefined) {
                this.extrenalRoleForm.patchValue({
                    'isPrimary': this.rolesInfo[0].isPrimary,
                    'provinceId': this.rolesInfo[0].provinceId,
                    'provinceName': this.rolesInfo[0].provinceName,
                    'roleId': this.rolesInfo[0].roleId,
                    'roleName': this.rolesInfo[0].roleName,
                    'sectionItemId': this.rolesInfo[0].sectionItemId,
                    'sectionName': this.rolesInfo[0].sectionName,
                    'userId': this.rolesInfo[0].userId,
                    'userRoleId': this.rolesInfo[0].userRoleId
                  });
                  this.roleId = this.rolesInfo[0].roleId;
                  for (let p = 0; p < this.provinces.length; p++) {
                      this.provinces[p].isSelected =
                      this.rolesInfo.filter(x => x.provinceId === this.provinces[p].provinceId).length > 0 ? true : false;
                  }
                  this.provinceId = this.rolesInfo[0].provinceId;
                }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            // this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
        });
    }

    getUserDocuments(userId: any) {
        this.loaderService.display(true);
        this.restService.getUserDocuments('USER_REGISTRATION_DOCUMENT', userId).subscribe((res: any) => {
            this.supprotingDoc = res.data;
            for (let i = 0; i < this.supprotingDoc.length; i++) {
                this.supprotingDoc[i].DocumentType =
                    this.documentTypes.filter(x => x.itemId === this.supprotingDoc[i].documentTypeId).length > 0 ?
                    this.documentTypes.filter(x => x.itemId === this.supprotingDoc[i].documentTypeId)[0].caption :
                    '';
            }
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    download(id: any, fileName: any) {
        this.loaderService.display(true);
        this.restService.downloadUserSupportingDocument(id).subscribe((res: any) => {
            this.downloadBlob(res, fileName);
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
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

    editExtRole() {
        this.toggleEdit = false;
    }

    updateExternalRole(val) {
        if (val.isSelected) {
            this.extrenalRoleForm.patchValue({
                provinceId: val.provinceId,
                provinceName: val.provinceName,
                userRoleId: 0
            });
            this.loaderService.display(true);
            this.restService.saveUserRole(this.extrenalRoleForm.value).subscribe((res: any) => {
            this.snackbar.openSnackBar(`Role updateded Successfully`, 'Success');
            this.getUserRoles();
            this.loaderService.display(false);
            this.toggleEdit = true;
            }, error => {
                this.loaderService.display(false);
            });
        } else {
            const id = this.rolesInfo.filter(x => x.provinceId === val.provinceId)[0].userRoleId;
            this.loaderService.display(true);
            this.restService.deleteUserRole(id).subscribe((res: any) => {
            if (res.code === 50000) {
                this.snackbar.openSnackBar(`Error occured`, 'Error');
                this.loaderService.display(false);
            } else {
                this.snackbar.openSnackBar(`Role province assignement deleted`, 'Success');
                this.getUserRoles();
                this.loaderService.display(false);
                this.toggleEdit = true;
            }
            }, error => {
                this.loaderService.display(false);
            });
        }
    }

    back() {
        if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'Internal') {
            sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
            this.router.navigate(['/general/internal-users'], {state: {filter: this.filters}});
        } else if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'External') {
            sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
            this.router.navigate(['/general/external-users'], {state: {filter: this.filters}});
        } else if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'PLS') {
            sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
            this.router.navigate(['/general/pls-users'], {state: {filter: this.filters}});
        } else if (sessionStorage.getItem(constants.userTypeConstants.USERTYPE) === 'Architect') {
            sessionStorage.removeItem(constants.userTypeConstants.USERTYPE);
            this.router.navigate(['/general/architect-users'], {state: {filter: this.filters}});
        }
    }

    sendPassword() {
        const dialogRef = this.dialog.open(PasswordConfirmDialogComponent, {
            width: '550px',
            data: this.userDetail.details.email
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

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
