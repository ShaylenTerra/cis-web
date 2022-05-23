import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LodgementPreviewDialogComponent } from '../lodgement/lodgement-draft/lodgement-preview-dialog/lodgement-preview-dialog.component';
import { LoaderService } from '../services/loader.service';
import { RestcallService } from '../services/restcall.service';
import { SnackbarService } from '../services/snackbar.service';
import { ViewReviewInfoComponent } from '../tasks/task-details/view-review-info/view-review-info.component';
import { DispatchDetailDialogComponent } from './dispatch-detail-dialog/dispatch-detail-dialog.component';
import { InforequestitemDialogComponent } from './inforequestitem-dialog/inforequestitem-dialog.component';
import { InvoiceDetailDialogComponent } from './invoice-detail-dialog/invoice-detail-dialog.component';
import { LodgementTaskPreviewComponent } from './lodgement-task-preview/lodgement-task-preview.component';
import { PaymentDetailDialogComponent } from './payment-detail-dialog/payment-detail-dialog.component';
import { RequesterinfoDialogComponent } from './requesterinfo-dialog/requesterinfo-dialog.component';
import { ReservationTransferTaskPreviewComponent } from './reservation-transfer-task-preview/reservation-transfer-task-preview.component';

export interface TaskHistory {
    date: string;
    user: string;
    action: string;
    duration: string;
}

export interface RelatedTasks {
    date: string;
    process: string;
    description: string;
    duration: string;
    action: string;
}

export interface Notes {
    date: string;
    user: string;
    notes: string;
}

export interface Details {
    icon: string;
    item: string;
}

const ELEMENT_DATA: TaskHistory[] = [
    { date: '05/10/2019', user: 'Work Flow User', action: 'Dispatch', duration: 'Pending Since: 2 days' },
    { date: '05/10/2019', user: 'Siphokazi Fezile', action: 'Review Data', duration: '2.12 Hours' },
    { date: '05/10/2019', user: 'Work Flow User', action: 'Payment Confirmation', duration: '0 Minutes' },
    { date: '05/10/2019', user: 'Work Flow User', action: 'Payment Upload', duration: '1 Minute' },
    { date: '05/10/2019', user: 'Siphokazi Fezile', action: 'Generate Invoice', duration: 'Pending Since: 2 days' },
    { date: '05/10/2019', user: 'Siphokazi Fezile', action: 'Information Review', duration: '0 Minutes' },
    { date: '05/10/2019', user: 'Siphokazi Fezile', action: 'Information Request', duration: '1 Minute' }
];

const ELEMENT_DATA_1: RelatedTasks[] = [
    {
        date: '05/10/2019',
        process: 'Department Response REF#482',
        description: 'Archive',
        duration: 'Closed',
        action: 'Open Task'
    },
    {
        date: '05/10/2019',
        process: 'Department Response REF#482',
        description: 'Archive',
        duration: 'Closed',
        action: 'Open Task'
    },
    {
        date: '05/10/2019',
        process: 'Department Response REF#482',
        description: 'Archive',
        duration: 'Closed',
        action: 'Open Task'
    },
    {
        date: '05/10/2019',
        process: 'Department Response REF#482',
        description: 'Archive',
        duration: 'Closed',
        action: 'Open Task'
    },
    {
        date: '05/10/2019',
        process: 'Department Response REF#482',
        description: 'Archive',
        duration: 'Closed',
        action: 'Open Task'
    }
];

const ELEMENT_DATA_2: Notes[] = [
    // {date: '05/10/2019', user: 'Anne Braunstein', notes: 'User1'},
    // {date: '05/10/2019', user: 'Anne Braunstein', notes: 'User1'}
];

@Component({
    selector: 'app-task-profile',
    templateUrl: './task-profile.component.html',
    styleUrls: ['./task-profile.component.css']
})

export class TaskProfileComponent implements OnInit {
    displayedColumns: string[] = ['date', 'user', 'action', 'duration'];
    taskHistoryDataSource = ELEMENT_DATA;

    displayedColumns1: string[] = ['date', 'process', 'description', 'duration', 'action'];
    relatedTasksDataSource = ELEMENT_DATA_1;

    displayedColumns2: string[] = ['date', 'user', 'notes'];
    dataSource2 = ELEMENT_DATA_2;

    taskDetail;
    linkedData: any;
    applicationDetailsArray: Details[] = [];

