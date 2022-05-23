import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RestcallService } from '../services/restcall.service';
import * as enums from '../constants/enums';
import { StorageConstants } from '../constants/storage-keys';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../services/loader.service';
import { SnackbarService } from '../services/snackbar.service';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { TopMenuService } from '../services/topmenu.service';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

interface Notification {
  notificationId: number;
  subject: string;
  body: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  page = 0;
  size = 0;
  PageFrom = 1;
  PageTo = 5;
  totalMyRequest: any;
  querypage = 0;
  querysize = 0;
  queryPageFrom = 1;
  queryPageTo = 5;
  totalquery: any;
  isSpinnerVisible = false;
  requestsData: any;
  queriesData: any;
  queriesLength;
  requestsLength;
  type;
  province;
  parcelType;
  adminDep;
  referenceNo;
  serachrefform: FormGroup;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  requestsColumns: string[] = ['referenceNumber',
    'processName',
    // 'actionRequired',
    'externalStatusCaption',
    'pendingSince',
    'lastStatusUpdate'];
  queriesColumns: string[] = ['referenceNumber',
    'processName',
    // 'actionRequired',
    'externalStatusCaption',
    'pendingSince',
    'lastStatusUpdate'];
  notifications = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  serverDate: any;
  serverDate1: any;
  tasksColumns: string[] = ['TimeAgo', 'Task', 'TaskId', 'CreatedAt'];
  dataLength: number;
  dataSource1: any;
  tasksData;
  activePage = 0;
  activesize = 0;
  constructor(private restService: RestcallService, private router: Router, private fb: FormBuilder,
    private dialog: MatDialog, private snackbar: SnackbarService,
    private loaderService: LoaderService, private topMenu: TopMenuService) {
    this.requestsData = [];
    this.serachrefform = this.fb.group({
      referenceNo: ''
    });

    const userSession = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO));
    if (userSession.resetPassword === 1) {
      const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
        width: '510px',
        height: '800px'
      });
      dialogRef.afterClosed().subscribe((result) => {
      });
    }
    const navig = this.topMenu.iconsInfo.filter(x => x.name ===
      router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
    if (navig.length > 0) {
      this.topMenu.navigate(navig[0].id);
    }
  }

  ngOnInit() {
    this.initialise();
  }

  initialise() {
    // this.getTopNotifications();
    this.getMyQueries('');
    this.getMyRequests('');
    this.getUserNotification();
    this.getInboxTasks('');
  }

  navigate() {
    this.router.navigate(['/task-profile']);
  }

  getMyQueries(stat: any) {
    this.isSpinnerVisible = true;
    const userId = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
    this.restService.getQueries(this.querypage, this.querysize, userId).subscribe(response => {
      const queriesData = response.body.data;
      this.serverDate1 = response.body.timestamp;
      this.queriesData = new MatTableDataSource(queriesData);
      this.queriesData.paginator = this.paginator.toArray()[1];
      this.queriesLength = this.queriesData.data.length || 0;
      // this.totalquery = Number(response.headers.get('X-Total-Count'));
      // if (this.querypage > 0 && stat === 'next') {
      //     this.queryPageFrom = this.queryPageTo + 1;
      //     this.queryPageTo = this.queryPageTo + this.queriesData.length;
      //   }
      //   if (this.querypage > 0 && stat === 'prev') {
      //     if (this.queryPageFrom === this.queryPageTo) {
      //       this.queryPageFrom = this.querypage * this.querysize - (this.querysize);
      //       this.queryPageTo = this.queryPageFrom + this.querysize;
      //     } else {
      //       this.queryPageFrom = this.querypage * this.querysize + 1;
      //       this.queryPageTo = this.querypage * this.querysize + (this.querysize);
      //     }
      //   }
      //   if (this.querypage === 0 && stat === 'prev') {
      //     this.queryPageFrom = 1;
      //     this.queryPageTo = 5;
      //   }
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  getTopNotifications() {
    this.isSpinnerVisible = true;
    this.restService.getTopNotifications(enums.notification_users.ALL_EXTERNAL_USERS).subscribe(data => {
      this.notifications = data.data;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  getMyRequests(stat: any) {
    this.isSpinnerVisible = true;
    const userId = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
    this.restService.getMyRequests(this.page, this.size, userId).subscribe(payload => {
      const requestsData = payload.body.data;
      this.serverDate = payload.body.timestamp;
      this.requestsData = new MatTableDataSource(requestsData);
      this.requestsData.paginator = this.paginator.toArray()[0];
      this.requestsLength = this.requestsData.data.length || 0;
      // this.totalMyRequest = Number(payload.headers.get('X-Total-Count'));
      //   if (this.page > 0 && stat === 'next') {
      //     this.PageFrom = this.PageTo + 1;
      //     this.PageTo = this.PageTo + this.requestsData.length;
      //   }
      //   if (this.page > 0 && stat === 'prev') {
      //     if (this.PageFrom === this.PageTo) {
      //       this.PageFrom = this.page * this.size - (this.size);
      //       this.PageTo = this.PageFrom + this.size;
      //     } else {
      //       this.PageFrom = this.page * this.size + 1;
      //       this.PageTo = this.page * this.size + (this.size);
      //     }
      //   }
      //   if (this.page === 0 && stat === 'prev') {
      //     this.PageFrom = 1;
      //     this.PageTo = 5;
      //   }
      this.isSpinnerVisible = false;
    },
      error => {
        this.isSpinnerVisible = false;
      });
  }

  gotoRequestDetails(myRequest) {

    if (myRequest?.processName === 'Reservation Request' || myRequest?.processName === 'Reservation Transfer') {
      this.router.navigate(['/reservation/task-detail-reservation'], { state: { resData: myRequest } });
    } else if (myRequest.processName === 'Lodgement Request') {
      this.router.navigate(['/lodgement/task-detail-lodgement'], { state: { lodgeData: myRequest } });
    } else {
      if (myRequest.processName === null || myRequest.processName === undefined) {
        myRequest.processName = 'Query';
        myRequest.actionRequired = myRequest.issueStatus;
        myRequest.referenceNumber = myRequest.issueTypeItemId;
      }
      this.router.navigate(['my-request'], { state: { myRequest: myRequest } });
    }
  }

  searchMyRequests() {
    this.isSpinnerVisible = true;
    const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
    this.restService.searchByRefNoAndUserId(this.referenceNo, uid).subscribe(payload => {
      this.requestsData = [];
      if (payload.data != null && typeof payload.data === 'object') {
        this.requestsData.push(payload.data);
      }
      this.isSpinnerVisible = false;
    },
      error => {
        this.isSpinnerVisible = false;
      });
  }

  next() {
    if (this.totalMyRequest > this.PageTo) {
      this.page = this.page + 1;
      this.getMyRequests('next');
    }
  }

  previous() {
    if (this.page > 0) {
      this.page = this.page - 1;
    }
    this.getMyRequests('prev');
  }

  querynext() {
    if (this.totalquery > this.queryPageTo) {
      this.querypage = this.querypage + 1;
      this.getMyQueries('next');
    }
  }

  queryprevious() {
    if (this.querypage > 0) {
      this.querypage = this.querypage - 1;
    }
    this.getMyQueries('prev');
  }

  resetMyRequests(event) {
    if (this.referenceNo === null || this.referenceNo === '' || this.referenceNo === undefined) {
      this.getMyRequests('');
    }
  }

  getUserNotification() {
    this.restService.getUserNotification(this.userId).subscribe(result => {
      this.notifications = result.data;
      this.loaderService.display(false);
    },
      error => {
        if (error.message === 'No requests found.') {
          this.snackbar.openSnackBar('No requests found.', 'Message');
        } else {
          this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
        }
        this.loaderService.display(false);
      });
  }
  showAllNotifications() {
    const dialogRef = this.dialog.open(AllNotificationComponent, {
      width: '800px',
      data: this.notifications,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
    });
  }

  getInboxTasks(stat: any) {
    this.loaderService.display(true);
    this.restService.getInboxTasks(this.activePage, this.activesize, '', this.userId, '').subscribe(payload => {
      this.tasksData = payload.body.data;

      this.serverDate1 = payload.body.timestamp;
      this.dataSource1 = new MatTableDataSource(this.tasksData);
      this.dataSource1.paginator = this.paginator.toArray()[2];
      this.dataLength = this.dataSource1.data.length || 0;
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });

  }
}
