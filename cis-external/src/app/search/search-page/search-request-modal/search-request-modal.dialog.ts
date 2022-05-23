import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import * as enums from '../../../constants/enums';
import { StorageConstants } from '../../../constants/storage-keys';
import { LoaderService } from '../../../services/loader.service';
import { ConfirmDailogComponent } from '../../delivery-page/confirm-dialog';

interface DialogData {
    province;
    searchType;
    searchFilter;
    searchNumber;
    processData;
}

@Component({
    selector: 'app-search-request-modal',
    templateUrl: './search-request-modal.dialog.html',
    styleUrls: ['./search-request-modal.dialog.css']
})
export class SearchRequestModalDialogComponent implements OnInit {
    refNo;
    proceed = false;
    documentsArr: any[] = [];
    selectedDocument: string;
    fileToUpload: File = null;
    uploadedFileName = 'Upload document';
    comments = '';
    datasource = [];
    searchColumns = ['province', 'searchType', 'searchFilter', 'searchNo'];
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    isSpinnerVisible = false;
    requestorData: any;
    req: any;
    constructor(public dialogRef: MatDialogRef<SearchRequestModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService,
                private loaderService: LoaderService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        const processData = {
            'name': JSON.parse(sessionStorage.getItem('userInfo')).firstName + ' '
                + JSON.parse(sessionStorage.getItem('userInfo')).surname,
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
        this.restService.getListItems(enums.list_master.DOCUMENTFORMAT).subscribe(payload => {
            this.documentsArr = payload.data;
        });
    }

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }


    submit() {
        this.isSpinnerVisible = true;
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
            assignedtouserid: 0
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
            this.isSpinnerVisible = false;
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
                    this.restService.notificationForWorkflowRequest(this.req).subscribe(payload1 => {
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
                    this.restService.notificationForWorkflowRequest(this.req).subscribe(payload1 => {
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
                this.restService.notificationForWorkflowRequest(this.req).subscribe(payload1 => {
                });
            });

        }
    }
}
