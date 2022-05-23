import {Component, OnInit, ViewChild} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../format-datepicket';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import * as constants from './../../constants/localstorage-keys';
import {MatDialog} from '@angular/material/dialog';
import {NewLeaveComponent} from './new-leave/new-leave.component';
import {forkJoin} from 'rxjs';
import {ManagerDecisionComponent} from './manager-decision/manager-decision.component';
import {EmployeedetailsComponent} from '../../tasks/task-details/employeedetails/employeedetails.component';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-leave-calendar',
    templateUrl: './leave-calendar.component.html',
    styleUrls: ['./leave-calendar.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class LeaveCalendarComponent implements OnInit {
    // isSpinnerVisible = false;
    columns = ['sno', 'start', 'end', 'leaveType', 'desc', 'status', 'docs', 'action'];
    leaveReviewColumns = ['sno', 'name', 'start', 'leaveType', 'end', 'desc', 'status', 'docs', 'action'];
    data;
    dataSource;
    dataLength;
    selectedFiles;
    fileToUpload: File = null;
    userId: any;
    description;
    startDate;
    endDate;
    reviewData;
    reviewDataSource;
    reviewDataLength;
    roleId;


    @ViewChild('myLeavePaginator', {read: MatPaginator}) paginator: MatPaginator;
    @ViewChild('myLeaveReviewPaginator', {read: MatPaginator}) paginatorReview: MatPaginator;

    constructor(private snackbar: SnackbarService, private restService: RestcallService, private dialog: MatDialog,
        private loaderService: LoaderService) {
    }

    ngOnInit() {
        // this.isSpinnerVisible = true;
        const userInfo = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO));
        const userRole = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINTERNALROLESINFO));
        this.userId = userInfo && userInfo.userId || 26;
        this.roleId = userRole && userRole.roleId || 0;
        this.loadInitials();

    }


    loadInitials() {
        this.loaderService.display(true);
        forkJoin([
            this.restService.getUserHolidays(this.userId),
            this.restService.getLeaveForReview(this.roleId)

        ]).subscribe(([myLeaves, leavesForReview]) => {

            this.data = myLeaves.data;
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataLength = this.dataSource.data.length || 0;
            this.reviewData = leavesForReview.data;
            this.reviewDataSource = new MatTableDataSource(this.reviewData);
            this.reviewDataSource.paginator = this.paginatorReview;
            this.reviewDataLength = this.reviewDataSource.data.length || 0;
            this.loaderService.display(false);
        });

    }

    downloadSupportingDocuments(leaveID, contextTypeID) {
        // this.isSpinnerVisible = true;
        this.loaderService.display(true);

        forkJoin([
            this.restService.getUserLeaveSupportingDocuments(leaveID, contextTypeID),
            this.restService.downloadUserLeaveSupportingDocuments(leaveID, contextTypeID)

        ]).subscribe(([doc, res]) => {
            const blob = new Blob([res], {type: doc.data.contentType});
            this.downloadBlob(blob, doc.data.fileName);
            // this.isSpinnerVisible = false;
            this.loaderService.display(false);
        }, error => {

            this.snackbar.openSnackBar(`Error in deleting leave`, 'Error');
            this.loaderService.display(false);
            // this.isSpinnerVisible = false;
        });

    }

    private downloadBlob(blob, name) {
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

    selectFile(event) {
        this.fileToUpload = event.target.files;
    }

    addNewNewLeave() {
        const dialogRef = this.dialog.open(NewLeaveComponent, {
            width: '600px',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            this.loadInitials();
        });
    }

    openDecisionDialog(element) {
        const dialogRef = this.dialog.open(ManagerDecisionComponent, {
            width: '750px',
            data: element,
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.loadInitials();
        });
    }

    removeItem(item) {
        // this.isSpinnerVisible = true;
        this.loaderService.display(true);
        this.restService.deleteUserLeave(item).subscribe(async () => {
            this.snackbar.openSnackBar('Leave deleted successfully', 'Success');
            this.loadInitials();
            this.loaderService.display(false);
            // this.isSpinnerVisible = false;
        }, error => {
            this.snackbar.openSnackBar(`Error in deleting leave`, 'Error');
            this.loaderService.display(false);
            // this.isSpinnerVisible = false;
        });
    }

    employeeDetails(selectedUserID): void {
        const dialogRef = this.dialog.open(EmployeedetailsComponent, {
            width: '750px',
            data: selectedUserID,
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {

        });
    }
}
