import {Component, OnInit} from '@angular/core';

import * as constants from '../constants/storage-keys';
import {forkJoin} from 'rxjs';
import {RestcallService} from '../services/restcall.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {MatDialog} from '@angular/material/dialog';
import {AddProvinceDialogComponent} from './province.dialog';
import {Router} from '@angular/router';
import {SnackbarService} from '../services/snackbar.service';
import { SearchService } from '../search/search.service';
import { CustomsValidators } from './customa-validators';
import { LoaderService } from '../services/loader.service';

const password = new FormControl('', Validators.compose([
    Validators.required,
    // check whether the entered password has a number
    CustomsValidators.patternValidator(/\d/, {
      hasNumber: true
    }),
    // check whether the entered password has upper case letter
    CustomsValidators.patternValidator(/[A-Z]/, {
      hasCapitalCase: true
    }),
    // check whether the entered password has a lower case letter
    CustomsValidators.patternValidator(/[a-z]/, {
      hasSmallCase: true
    }),
    Validators.minLength(8)
  ]));
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
const newEmail = new FormControl('', [Validators.required, CustomValidators.email]);
const confirmEmail = new FormControl('', [Validators.required, CustomValidators.equalTo(newEmail)]);

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    user: any;
    public personalForm: FormGroup;
    public resetPasswordForm: FormGroup;
    public securityQuestionForm: FormGroup;
    public updateEmailForm: FormGroup;
    isSpinnerVisible = false;
    titles: any;
    roles: any;
    sectors: any;
    provinces: any;
    securityQuestions: any;
    communicationTypes: any;
    organizationTypes: any;
    secq1: any;
    secq2: any;
    secq3: any;
    answ1: any;
    answ2: any;
    answ3: any;
    hasError = false;
    comType: any;
    orgtype: any;
    sector: any;
    selectedOrg: any;
    selectedSector: any;
    comMode: any;
    roleInfoTab = true;
    personalInfoTab = false;
    updatePasswordTab = false;
    updateSecurityTab = false;
    updateEmailTab = false;
    deactivateAccountTab = false;
    document = false;
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    newEmail = '';
    confirmEmail = '';
    hide1 = true;
    hide2 = true;
    hide3 = true;
    userRoles;
    userPrimaryRole;
    url: any = '';
    tableColumns: string[] = ['userRoleName', 'userProvinceName', 'sectionName', 'isActive'];
    uploadedFileName = 'Upload document';
    fileToUpload: File = null;
    supportingDoc;
    documentTypes: any;
    roleId: any;
    multipleProvinceSelection: Boolean = false;
    onlyOneProvinceSelected: Boolean = false;
    userMetaData: any;
    constructor(private restService: RestcallService, private snackbar: SnackbarService,
                private fb: FormBuilder, public dialog: MatDialog, private router: Router,
                public searchService: SearchService, private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.user = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO));
        // console.log(this.user);
        this.userRoles = this.user.userRoles;
        this.loadInitials();
        this.getProfileImage();
        this.getDocumentData();

        this.personalForm = this.fb.group({
            title: [this.user.titleItemId, Validators.required],
            firstName: [this.user.firstName, Validators.required],
            surname: [this.user.surname, Validators.required],
            email: [this.user.email, Validators.required],
            organisation: [this.user.userProfile.organizationTypeItemId, Validators.required],
            sector: [this.user.userProfile.sectorItemId, Validators.required],
            mobileNo: [this.user.mobileNo, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'),
                Validators.minLength(10)])],
            telephoneNo: [this.user.telephoneNo, Validators.compose([Validators.pattern('^[0-9]+$')])],
            add1: ['', Validators.required],
            add2: ['', Validators.required],
            add3: [''],
            postalCode: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$'),
                Validators.minLength(4), Validators.maxLength(4)])],
            modeOfCommunication: ['', Validators.required],
            subscribeEvents: [],
            subscribeNews: [],
            subscribeNotifications: []
        });
        this.resetPasswordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            password: password,
            confirmPassword: confirmPassword
        });
        this.securityQuestionForm = this.fb.group({
            ans1: ['', Validators.required],
            ans2: ['', Validators.required],
            ans3: ['', Validators.required],
            ques1: ['', Validators.required],
            ques2: ['', Validators.required],
            ques3: ['', Validators.required],
        });
        this.updateEmailForm = this.fb.group({
            email: [this.user.email, Validators.compose([Validators.required, CustomValidators.email])],
            newEmail: newEmail,
            confirmEmail: confirmEmail
        });
    }

    onFileChange(event: any) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            this.fileToUpload = event.target.files;
            this.uploadedFileName = event.target.files[0]['name'];
            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (ev: any) => { // called once readAsDataURL is completed
                this.url = ev.target.result;
            };
            this.updateProfileImge();
            }
        }

    updateProfileImge() {
        const formData: FormData = new FormData();
        formData.append('image', this.fileToUpload[0]);
        this.restService.updateProfileImage(formData).subscribe(response => {
           this.searchService.getProfileImage();
        });
    }

    getProfileImage() {
        this.restService.getProfileImage().subscribe(response => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = (_event) => {
                this.url = reader.result;
                this.searchService.userProfileImage = this.url;
            };
        });
    }

    // openDialog(): void {
    //     const dataInput: any = this.provinces.map((p: any) => {
    //         return {
    //             'provinceCode': p.code,
    //             'provinceName': p.name
    //         };
    //     });
    //     const dialogRef = this.dialog.open(AddProvinceDialogComponent, {
    //         width: '250px',
    //         data: {provinces: dataInput}
    //     });
    //
    //     dialogRef.afterClosed().subscribe(async (resultCode) => {
    //         if (resultCode !== undefined) {
    //             await this.addExternalRole(resultCode);
    //         }
    //     });
    // }

    // async addExternalRole(selectedProvinceCode: string) {
    //     this.isSpinnerVisible = true;
    //     let sameProvince = false;
    //
    //     this.userRoles.forEach((role) => {
    //         if (role.USERPROVINCECODE === selectedProvinceCode) {
    //             sameProvince = true;
    //         }
    //     });
    //     if (sameProvince) {
    //         this.isSpinnerVisible = false;
    //         this.snackbar.openSnackBar('Province already Exists', 'Error');
    //         return;
    //     }
    //     const newExternalRoleInput = {
    //         usercode: this.user.userCode,
    //         username: this.user.userName,
    //         rolecode: this.user.roles[0].USERROLECODE,
    //         rolename: this.user.roles[0].USERROLENAME,
    //         provincecode: selectedProvinceCode,
    //         provincename: this.provinces.filter(p => p.code === selectedProvinceCode)[0].name
    //     };
    //     try {
    //         await this.restService.registerNewExternalRole(newExternalRoleInput).toPromise();
    //         this.user = await this.restService.getUserInfoByEmail(this.user.email).toPromise();
    //         sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(this.user));
    //         this.roles = this.userRoles;
    //         this.isSpinnerVisible = false;
    //         this.snackbar.openSnackBar('success Save Province', 'Success');
    //     } catch (error) {
    //         this.snackbar.openSnackBar('Error while adding new province. Try again', 'Error');
    //         this.isSpinnerVisible = false;
    //     }
    // }

    changeTab(tabName: string) {
        if (tabName === 'roleInfoTab') {
            this.roleInfoTab = true;
            this.personalInfoTab = false;
            this.updatePasswordTab = false;
            this.updateSecurityTab = false;
            this.updateEmailTab = false;
            this.deactivateAccountTab = false;
            this.document = false;
        }
        if (tabName === 'personalInfoTab') {
            this.roleInfoTab = false;
            this.personalInfoTab = true;
            this.updatePasswordTab = false;
            this.updateSecurityTab = false;
            this.updateEmailTab = false;
            this.deactivateAccountTab = false;
            this.document = false;
        }
        if (tabName === 'updatePasswordTab') {
            this.roleInfoTab = false;
            this.personalInfoTab = false;
            this.updatePasswordTab = true;
            this.updateSecurityTab = false;
            this.updateEmailTab = false;
            this.deactivateAccountTab = false;
            this.document = false;
        }
        if (tabName === 'updateSecurityTab') {
            this.roleInfoTab = false;
            this.personalInfoTab = false;
            this.updatePasswordTab = false;
            this.updateSecurityTab = true;
            this.updateEmailTab = false;
            this.deactivateAccountTab = false;
            this.document = false;
        }
        if (tabName === 'updateEmailTab') {
            this.roleInfoTab = false;
            this.personalInfoTab = false;
            this.updatePasswordTab = false;
            this.updateSecurityTab = false;
            this.updateEmailTab = true;
            this.deactivateAccountTab = false;
            this.document = false;
        }
        if (tabName === 'deactivateAccountTab') {
            this.roleInfoTab = false;
            this.personalInfoTab = false;
            this.updatePasswordTab = false;
            this.updateSecurityTab = false;
            this.updateEmailTab = false;
            this.deactivateAccountTab = true;
            this.document = false;
        }
        if (tabName === 'document') {
            this.roleInfoTab = false;
            this.personalInfoTab = false;
            this.updatePasswordTab = false;
            this.updateSecurityTab = false;
            this.updateEmailTab = false;
            this.deactivateAccountTab = false;
            this.document = true;
        }
    }

    getSecurityQuestions() {
        this.loaderService.display(true);
        this.restService.getSecurityInfoByEmail(this.user.email).subscribe(res => {
            if (res.code === 50000) {
                this.loaderService.display(false);
              this.snackbar.openSnackBar(res.data, 'Error');
              return;
            }
            if (res.data != null) {
                const userSecq1 = res.data.securityQuestionTypeItemId1,
                  userSecq2 = res.data.securityQuestionTypeItemId2,
                  userSecq3 = res.data.securityQuestionTypeItemId3;
                this.securityQuestionForm.patchValue({
                    ques1: userSecq1,
                    ques2: userSecq2,
                    ques3: userSecq3,
                });
            }
            this.loaderService.display(false);

          }, error => {
            this.snackbar.openSnackBar('An error occurred while retrieving user info', 'Error');
            this.loaderService.display(false);
          });
    }

    loadInitials() {
        this.isSpinnerVisible = true;
        return forkJoin(
            [this.restService.getSectors(),
                this.restService.getSecurityQuestions(),
                this.restService.getProvinces(),
                this.restService.getOrganizations(),
                this.restService.getCommModes(),
                this.restService.getTitles(),
                this.restService.getUserRole(this.user.userId),
                this.restService.getRoles('EXTERNAL'),
                this.restService.getUserMetaData(this.user.userId),
            ]
        ).subscribe(([sectors, secQuestions, provinces, orgTypes, commTypes, titles, userrole, roles, userMetaData]) => {
                this.sectors = sectors.data;
                this.provinces = provinces.data;
                this.securityQuestions = secQuestions.data;
                this.communicationTypes = commTypes.data;
                // console.log(this.communicationTypes);
                this.organizationTypes = orgTypes.data;
                this.titles = titles.data;
                this.roles = roles.data;
                this.userRoles = userrole.data;
                this.userMetaData = userMetaData.data;
            if (this.userMetaData !== null) {
                this.personalForm.patchValue({
                    add1: this.userMetaData.postalAddressLine1,
                    add2: this.userMetaData.postalAddressLine2,
                    add3: this.userMetaData.postalAddressLine3,
                    postalCode: this.userMetaData.postalCode,
                    modeOfCommunication: this.userMetaData.communicationTypeItemId,
                    subscribeEvents: this.userMetaData.subscribeEvents === 1 ,
                    subscribeNews: this.userMetaData.subscribeNews === 1,
                    subscribeNotifications: this.userMetaData.subscribeNotifications === 1
                });
            }

                // console.log(this.userMetaData);
                // this.userPrimaryRole = userrole.data.filter(x => x.isPrimary === 1);
                // this.roleId = this.userPrimaryRole[0].roleId;
                // for (let p = 0; p < this.provinces.length; p++) {
                //     this.provinces[p].isSelected = this.userPrimaryRole
                //         .filter(x => x.provinceId === this.provinces[p].provinceId).length > 0;
                //     this.provinces[p].userRoleId = userrole.data.filter(x => x.provinceId === this.provinces[p].provinceId).length > 0
                //         ? userrole.data.filter(x => x.provinceId === this.provinces[p].provinceId)[0].userRoleId : null;
                // }
                this.setProvinceUserRole(userrole);
                this.multipleProvinceSelection = !(this.roleId === 21 || this.roleId === 16);
                this.isSpinnerVisible = false;
                this.getSecurityQuestions();
            },
            error => {
                this.isSpinnerVisible = false;
                this.snackbar.openSnackBar('Unknown error while retreiving user information.', 'Error');
            });
    }

    saveProfile() {
        if (this.personalForm.valid) {
             this.isSpinnerVisible = true;
                const payload = this.getBasicUserInformationPayload();
                this.setUpdatedMetadataPayload();
                forkJoin([
                    this.restService.updateProfile(payload),
                    this.restService.saveUserMetaData(this.userMetaData),
                ]).subscribe(([userBasic, userMetaData]) => {
                        this.restService.getUserByEmail(this.user.email).subscribe(user => {
                            this.user = user.data;
                            sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(this.user));
                            this.isSpinnerVisible = false;
                            this.snackbar.openSnackBar('Personal information saved successfully', 'Success');
                        }, error => {
                            this.snackbar.openSnackBar('error to fetch user information', 'warning');
                        });

                }, error => {
                    this.snackbar.openSnackBar('Personal information save failed', 'error');
                });
            } else {
            this.snackbar.openSnackBar('please fill all details', 'warning');
        }

    }

    // checkUpdate(id: number) {
    //     switch (id) {
    //         case 1:
    //             this.user.subscribeNews =
    //                 this.user.subscribeNews === 'Y' ? 'N' : 'Y';
    //             break;
    //         case 2:
    //             this.user.subscribeEvents =
    //                 this.user.subscribeEvents === 'Y' ? 'N' : 'Y';
    //             break;
    //         case 3:
    //             this.user.subscribeNotifications =
    //                 this.user.subscribeNotifications === 'Y' ? 'N' : 'Y';
    //             break;
    //     }
    // }

    updatePassword() {
        this.isSpinnerVisible = true;
        const payload = {
            email: this.user.email,
            oldPassword: this.resetPasswordForm.value.currentPassword,
            newPassword: this.resetPasswordForm.value.password
        };

            this.restService.updatePassword(payload).subscribe(data => {
                    this.snackbar.openSnackBar('Password Updated Successfully', 'Success');
                    sessionStorage.setItem('password', this.newPassword);
                    this.resetPasswordForm.reset(this.resetPasswordForm.value);
                    this.isSpinnerVisible = false;
                },
                error => {
                    this.snackbar.openSnackBar('Error Occurred on Reset Password', 'Error');
                    this.isSpinnerVisible = false;
                });

    }

    updateSecurityQuestions() {

        if (this.hasError || !this.securityQuestionForm.valid) {
            this.snackbar.openSnackBar('Resolve Errors and submit again', 'Error');
            return;
        }
        this.isSpinnerVisible = true;
        const questionUpdateInput = {
            securityAnswer1: this.securityQuestionForm.value.ans1,
            securityAnswer2: this.securityQuestionForm.value.ans2,
            securityAnswer3: this.securityQuestionForm.value.ans3,
            securityQuestionTypeItemId1: this.securityQuestionForm.value.ques1,
            securityQuestionTypeItemId2: this.securityQuestionForm.value.ques2,
            securityQuestionTypeItemId3: this.securityQuestionForm.value.ques3,
            userId: this.user.userId
        };

        this.restService.updateSecurityQuestions(questionUpdateInput).subscribe(data => {
                // sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(this.user));
                this.isSpinnerVisible = false;
                this.snackbar.openSnackBar('Security Questions Updated Successfully', 'Success');
            },
            error => {
                this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
                this.isSpinnerVisible = false;
            });
    }

    updateEmail() {
        this.isSpinnerVisible = true;
        const payload = {
            userId: this.user.userId,
            oldEmail: this.user.email,
            newEmail: this.updateEmailForm.value.newEmail
        };
        this.restService.updateExternalUserEmail(payload).subscribe(data => {
            this.user.email = payload.newEmail;
            this.user.userName = payload.newEmail;
            this.updateEmailForm.patchValue({
                email: payload.newEmail
            });
            sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(this.user));
            // this.updateEmailForm.reset();
            this.isSpinnerVisible = false;
            this.snackbar.openSnackBar('Email Updated Successfully', 'Success');
        }, error => {
            this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
            this.isSpinnerVisible = false;
        });
    }

    onOrgChange() {
        this.user.orgCode = this.selectedOrg.itemCode;
        this.user.orgName = this.selectedOrg.caption;
    }

    onSectorChange() {
        this.user.sectorCode = this.selectedSector.itemCode;
        this.user.sectorName = this.selectedSector.caption;
    }

    onModeChange() {
        this.user.communicationModeCode = this.comMode.itemCode;
        this.user.communicationModeName = this.comMode.caption;
    }

    onSecqChange() {
        if (this.securityQuestionForm.value.ques1 !== this.securityQuestionForm.value.ques2
            && this.securityQuestionForm.value.ques2 !== this.securityQuestionForm.value.ques3
            && this.securityQuestionForm.value.ques3 !== this.securityQuestionForm.value.ques1) {
            this.hasError = false;
        } else {
            this.snackbar.openSnackBar('Each security question needs to be unique', 'Warning');
            this.hasError = true;
        }
    }

    deActivate() {
        this.isSpinnerVisible = true;
        const payload = {username: this.user.userName, password: this.currentPassword};
        this.restService.login(payload).subscribe(res => {
            if (res.code === 50000) {
                this.snackbar.openSnackBar(res.msg, 'Error');
                this.isSpinnerVisible = false;
                return;
            } else {
                this.restService.changeUserStatus('INACTIVE', this.user.userId).subscribe(data => {
                    this.isSpinnerVisible = false;
                    this.snackbar.openSnackBar('Account Deactivated', 'Success');
                    sessionStorage.clear();
                    this.router.navigate(['/']);
                }, error => {
                    this.isSpinnerVisible = false;
                    this.snackbar.openSnackBar('Error Deactivating account', 'Error');
                });
            }
        }, error => {
            this.isSpinnerVisible = false;
            this.snackbar.openSnackBar('User password not matched', 'Error');
        });
    }

    close() {
        this.router.navigate(['/home']);
    }

    getDocumentData() {
        this.loaderService.display(true);
        this.restService.getListItems(181).subscribe(response => {
            this.documentTypes = response.data;
            this.getUserDocuments(this.user.userId);
            this.loaderService.display(true);
        });
    }

    getUserDocuments(userId: any) {
        this.loaderService.display(true);
        this.restService.getUserDocuments('USER_REGISTRATION_DOCUMENT', userId).subscribe((res: any) => {
            this.supportingDoc = res.data;
            // console.log(this.supportingDoc);
            for (let i = 0; i < this.supportingDoc.length; i++) {
                this.supportingDoc[i].DocumentType
                    = this.documentTypes.filter(x => x.itemId === this.supportingDoc[i].documentTypeId).length > 0 ?
                      this.documentTypes.filter(x => x.itemId === this.supportingDoc[i].documentTypeId)[0].caption : '';
            }
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    addMultipleProvinceForRole() {
       const observables: Array<any> = [];
       const selectedProvinces = this.provinces.filter(x => x.isSelected === true );
       for (let i = 0; i < selectedProvinces.length; i++ ) {
           if (this.userRoles[i] !== undefined) {
               this.userRoles[i].provinceId = selectedProvinces[i].provinceId;
           } else {
               this.userRoles.push(this.getUserPayload(selectedProvinces[i].provinceId));
           }
           observables.push(this.restService.saveUserRole(this.userRoles[i]));
        }

        // After save need to update local storage
        forkJoin(observables).subscribe(async ([response, response2]) => {
            // console.log('response', response);
            this.snackbar.openSnackBar('provinces updated successfully ', 'Success');
        }, error => {
            this.isSpinnerVisible = false;
            this.snackbar.openSnackBar('Error while updating role', 'Error');
        });
    }

    getUserPayload(provinceID) {
        return {
            isPrimary: 1,
            provinceId: provinceID,
            provinceName: null,
            roleId: this.roleId,
            roleName: null,
            sectionItemId: null,
            sectionName: null,
            userId: this.user.userId,
            userRoleId: 0
        };
    }

    updateExternalRole(val) {

        const selectedProvinces = this.provinces.filter(x => x.isSelected === true);
        if (selectedProvinces.length === 1) {
            this.onlyOneProvinceSelected = true;
        } else {
            this.onlyOneProvinceSelected = false;
        }

        if (val.isSelected) {
            this.restService.saveUserRole(this.getUserPayload(val.provinceId)).subscribe((res: any) => {
                this.snackbar.openSnackBar(`Role updated Successfully`, 'Success');

            }, error => {
                this.loaderService.display(false);
            });
        } else {
            const id = this.userRoles.filter(x => x.provinceId === val.provinceId)[0].userRoleId;

            this.restService.deleteUserRole(id).subscribe((res: any) => {
                if (res.code === 50000) {
                    this.snackbar.openSnackBar(`Error occured`, 'Error');
                    this.loaderService.display(false);
                } else {
                    this.snackbar.openSnackBar(`Role province assignement deleted`, 'Success');
                    this.getUserRoles();
                    this.loaderService.display(false);

                }
            }, error => {
                this.loaderService.display(false);
            });
        }
    }

    getUserRoles() {
        this.restService.getUserRole(this.user.userId).subscribe(res => {
            this.setProvinceUserRole(res);
        }, error => {

        });
    }

    private setProvinceUserRole(res) {
        this.userRoles = res.data;
        this.userPrimaryRole = res.data.filter(x => x.isPrimary === 1);
        if (this.userPrimaryRole.length > 0) {
            this.roleId = this.userPrimaryRole[0].roleId;
            for (let p = 0; p < this.provinces.length; p++) {
                this.provinces[p].isSelected = this.userRoles
                    .filter(x => x.provinceId === this.provinces[p].provinceId).length > 0;
                // this.provinces[p].userRoleId = res.data.filter(x => x.provinceId === this.provinces[p].provinceId).length > 0
                //     ? res.data.filter(x => x.provinceId === this.provinces[p].provinceId)[0].userRoleId : null;
            }
        }
    }

    private getBasicUserInformationPayload() {
        return {
            userId: this.user.userId,
            userCode: this.user.userCode,
            userName: this.user.userName,
            userType: this.user.userType,
            firstName: this.personalForm.value.firstName,
            surname: this.personalForm.value.surname,
            mobileNo: this.personalForm.value.mobileNo,
            telephoneNo: this.user.telephoneNo,
            email: this.user.email,
            statusId: this.user.statusId,
            status: this.user.status,
            createdDate: this.user.createdDate,
            countryCode: this.user.countryCode,
            titleItemId: this.personalForm.value.title,
            title: this.titles.filter(x => x.itemId === this.personalForm.value.title)[0].caption,
            provinceId: this.user.provinceId,
            province: this.user.province

        };
    }

    private setUpdatedMetadataPayload() {
        this.userMetaData.organizationTypeItemId = this.personalForm.value.organisation;
        this.userMetaData.sectorItemId = this.personalForm.value.sector;
        this.userMetaData.communicationTypeItemId = this.personalForm.value.modeOfCommunication;
        this.userMetaData.postalAddressLine1 = this.personalForm.value.add1;
        this.userMetaData.postalAddressLine2 = this.personalForm.value.add2;
        this.userMetaData.postalAddressLine3 = this.personalForm.value.add3;
        this.userMetaData.postalCode = this.personalForm.value.postalCode;
        this.userMetaData.subscribeNews = this.personalForm.value.subscribeNews ? 1 : 0;
        this.userMetaData.subscribeEvents = this.personalForm.value.subscribeEvents ? 1 : 0;
        this.userMetaData.subscribeNotifications = this.personalForm.value.subscribeNotifications ? 1 : 0;
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

}



