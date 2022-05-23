import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import * as enums from '../../../constants/enums';
import {LoaderService} from '../../../services/loader.service';
import { StorageConstants } from '../../../constants/localstorage-keys';
import { ConfirmDailogComponent } from '../../delivery-page/confirm-dialog';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-search-request-modal',
    templateUrl: './search-request-modal.component.html',
    styleUrls: ['./search-request-modal.component.css']
})
export class SearchRequestModalComponent implements OnInit {

    refNo;
    documentsArr: any[] = [];
    proceed = false;
    selectedDocument = '134';
    fileToUpload: File = null;
    uploadedFileName = 'Upload document';
    comments = '';
    datasource = [];
    searchColumns = ['province', 'searchType', 'searchFilter', 'searchNo'];
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    isSpinnerVisible = false;
    requestorData: any;
    req: any;

    constructor(public dialogRef: MatDialogRef<SearchRequestModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private loaderService: LoaderService,
                public dialog: MatDialog, private fb: FormBuilder) {
    }

    ngOnInit() {
        const processData = {
            'name': JSON.parse(sessionStorage.getItem('userInfo')).firstName + ' ' + JSON.parse(sessionStorage.getItem('userInfo')).surname,
            'email': JSON.parse(sessionStorage.getItem('userInfo')).email
        };
        this.data.processData = processData;
        this.datasource = [{
            province: this.data.province.provinceName,
            searchType: this.data.searchType.name,
            searchFilter: this.data.searchFilter.name,
            searchNo: this.data.searchNumber
        }];
        this.getDocumentsList();
    }

    getDocumentsList() {
        this.restService.getListItems(enums.List_Master.DOCUMENTFORMAT).subscribe(payload => {
            this.documentsArr = payload.data;
        });
    }


    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    submit() {
        this.loaderService.display(true);
        this.data.comment = this.comments;
        this.setRequestorData();
        const payload = {
            processid: 21,
            provinceid: Number(this.data.province.provinceId),
            loggeduserid: this.userId,
            notes: this.comments,
            context: 'context',
            type: 1,
            processdata: JSON.stringify(this.requestorData), // notifyManagerData: this.data}),
            parentworkflowid: 0,
            assignedtouserid: this.userId
        };

        this.restService.triggertask(payload).subscribe(response => {
            this.refNo = response.ReferenceNumber;
            this.req = {
                referenceNo: response.ReferenceNumber,
                templateId: response.TemplateID,
                transactionId: response.TransactionId,
                userId: this.userId,
                workflowId: response.WorkflowID,
            };
            this.restService.notification(this.req).subscribe((res => {
                this.loaderService.display(false);
            }), error => {
                this.loaderService.display(false);
            });
            this.openDialog(response.ReferenceNumber, response.WorkflowID);
            this.dialogRef.close();
        }, error => {
            this.loaderService.display(false);
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
            'notifyManagerData': {
              'provinceName': this.data.province.provinceName,
              'searchType': this.data.searchType.name,
              'searchFilter': this.data.searchFilter.name,
              'searchNumber': this.data.searchNumber,
              'comment': this.comments
            },
            'queryData': null
        };
      }

      openDialog(requestCode, workflowId): void {
        if (this.fileToUpload != null && this.selectedDocument !== undefined && this.comments !== undefined) {
            const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
            const formData: FormData = new FormData();
            formData.append('file', this.fileToUpload[0]);
            formData.append('documentType', this.selectedDocument);
            formData.append('comment', this.comments);
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
                    this.restService.notificationForWorkflowRequest(this. req).subscribe(payload1 => {
                        this.loaderService.display(false);
                    });
                });
            }, error => {
                const dialogRef = this.dialog.open(ConfirmDailogComponent, {
                    width: '546px',
                    data: {
                        requestCode: requestCode,
                        workflowId: workflowId
                    }
                });
                dialogRef.afterClosed().subscribe(() => {
                    this.restService.notificationForWorkflowRequest(this. req).subscribe(payload1 => {
                    });
                });
            });
        } else {
            const dialogRef = this.dialog.open(ConfirmDailogComponent, {
                width: '546px',
                data: {
                    requestCode: requestCode,
                    workflowId: workflowId
                }
            });
            dialogRef.afterClosed().subscribe(() => {
                this.restService.notificationForWorkflowRequest(this. req).subscribe(payload1 => {
                });
            });

        }
    }
}
