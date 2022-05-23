import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {RestcallService} from '../../services/restcall.service';
import * as enums from './../../constants/enums';
import {forkJoin} from 'rxjs';
import {InternalUserModel} from '../../general/modals/internalUser';
import {SnackbarService} from '../../services/snackbar.service';
import { UtilityService } from '../../services/utility.service';
import * as constants from './../../constants/localstorage-keys';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmUserComponent } from './confirm-user/confirm-user.component';
export const UserStatuses = {
    USER_INVALID: 'USER_INVALID',
    CAN_REGISTER: 'CAN_REGISTER',
    ALREADY_REGISTER: 'ALREADY_REGISTER'
};

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
    depUserName: string;
    internalUser: InternalUserModel = new InternalUserModel();
    hide1 = true;
    userFormGroup: FormGroup;
    roleFormGroup: FormGroup;
    selected = new FormControl(0);
    public form: FormGroup;
    provinces: any;
    sections: any;
    roles: any;
    password: string;
    selectedSection: any;
    province: any;
    role: any;
    ldapUserId: any;
    isSpinnerVisible = false;
    selectedFiles: any;
    newFile: any;
    errorMsg: any;
    isEditable = false;
    fileData: any;
    userDetail: any;
    email: any;
    userData: any;
    constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog,
                private restService: RestcallService, private snackbar: SnackbarService,
                private utility: UtilityService) {

        if (this.router.getCurrentNavigation().extras.state === undefined) {
            this.router.navigate(['/']);
        }

        this.userDetail = this.router.getCurrentNavigation().extras.state.userDetail;
        this.email = this.router.getCurrentNavigation().extras.state.userData.email;
        this.depUserName = this.userDetail.username;
        this.password = this.userDetail.password;
        this.userData = this.router.getCurrentNavigation().extras.state.userData;
    }

    ngOnInit() {
        this.roleFormGroup = this.fb.group({
            'role': ['', Validators.required],
            'province': ['', Validators.required],
            'subscribeEvents': [true],
            'subscribeNews': [true],
            'subscribeNotifications': [true],
            'sectionId': [''],
            'firstName': [this.userData.firstName, Validators.required],
            'lastName': [this.userData.surname],
            'userName': this.userData.username,
            'password': this.password,
            'file': ['', Validators.required]
        });
        this.userFormGroup = this.fb.group({
            username: this.userData.username,
            password: this.password
        });
        this.loadInitials();
    }

    get f() {
        return this.roleFormGroup;
    }

    async goForward(stepper: MatStepper) {
        stepper.next();
    }

    loadInitials() {
        forkJoin([
            this.restService.getProvinces(),
            this.restService.getListItems(enums.List_Master.SECTIONS)
            // this.restService.getRoles('INTERNAL')
        ]).subscribe(([provinces, sections]) => {
            this.provinces = provinces.data;
            this.sections = sections.data;
            // this.roles = roles.data.filter(x => x.roleName !== 'National System Administrator');
        });

    }

    confirm() {
        if (!this.roleFormGroup.valid || !this.userFormGroup.valid) {
            this.roleFormGroup.get('firstName').markAsTouched();
            this.roleFormGroup.get('role').markAsTouched();
            this.roleFormGroup.get('province').markAsTouched();
            this.roleFormGroup.get('file').markAsTouched();
            return;
        }
        const payload = this.createPaylod();
        this.isSpinnerVisible = true;
        this.restService.registerNewUser(payload).subscribe((response) => {
            if (response.code === 50000) {
                this.snackbar.openSnackBar(response.data, 'Error');
            } else {
                this.utility.setMessage(response.data != null ? response.data.message : 'Please contact administrator');
                // this.router.navigate(['/authentication/Confirmation'], { state: { userDetail: this.userDetail } });
                this.openconfirm();
            }
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    validateUser(stepper: MatStepper) {
        if (!this.userFormGroup.valid) {
            this.snackbar.openSnackBar('Fille Form properly', 'Error');
            return;
        }
        const payload = {
            username: this.userData.username,
            password: this.password
        };
        this.isSpinnerVisible = true;
        this.restService.verifyIfUserNameExist(this.userData.username).subscribe((result) => {
            this.isSpinnerVisible = false;
            if (!result.data) {
                stepper.next();
            } else {
                this.snackbar.openSnackBar('User name already registered.', 'Warning');
            }
        }, error => {
        });
    }

    // createPaylod() {
    //     return {
    //         role: this.getRoleInfo(),
    //         userInfo: this.getUserInfo(),
    //         username: this.depUserName,
    //         password: this.password,
    //         // ldapUserId: this.ldapUserId
    //     };
    // }

    getUserInfo() {
        return {
            'countryCode': '+27',
            'createdDate': new Date(),
            'email': this.email,
            'firstName': this.userData.usernamefirstName,
            'surname': this.userData.surname,
            'lastUpdatedDate': new Date(),
            'mobileNo': '123456',
            'password': this.password,
            'status': 'ACTIVE',
            'telephoneNo': '',
            'titleItemId': String(enums.titles.MR),
            'userCode': '',
            'userName': this.userData.username,
        };
    }

    getRoleInfo() {
        return {
            'internalRoleCode': '',
            'isActive': '',
            'signedAccessDocPath': '',
            'userCode': '',
            'userName': this.userData.username,
            'userProvinceCode': this.province.provinceId || this.provinces[0].provinceId,
            'userProvinceName': this.province.provinceName || this.provinces[0].provinceName,
            'userRoleCode': this.role.roleCode,
            'userRoleName': this.role.roleName,
            'sectionId': this.selectedSection && this.selectedSection.itemId || '',
            'userSectionName': this.selectedSection && this.selectedSection.caption || '',
            'subscribeEvents': this.roleFormGroup.value.subscribeEvents === true ? 1 : 0,
            'subscribeNews': this.roleFormGroup.value.subscribeNews === true ? 1 : 0,
            'subscribeNotifications': this.roleFormGroup.value.subscribeNotifications === true ? 1 : 0,
        };
    }

    onFileChange(ev: any) {
        if (ev.target.value.length !== 0) {
            const fileList: FileList = ev.target.files;
            if (fileList.length > 0) {
            this.fileData = fileList[0];
            }
        }
    }
    createPaylod() {
        const formData: FormData = new FormData();
        formData.append('uploadDocument', this.fileData);
        formData.append('userName', this.userData.username);
        formData.append('addrLine1', '');
        formData.append('addrLine2', '');
        formData.append('addrLine3', '');
        formData.append('email', this.email);
        formData.append('alternateEmail', '');
        formData.append('firstName', this.userData.firstName);
        formData.append('lastName', this.userData.surname);
        formData.append('mobile', '123456');
        formData.append('communicationTypeId', '');
        formData.append('organization', '');
        formData.append('organizationTypeId', '');
        formData.append('postalCode', '');
        formData.append('primaryProvinceId', this.province.provinceId || this.provinces[0].provinceId);
        formData.append('roleId', this.role.roleId);
        formData.append('sectorId', '');
        formData.append('sectionId', this.selectedSection && this.selectedSection.itemId || '');
        formData.append('securityA1', '');
        formData.append('securityA2', '');
        formData.append('securityA3', '');
        formData.append('securityQItemId1', '1');
        formData.append('securityQItemId2', '2');
        formData.append('securityQItemId3', '3');
        formData.append('subscribeNews', this.roleFormGroup.value.subscribeNews === true ? '1' : '0');
        formData.append('subscribeNotifications', this.roleFormGroup.value.subscribeNotifications === true ? '1' : '0');
        formData.append('subscribeEvents', this.roleFormGroup.value.subscribeEvents === true ? '1' : '0');
        formData.append('titleItemId', String(enums.titles.MR));
        formData.append('ppNo', '');
        formData.append('practiceName', '');
        formData.append('countryCode', '+27');
        formData.append('userTypeItemId', 'INTERNAL');
        return formData;
    }

    onUserRegister() {
        const loginPayload = {
            username: this.depUserName,
            password: this.password,
            grant_type: 'password'
        };
        this.restService.tokenAuth(loginPayload).subscribe((resp) => {
            this.isSpinnerVisible = true;
            if (resp) {
                this.restService.getUserByUserID(sessionStorage.USERID).subscribe((result) => {
                    const response = result && result.data;
                    const firstName = (response && response.firstName) || '',
                        surname = (response && response.surname) || '';
                    const role = response.userRoles.filter(x => x.isPrimary === 1)[0];
                    this.restService.getSiteMapItemByRoleId(role.roleId)
                        .subscribe(async (res) => {
                            this.restService.getHomePageSetting(response.userId).subscribe(homeInfo => {
                                    const data = res && res.data.privileges;
                                    const route = (homeInfo.data.homepage == null) ? 'home' : homeInfo.data.homepage,
                                        saveObjHome = homeInfo.data;

                                sessionStorage.setItem(constants.StorageConstants.HOME_SETTINGS, JSON.stringify(saveObjHome));
                                sessionStorage.setItem(constants.StorageConstants.MENU_ITEMS, JSON.stringify(data));
                                sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(response));
                                sessionStorage.setItem(constants.StorageConstants.USERINTERNALROLESINFO, JSON.stringify(role));
                                sessionStorage.setItem('name', `${firstName} ${surname}`);
                                this.isSpinnerVisible = false;
                                this.router.navigate([route]);
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Error loggin in.', 'Error');
                            });
                        });
                },
                error => {
                    this.isSpinnerVisible = false;
                    this.snackbar.openSnackBar('Error loggin in.', 'Error');
                });
            }
        },
        error => {
            this.isSpinnerVisible = false;
            this.snackbar.openSnackBar(error.error.error, 'Error');
            if (error.status === 409) {
                const userData = JSON.parse(error.error.error_description);
                this.router.navigate(['/authentication/register'], { state: { userDetail: loginPayload, userData: userData } });
            }
        });
    }

    openconfirm() {
        const dialogRef = this.dialog.open(ConfirmUserComponent, {
            width: '600px',
            height: '300px',
            data: this.userDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    getRoleBysectionId(event) {
        this.restService.listActiveRolesBySectionId(event.value.itemId).subscribe((roles) => {
            this.roles = roles.data.filter(x => x.roleName !== 'National System Administrator');
        }, error => {
        });
    }

    backToLogin() {
        this.router.navigate(['/authentication/login']);
    }
}
