import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CustomValidators} from 'ng2-validation';
import {forkJoin} from 'rxjs';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {SearchService} from '../search.service';
import {ConfirmDailogComponent} from './confirm-dialog';
import * as enums from '../../constants/enums';
import {StorageConstants} from '../../constants/storage-keys';
import {LoaderService} from '../../services/loader.service';

@Component({
    selector: 'app-delivery-page',
    templateUrl: './delivery-page.component.html',
    styleUrls: ['./delivery-page.component.css']
})
export class DeliveryPageComponent implements OnInit {
    // provinceName = JSON.parse(sessionStorage.getItem('userInternalRolesInfo')).userProvinceName;
    isSpinnerVisible = false;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
    selectedModes;
    deliveryMedias;
    cartData;
    selectedMode;
    deliveryMedia;
    ownMedia = false;

    form: FormGroup;
    name = '';
    email = '';
    phone = '';
    add1 = '';
    add2 = '';
    add3 = '';
    collectionAddress;
    referenceNumber = '';
    workflowId;
    documentsArr: any[] = [];
    selectedDocument = '134';
    fileToUpload: File = null;
    comment: any = '';
    uploadedFileName = 'Upload document';
    triggerPayload: any;
    deliveryMediasdata;
    // deliveryForm: FormGroup;
    addressForm: FormGroup;
    isElectronicOnly: any = 0;
    requestorData: any;
    requesterType: any = 447;
    postalCode = '';
    fax: any = '';
    constructor(public dialog: MatDialog, private fb: FormBuilder, private searchService: SearchService,
                private router: Router, private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
        if (this.router.getCurrentNavigation().extras.state !== undefined) {
            this.requestorData = this.router.getCurrentNavigation().extras.state.reqData;
        }

        // this.deliveryForm = this.fb.group({
        //     processid: 1,
        //     provinceid: 2,
        //     loggeduserid: this.userId,
        //     notes: 'This is test', // TODO:bind data from input form
        //     context: this.provinceName, // TODO: bind data from input form
        //     type: 1, // TODO:bind data from input form
        //     processdata: 'Some very large data'// TODO:bind data from input form
        // });

        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, CustomValidators.email])],
            phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
            add1: ['', Validators.required],
            add2: [''],
            add3: [''],
            postalCode: ['', Validators.required]
        });

        if (this.requestorData !== undefined) {
            this.form = this.fb.group({
                name: this.requestorData.requesterDetails.requesterName + ' ' + this.requestorData.requesterDetails.requesterSurame,
                email: this.requestorData.requesterDetails.email,
                phone: this.requestorData.requesterDetails.contactNo,
                add1: this.requestorData.requesterDetails.addressLine1,
                add2: this.requestorData.requesterDetails.addressLine2,
                add3: this.requestorData.requesterDetails.addressLine3,
                postalCode: this.requestorData.requesterDetails.postalCode
            });
        }
    }

    ngOnInit() {
        // this.isSpinnerVisible = true;
        this.loaderService.display(true);
        forkJoin([
            this.restService.getListItems(16),
            this.restService.getListItems(18)
        ]).subscribe(([method, media]) => {
            this.selectedModes = method.data;
            this.selectedMode = method.data[0];
            this.deliveryMedias = media.data;
            if (this.selectedMode.caption === 'ELECTRONIC') {
                this.deliveryMediasdata = [];
                for (let i = 0; i < this.deliveryMedias.length; i++) {
                    if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                        this.deliveryMediasdata.push(this.deliveryMedias[i]);
                    }
                }
            } else {
                this.deliveryMediasdata = [];
                for (let i = 0; i < this.deliveryMedias.length; i++) {
                    if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                    } else {
                        this.deliveryMediasdata.push(this.deliveryMedias[i]);
                    }
                }
            }
            this.deliveryMedia = media.data[0];
            // this.isSpinnerVisible = false;
            this.loaderService.display(false);
        });
        this.restService.getCartDetails(this.userId).subscribe(response => {
            this.cartData = response.data;
            this.getAddressBasedOnProvinceId();
            const arr = [];
                const data = response.data.cartStageData;
                for (const x of data) {
                    const json = x.jsonData;
                    const payload = {
                        cartId: x.cartId,
                        dataKey: x.dataKey,
                        dataKeyValue: x.dataKeyValue,
                        dated: x.dated,
                        id: x.id,
                        jsonData: JSON.parse(json.replace(/\\|/g, '')),
                        provinceId: x.provinceId,
                        searchTypeId: x.searchTypeId,
                        userId: x.userId,
                    };
                    if (payload.jsonData.cartData.diagrams === true) {
                        this.isElectronicOnly = this.isElectronicOnly +
                                                payload.jsonData.cartData.diagramsData.filter(d =>
                                                    d.format.caption !== 'SOFT/ ELECTRONIC').length; // && d.type.caption !== 'TIF').length;
                    }
                    if (payload.jsonData.cartData.general === true) {
                        this.isElectronicOnly = this.isElectronicOnly +
                                                payload.jsonData.cartData.generalData.filter(d =>
                                                    d.format.caption !== 'SOFT/ ELECTRONIC').length; // && d.type.caption !== 'TIF').length;
                    }
                    arr.push(payload);
                }
                // if (this.isElectronicOnly == 0) {
                //     this.selectedModes = this.selectedModes.filter(x => x.caption === 'ELECTRONIC');
                //     this.selectedMode = this.selectedModes[0];
                //     this.deliveryMediaChange(this.selectedMode);
                // }
                const reqVal =  arr.filter(x => x.jsonData.requesterDetails !== undefined).length > 0 ?
                (arr.filter(x => x.jsonData.requesterDetails.requesterType !== '')[0] !== undefined ?
                arr.filter(x => x.jsonData.requesterDetails.requesterType !== '')[0].jsonData.requesterDetails :
                undefined) : undefined;
                if (reqVal !== undefined) {
                    this.requesterType = reqVal.requesterType;
                    this.name = reqVal.requesterDetails.firstName + ' ' + reqVal.requesterDetails.surName;
                    this.email = reqVal.requesterDetails.email;
                    this.phone = reqVal.requesterDetails.contactNo;
                    this.add1 = reqVal.requesterDetails.addressLine1;
                    this.add2 = reqVal.requesterDetails.addressLine2;
                    this.add3 = reqVal.requesterDetails.addressLine3;
                    this.postalCode = reqVal.requesterDetails.postalCode;
                    this.fax = reqVal.requesterDetails.fax;
                } else {
                    this.requesterType = 447;
                    this.name = this.loggedUserData.firstName + ' ' + this.loggedUserData.surname;
                    this.email = this.loggedUserData.email;
                    this.phone = this.loggedUserData.mobileNo;
                    this.add1 = this.loggedUserData.postalAddrLine1;
                    this.add2 = this.loggedUserData.postalAddrLine2;
                    this.add3 = this.loggedUserData.postalAddrLine3;
                    this.postalCode = this.loggedUserData.postalCode;
                }
            // this.isSpinnerVisible = false;
            this.loaderService.display(false);
        });
        this.getDocumentsList();
    }

    getAddressBasedOnProvinceId() {
        this.restService.getAddressBasedOnProvinceId(this.cartData.provinceId).subscribe(payload => {
            this.collectionAddress = payload.data.provinceAddress;
        });
    }

    getDocumentsList() {
        this.restService.getListItems(enums.list_master.DOCUMENTFORMAT).subscribe(payload => {
            this.documentsArr = payload.data;
        });
    }

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    checkout() {
        // this.isSpinnerVisible = true;
        if (this.selectedMode.caption === 'COURIER' && this.form.invalid) {
            this.form.get('name').markAsTouched();
            this.form.get('email').markAsTouched();
            this.form.get('add1').markAsTouched();
            this.form.get('phone').markAsTouched();
            this.form.get('postalCode').markAsTouched();
            // this.isSpinnerVisible = false;
            return;
        } else {
            const addressData = {
                selectedMode: this.selectedMode,
                deliveryMedia: this.deliveryMedia,
                name: this.name,
                email: this.email,
                phone: this.phone,
                add1: this.add1,
                add2: this.add2,
                add3: this.add3,
                postalCode: this.postalCode,
                ownMedia: this.ownMedia,
                collectionAddress: this.collectionAddress
            };
            this.setRequestorData();
            // const requestorData = {
            //     userId: this.userId,
            //     provinceCode: this.cartData.provinceId
            // };
            const payload = {
                // addressData: addressData != null ? JSON.stringify(addressData) : '',
                requesterInformation: JSON.stringify(this.requestorData),
                cartId: this.cartData.cartId
            };
            this.loaderService.display(true);
            this.restService.updateCart(payload).subscribe(response => {
                this.assignRequest();
                // this.loaderService.display(false);
            }, error => {
                this.loaderService.display(false);
            });
        }

    }

    openDialog(requestCode, workflowId): void {

        if (this.fileToUpload != null && this.selectedDocument !== undefined && this.comment !== undefined) {
            const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
            const formData: FormData = new FormData();
            formData.append('file', this.fileToUpload[0]);
            formData.append('documentType', this.selectedDocument);
            formData.append('comment', this.comment);
            formData.append('userId', uid);
            formData.append('workflowId', workflowId);
            this.restService.uploadSupportingDocument(formData).subscribe(payload => {
                this.loaderService.display(false);
                const dialogRef = this.dialog.open(ConfirmDailogComponent, {
                    width: '546px',
                    data: {
                        requestCode: requestCode,
                        workflowId: workflowId
                    }
                });
                dialogRef.afterClosed().subscribe(() => {
                    this.loaderService.display(true);
                    this.restService.notificationForWorkflowRequest({
                        'referenceNo': this.triggerPayload.referenceNo,
                        'templateId': this.triggerPayload.templateId,
                        'transactionId': this.triggerPayload.transactionId,
                        'userId': this.userId,
                        'workflowId': this.triggerPayload.workflowId,
                    }).subscribe(payload1 => {
                        this.loaderService.display(false);
                        this.snackbar.openSnackBar('Delivery details set.', 'Success');
                        this.searchService.trigger();
                        this.router.navigate(['./home']);
                    });
                });
            }, error => {
                this.loaderService.display(false);
                const dialogRef = this.dialog.open(ConfirmDailogComponent, {
                    width: '546px',
                    data: {
                        requestCode: requestCode,
                        workflowId: workflowId
                    }
                });
                dialogRef.afterClosed().subscribe(() => {
                    this.loaderService.display(true);
                    this.restService.notificationForWorkflowRequest({
                        'referenceNo': this.triggerPayload.referenceNo,
                        'templateId': this.triggerPayload.templateId,
                        'transactionId': this.triggerPayload.transactionId,
                        'userId': this.userId,
                        'workflowId': this.triggerPayload.workflowId,
                    }).subscribe(payload1 => {
                        this.loaderService.display(false);
                        this.snackbar.openSnackBar('Delivery details set.', 'Success');
                        this.searchService.trigger();
                        this.router.navigate(['./home']);
                    });
                });
            });
        } else {
            this.loaderService.display(false);
            const dialogRef = this.dialog.open(ConfirmDailogComponent, {
                width: '546px',
                data: {
                    requestCode: requestCode,
                    workflowId: workflowId
                }
            });
            dialogRef.afterClosed().subscribe(() => {
                this.loaderService.display(true);
                this.restService.notificationForWorkflowRequest({
                    'referenceNo': this.triggerPayload.referenceNo,
                    'templateId': this.triggerPayload.templateId,
                    'transactionId': this.triggerPayload.transactionId,
                    'userId': this.userId,
                    'workflowId': this.triggerPayload.workflowId,
                }).subscribe(payload1 => {
                    this.loaderService.display(false);
                    this.snackbar.openSnackBar('Delivery details set.', 'Success');
                    this.searchService.trigger();
                    this.router.navigate(['./home']);
                });
            });

        }

    }

    assignRequest() {
        const obj1 = {
            'processid': (this.isElectronicOnly === 0 && this.selectedMode.caption === 'ELECTRONIC') ? 164 : 1,
            'provinceid': this.cartData.provinceId,
            'loggeduserid': this.userId,
            'notes': this.comment,
            'context': 'This is conext',
            'type': 1,
            'processdata': '{}',
            'parentworkflowid': 0,
            'assignedtouserid': 0
        };
        this.loaderService.display(true);
        this.restService.triggertask(obj1).subscribe(payload => {
            this.referenceNumber = payload.ReferenceNumber;

            // const notification = {
            //     'loggedInUserId': this.userId,
            //     'notifyUserId': this.userId,
            //     'subject': payload.ReferenceNumber,
            //     'description': this.comment,
            //     'contextTypeId': 5054,
            //     'contextId': payload.WorkflowID
            // };
            const obj2 = {
                'cartId': this.cartData.cartId,
                'templateId': payload.TemplateID,
                'transactionId': payload.TransactionId,
                'userId': this.userId,
                'workflowId': payload.WorkflowID
            };
            this.triggerPayload = {
                'referenceNo': payload.ReferenceNumber,
                'templateId': payload.TemplateID,
                'transactionId': payload.TransactionId,
                'userId': this.userId,
                'workflowId': payload.WorkflowID
            };
            this.restService.cartCheckout(obj2).subscribe(checkoutData => {
                // this.isSpinnerVisible = false;
                // this.loaderService.display(false);
                this.isSpinnerVisible = false;
                // this.restService.addUserNotification(notification).subscribe(async (result) => { });
                this.openDialog(payload.ReferenceNumber, payload.WorkflowID);
            }, error => {
                this.loaderService.display(false);
            });

        }, error => {
            this.loaderService.display(false);
        });
    }

    deliveryMediaChange(selectedMode) {
        if (selectedMode.caption === 'ELECTRONIC') {
            this.deliveryMediasdata = [];
            for (let i = 0; i < this.deliveryMedias.length; i++) {
                if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                    this.deliveryMediasdata.push(this.deliveryMedias[i]);
                }
            }
        } else {
            this.deliveryMediasdata = [];
            for (let i = 0; i < this.deliveryMedias.length; i++) {
                if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                } else {
                    this.deliveryMediasdata.push(this.deliveryMedias[i]);
                }
            }
        }
    }

    setRequestorData() {
        const tempName = this.name.split(' ');
        this.requestorData = {
            'userId': this.userId,
            'isMediaToDepartment': this.ownMedia === true ? 1 : 0,
            'requesterType': this.requesterType,
            'deliveryMethod': this.selectedMode.itemId,
            'deliveryMedium': this.deliveryMedia.itemId,
            'requestLoggedBy': {
                'firstName': this.loggedUserData.firstName,
                'surName': this.loggedUserData.surname,
                'contactNo': this.loggedUserData.mobileNo,
                'email': this.loggedUserData.email,
                'fax': '',
                'addressLine1': this.loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': this.loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': this.loggedUserData.userProfile.postalAddressLine3,
                'postalCode': this.loggedUserData.userProfile.postalCode
            },
            'requesterDetails': {
                'firstName': tempName[0],
                'surName': tempName.length > 1 ? tempName[1] : tempName[0],
                'contactNo': this.phone,
                'email': this.email,
                'fax': this.fax,
                'addressLine1': this.add1,
                'addressLine2': this.add2,
                'addressLine3': this.add3,
                'postalCode': this.postalCode
            }
        };
      }
}
