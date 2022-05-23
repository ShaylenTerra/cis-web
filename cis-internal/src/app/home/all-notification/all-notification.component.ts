import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { RestcallService } from '../../services/restcall.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.css']
})
export class AllNotificationComponent implements OnInit {
    notifications = [];
    notificationColumns: string[] = ['Sn', 'subject', 'description', 'dated', 'UserName'];
    notificationCount: 0;
    notificationDataSource;
    @ViewChild('myLeaveReviewPaginator', { read: MatPaginator }) paginatorReview: MatPaginator;

    constructor(public dialogRef: MatDialogRef<AllNotificationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private snackbar: SnackbarService) {
        this.notifications = data;
        this.notificationDataSource = new MatTableDataSource(this.notifications);
        this.notificationDataSource.paginator = this.paginatorReview;
        this.notificationCount = this.notificationDataSource.data.length || 0;
    }

    ngOnInit(): void {
    }

}
