import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { ImageTransform } from 'ngx-image-cropper';
import * as constants from '../constants/localstorage-keys';
import { SearchService } from '../search/search-page/search.service';
import { LoaderService } from '../services/loader.service';
import {RestcallService} from '../services/restcall.service';
import {SnackbarService} from '../services/snackbar.service';
import { ProfileImageDialogComponent } from './profile-image/profile-image.modal';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
    data: any;

    firstName = '';
    lastName = '';
    email = '';
    mobileNo = '';
    role = '';
    url: any = '';
    roles: [];

    personalInfo = true;
    roleInfo = false;
    document = false;
    tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
    dataSource;
    panelOpenState = false;
    uploadedFileName = 'Upload document';
    fileToUpload: File = null;
    supprotingDoc;
    documentTypes: any;
    moreInformationForm: FormGroup;
    userId: any;
    userData: any[] = [];
    constructor(private snackbar: SnackbarService, public dialog: MatDialog, private fb: FormBuilder,
                private router: Router, private restCallService: RestcallService,
                public searchService: SearchService, private loaderService: LoaderService) {
                    this.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
                    this.moreInformationForm = this.fb.group({
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
    }

    ngOnInit(): void {
        this.loadUser();
        this.getProfileImage();
        this.getDocumentData();
        this.getUserMetaData();
    }


    getUserMetaData() {
        this.restCallService.getUserMetaData(this.userId).subscribe((res: any) => {
            this.moreInformationForm.patchValue({
                'alternativeEmail': res.data.alternativeEmail,
                'communicationTypeItemId': res.data.communicationTypeItemId,
                'createdDate': res.data.createdDate,
                'organizationTypeItemId': res.data.organizationTypeItemId,
                'postalAddressLine1': res.data.postalAddressLine1,
                'postalAddressLine2': res.data.postalAddressLine2,
                'postalAddressLine3': res.data.postalAddressLine3,
                'postalCode': res.data.postalCode,
                'ppnNo': res.data.ppnNo,
                'practiseName': res.data.practiseName,
                'sectorItemId': res.data.sectorItemId,
                'subscribeEvents': res.data.subscribeEvents,
                'subscribeNews': res.data.subscribeNews,
                'subscribeNotifications': res.data.subscribeNotifications,
                'userCode': res.data.userCode,
                'userID': res.data.userID,
                'userMetaDataId': res.data.userMetaDataId,
                'securityAnswer1': res.data.securityAnswer1,
                'securityAnswer2': res.data.securityAnswer2,
                'securityAnswer3': res.data.securityAnswer3,
                'securityQuestionItemId1': res.data.securityQuestionItemId1,
                'securityQuestionItemId2': res.data.securityQuestionItemId2,
                'securityQuestionItemId3': res.data.securityQuestionItemId3
              });
        });
    }

    updateUserMetaData() {
        this.loaderService.display(true);
        this.moreInformationForm.patchValue({
            'subscribeEvents': this.moreInformationForm.value.subscribeEvents === true ? 1 : 0,
            'subscribeNews': this.moreInformationForm.value.subscribeNews === true ? 1 : 0,
            'subscribeNotifications': this.moreInformationForm.value.subscribeNotifications === true ? 1 : 0,
        });
        this.restCallService.saveUserMetaData(this.moreInformationForm.value).subscribe(data => {
            this.snackbar.openSnackBar('User meta data Updated Successfully', 'Success');
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error while updating. Try again', 'Error');
        });
    }

    async loadUser() {
        this.data = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO));
        const roleInfo = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINTERNALROLESINFO));

        this.firstName = this.data.firstName;
        this.lastName = this.data.surname;
        this.email = this.data.email;
        this.mobileNo = this.data.mobileNo;
        this.role = roleInfo.userRoleName;
        this.dataSource = this.data.userRoles;
    }

    onSubmit() {
        this.restCallService.updateInternalUser(this.data).subscribe((data) => {
            this.snackbar.openSnackBar('Information updated succesfully', 'Success');
        }, error => {
            this.snackbar.openSnackBar('Error updating information', 'Error');
        });
    }

    changeTab(tabName: string) {
        if (tabName === 'personalInfo') {
            this.personalInfo = true;
            this.roleInfo = false;
            this.document = false;
        }
        if (tabName === 'roleInfo') {
            this.personalInfo = false;
            this.roleInfo = true;
            this.document = false;
        }
        if (tabName === 'document') {
            this.personalInfo = false;
            this.roleInfo = false;
            this.document = true;
        }
    }

    close() {
        this.router.navigate(['/home']);
    }

    getProfileImage() {
        this.loaderService.display(true);
        this.restCallService.getProfileImage().subscribe(response => {
            const reader = new FileReader();
            reader.readAsDataURL(response);
            reader.onload = (_event) => {
                this.url = reader.result;
            };
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }


    getDocumentData() {
        this.loaderService.display(true);
        this.restCallService.getListItems(181).subscribe(response => {
            this.documentTypes = response.data;
            this.getUserDocuments(this.data.userId);
            this.loaderService.display(true);
        });
    }

    getUserDocuments(userId: any) {
        this.loaderService.display(true);
        this.restCallService.getUserDocuments('USER_REGISTRATION_DOCUMENT', userId).subscribe((res: any) => {
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

    openDialog() {
        const dialogRef = this.dialog.open(ProfileImageDialogComponent, {
            width: '48%',
            height: '68%'
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getProfileImage();
        });
    }
}