    linkedDetailsArray: String[] = [];
    supportingDocuments: any[] = [];
    lodgeData: any;
    lodgementDraftData: any;
    tempData: any = "";
    constructor(private router: Router, private loaderService: LoaderService,
        private restService: RestcallService, private dialog: MatDialog,
        private snackbar: SnackbarService) {
        if (this.router.getCurrentNavigation().extras.state === undefined) {
            this.router.navigate(['/home']);
        } else {

            this.taskDetail = this.router.getCurrentNavigation().extras.state.taskDetail;
            if (this.taskDetail.processName === 'Reservation Request' || this.taskDetail.processName === 'Reservation Transfer') {
                this.applicationDetailsArray.push({ icon: 'assets/images/icon/Group_1068.svg', item: 'Reservation Details' })
            } else if (this.taskDetail.processName === 'Lodgement Request') {
                this.applicationDetailsArray.push({ icon: 'assets/images/icon/Group_1068.svg', item: 'Lodgement Details' })
            } else {
                this.applicationDetailsArray.push({ icon: 'assets/images/icon/Icons_Person.svg', item: 'Requestor’s Information' })
            }
            if (this.taskDetail.processName === 'Information Request') {
                this.applicationDetailsArray.push(
                    { icon: 'assets/images/icon/Icons_Info_circle.svg', item: 'Information Request Items' },
                    { icon: 'assets/images/icon/Icons_File_earmark_ruled.svg', item: 'Invoice Details' },
                    { icon: 'assets/images/icon/Icons_Wallet.svg', item: 'Payment Details' },
                    { icon: 'assets/images/icon/Group_1068.svg', item: 'Dispatch Details' });
            }

        }
    }

    ngOnInit() {
        this.loadInitials();
    }

    loadInitials() {

        const workflowId = this.taskDetail.workflowId;

        forkJoin([
            this.restService.getAllReferrals(workflowId),
            this.restService.loadTaskFlow(workflowId),
            this.restService.getInformationRequestItem(workflowId),
            this.restService.getSupportingDocuments(workflowId)
        ]).subscribe(([referrals, tasks, linkedDetails, supportingDocuments]) => {
            this.relatedTasksDataSource = referrals.data;
            this.taskHistoryDataSource = tasks.data;
            this.linkedData = linkedDetails.data.json;
            this.supportingDocuments = supportingDocuments.data;

            if (linkedDetails.data.json.length > 0) {
                for (let i = 0; i < linkedDetails.data.json.length; i++) {
                    this.linkedDetailsArray.push(linkedDetails.data.json[i].searchDetails.lpi?.split(','));
                }
            }
        });

    }

    navigate(element) {
        const val = this.linkedData.filter(x => x.searchDetails.lpi === element[0])[0].searchDetails;
        this.router.navigate(['/land-profile'], { state: { lpi: element[0], recordId: val.recordId } });
    }

    viewReferral() {
        const dialogRef = this.dialog.open(ViewReviewInfoComponent, {
            width: '100%',
            data: this.taskDetail.workflowId,
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    requesterinfo() {
        const dialogRef = this.dialog.open(RequesterinfoDialogComponent, {
            width: '100%',
            height: '90%',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    dispatchdetail() {
        const dialogRef = this.dialog.open(DispatchDetailDialogComponent, {
            width: '100%',
            height: '90%',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    inforequestitem() {
        const dialogRef = this.dialog.open(InforequestitemDialogComponent, {
            width: '100%',
            height: '90%',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    invoicedetail() {
        const dialogRef = this.dialog.open(InvoiceDetailDialogComponent, {
            width: '100%',
            height: '95%',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    paymentdetail() {
        const dialogRef = this.dialog.open(PaymentDetailDialogComponent, {
            width: '100%',
            height: '95%',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    reservationTransferPreview() {
        const dialogRef = this.dialog.open(ReservationTransferTaskPreviewComponent, {
            width: '100%',
            height: 'auto',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    lodgementPreview() {
        const dialogRef = this.dialog.open(LodgementTaskPreviewComponent, {
            width: '100%',
            height: 'auto',
            data: this.taskDetail
        });
        dialogRef.afterClosed().subscribe(() => {
        });
    }

    onclickApplication(data) {
        if (data.item === 'Requestor’s Information') {
            this.requesterinfo();
        } else if (data.item === 'Information Request Items') {
            this.inforequestitem();
        } else if (data.item === 'Invoice Details') {
            this.invoicedetail();
        } else if (data.item === 'Payment Details') {
            this.paymentdetail();
        } else if (data.item === 'Dispatch Details') {
            this.dispatchdetail();
        } else if (data.item === 'Reservation Details') {
            this.reservationTransferPreview();
        } else if (data.item === 'Lodgement Details') {
            this.lodgementPreview();
        }
    }

    downloaddoc2(doc) {
        this.loaderService.display(true);
        const docId = doc.documentId;
        this.restService.downloadWorkflowSupportingDocs(docId).subscribe((res) => {
            this.downloadBlob(res, doc.documentName);
            this.loadInitials();
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

    deleteDoc2(doc) {
        this.loaderService.display(true);
        const docId = doc.documentId;
        const workflowI = doc.workflowId;
        this.restService.deleteWorkflowDocs(docId, workflowI).subscribe((res) => {
            this.loadInitials();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

}
