import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as constants from './../constants/localstorage-keys';
import { RestcallService } from '../services/restcall.service';
import { SnackbarService } from '../services/snackbar.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderService } from '../services/loader.service';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { MatDialog } from '@angular/material/dialog';
import { TopMenuService } from '../services/topmenu.service';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    direction = '';
    activefield = '';
    page = 0;
    size = 0;
    // PageFrom = 1;
    // PageTo = 5;
    activePage = 0;
    activesize = 0;
    // activePageFrom = 1;
    // activePageTo = 3;
    sections: any;
    isSpinnerVisible = false;
    isRequestsSpinnerVisible = false;
    isSearchRequestsSpinnerVisible = false;
    referenceNo;
    requestsData: any[] = [];
    searchRequestsData: any[] = [];
    tasksData;
    type;
    province;
    parcelType;
    adminDep;
    bind: any;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    serachrefform: FormGroup;
    selectedRequestType = 'sr';
    searchRequestsColumns: string[] = ['referenceNumber', 'internalStatusCaption', 'pendingSince', 'lastStatusUpdate'];
    requestsColumns: string[] = ['referenceNumber', 'processName', 'internalStatusCaption', 'pendingSince', 'lastStatusUpdate'];
    requestsLength: number;
    activeTaskLength: number;
    queriesColumns: string[] = ['issueType', 'issueStatus', 'date', 'action'];
    notifications = [];

    tasksColumns: string[] = ['TimeAgo', 'Task', 'TaskId', 'CreatedAt'];
    dataLength: number;
    dataSource1: any;
    dataSource: any;
    totalInboxTasks: any;
    totalMyRequest: any;
    sortArr: any[] = [];
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    requestGraphData: any;
    public doughnutChartData: any;
    public pieChartOption: any;
    @ViewChild('doughnutChart', { static: false }) pieChart: ElementRef; // doughnut
    public pieChartTag: CanvasRenderingContext2D;
    arrLabel = [];
    arrData = [];
    serverDate: any;
    serverDate1: any;
    constructor(private router: Router, private fb: FormBuilder,
        private restService: RestcallService, private snackbar: SnackbarService,
        private loaderService: LoaderService, private dialog: MatDialog,
        private topMenu: TopMenuService) {
        this.requestsData = [];

        this.serachrefform = this.fb.group({
            referenceNo: ''
        });

        const navig = this.topMenu.iconsInfo.filter(x => x.name ===
            router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
        if (navig.length > 0) {
            this.topMenu.navigate(navig[0].id);
        }
    }

    ngOnInit() {
        const settingsString: any = sessionStorage.getItem(constants.StorageConstants.HOME_SETTINGS);
        const settings = settingsString != null ? JSON.parse(settingsString) : {};
        this.sections = settings && JSON.parse(settings.sections);
        this.bind = {
            ActiveTask: false,
            Notifications: false,
            MyRequests: false,
            RequestStatus: false,
        };
        if (this.sections !== undefined) {
            this.bind = {
                ActiveTask: this.sections.ActiveTask || false,
                Notifications: this.sections.Notifications || false,
                MyRequests: this.sections.MyRequests || false,
                RequestStatus: this.sections.RequestStatus || false
            };

            if (this.bind.MyRequests) {
                this.getMyRequests('', '', '');
            }
        }
        this.getInboxTasks('');
        this.getUserNotification();
    }

    getInboxTasks(stat: any) {
        this.loaderService.display(true);
        this.restService.getInboxTasks(this.activePage, this.activesize, '', this.userId, '').subscribe(payload => {
            this.tasksData = payload.body.data;
            this.serverDate1 = payload.body.timestamp;
            // this.totalInboxTasks = Number(payload.headers.get('X-Total-Count'));
            // if (this.activePage > 0 && stat === 'next') {
            //     this.activePageFrom = this.activePageTo + 1;
            //     this.activePageTo = this.activePageTo + this.tasksData.length;
            // }
            // if (this.activePage > 0 && stat === 'prev') {
            //     if (this.activePageFrom === this.activePageTo) {
            //         this.activePageFrom = this.activePage * this.activesize;
            //         this.activePageTo = this.activePageFrom + this.activesize;
            //     } else {
            //         this.activePageFrom = this.activePage * this.activesize + 1;
            //         this.activePageTo = this.activePage * this.activesize + (this.activesize);
            //     }
            // }
            // if (this.activePage === 0 && stat === 'prev') {
            //     this.activePageFrom = 1;
            //     this.activePageTo = 3;
            // }
            this.dataSource1 = new MatTableDataSource(this.tasksData);
            this.dataSource1.paginator = this.paginator.toArray()[0];
            this.dataLength = this.dataSource1.data.length || 0;
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });

    }


    public chartHovered(): void {
    }

    navigate(requestDetail) {
        this.router.navigate(['/task-profile'],
            { state: { taskDetail: requestDetail === undefined ? this.searchRequestsData[0] : requestDetail } });
    }

    getMyRequests(stat: any, activefield, direction) {
        this.loaderService.display(true);
        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        const userId = userInfoJson.userId;
        let sortData = '';
        if (this.sortArr.length === 0) {
            this.activefield = '';
            this.direction = '';
        } else {
            this.activefield = this.sortArr[0].colName + ',' + this.sortArr[0].direction;
            this.direction = this.sortArr[0].direction;
            for (let i = 1; i < this.sortArr.length; i++) {
                sortData = '&sort=' + this.sortArr[i].colName + ',' + this.sortArr[i].direction;
            }
        }
        forkJoin([
            this.restService.getMyRequests(this.page, this.size, this.activefield, userId, sortData),
            this.restService.getMyRequests(0, 1000, this.activefield, userId, sortData)
        ]).subscribe(([payload, graphData]) => {
            if (typeof payload.body.data === 'object' && payload.body.data !== null) {
                this.requestsData = payload.body.data;
                this.serverDate = payload.body.timestamp;
                this.dataSource = new MatTableDataSource(this.requestsData);
                this.dataSource.paginator = this.paginator.toArray()[1];
                this.dataSource.sort = this.sort;
                this.requestsLength = this.dataSource.data.length || 0;
                this.loaderService.display(false);

                this.requestGraphData = graphData.body.data;
                const resultByStatus = _(this.requestGraphData.filter(d => d.externalStatusCaption !== null))
                    .groupBy(x => x.externalStatusCaption)
                    .map((value, key) => ({ status: key, total: value.length }))
                    .value();

                for (let l = 0; l < resultByStatus.length; l++) {
                    this.arrLabel.push(resultByStatus[l].status);
                    this.arrData.push(resultByStatus[l].total);
                }
                this.setGraphData();
            }
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


    // next() {

    //     if (this.totalMyRequest > this.PageTo) {
    //         this.page = this.page + 1;
    //         this.getMyRequests('next', this.activefield, this.direction);
    //     }
    // }

    // previous() {
    //     if (this.page > 0) {
    //         this.page = this.page - 1;
    //     }
    //     this.getMyRequests('prev', this.activefield, this.direction);

    // }

    // activenext() {

    //     if (this.totalInboxTasks > this.activePageTo) {
    //         this.activePage = this.activePage + 1;
    //         this.getInboxTasks('next');
    //     }
    // }

    // activeprevious() {
    //     if (this.activePage > 0) {
    //         this.activePage = this.activePage - 1;
    //     }
    //     this.getInboxTasks('prev');
    // }

    searchMyRequests() {
        this.isSearchRequestsSpinnerVisible = true;
        this.restService.searchByRefNo(this.serachrefform.value.referenceNo).subscribe(payload => {
            this.searchRequestsData = [];
            if (typeof payload.data === 'object' && payload.data !== null) {
                this.searchRequestsData.push(payload.data);
            }
            this.isSearchRequestsSpinnerVisible = false;
        },
            () => {
                this.isSearchRequestsSpinnerVisible = false;
            });

    }

    resetMyRequests() {
        if (this.referenceNo === null || this.referenceNo === '' || this.referenceNo === undefined) {
            this.getMyRequests('', '', '');
        }
    }

    resetSearchRequests() {
        if (this.referenceNo === null || this.referenceNo === '' || this.referenceNo === undefined) {
            this.searchMyRequests();
        }
    }

    sortData(f) {
        const tempSort = {
            'colName': this.activefield = f.active,
            'direction': this.direction = f.direction
        };
        const exist = this.sortArr.filter(x => x.colName === f.active);
        if (exist.length === 0) {
            this.sortArr.push(tempSort);
        } else {
            const i = this.sortArr.findIndex(x => x.colName === f.active);
            this.sortArr[i] = tempSort;
        }
        this.getMyRequests('', this.activefield, this.direction);
    }

    ngAfterChange() {
        for (let j = 0; j < this.sortArr.length; j++) {
            this.sort.sort({ id: this.sortArr[j].colName, start: this.sortArr[j].direction, disableClear: true });
        }
        this.dataSource.sort = this.sort;
    }

    navigateQuery(element) {
        if (element.processName === 'Reservation Request' || element.processName === 'Reservation Transfer') {
            this.router.navigate(['/reservation/task-detail-reservation'], { state: { resData: element } });
        } else if (element.processName === 'Lodgement Request') {
            this.router.navigate(['/lodgement/task-detail-lodgement'], { state: { lodgeData: element } });
        } else if(element.processName === 'Examination'){
            this.router.navigate(['/examination/task-detail-examination'], { state: { examData: element } });
        } else {
            this.router.navigate(['/tasks/task-details'], { state: { taskDetail: element } });
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
        dialogRef.afterClosed().subscribe(async () => {
        });
    }

    setGraphData() {
        setTimeout(() => {
            const pieTag = (((this.pieChart.nativeElement as HTMLCanvasElement).children));
            this.pieChartTag = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
            const cdef = (this.pieChartTag).createLinearGradient(100, 0, 300, 0);
            cdef.addColorStop(0, '#4caf50');
            cdef.addColorStop(1, '#4caf50');
            const wxyz = (this.pieChartTag).createLinearGradient(100, 0, 300, 0);
            wxyz.addColorStop(0, '#FF9800');
            wxyz.addColorStop(1, '#FF9800');

            this.doughnutChartData = {
                labels: this.arrLabel,
                datasets: [{
                    data: this.arrData,
                    backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
                    hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
                }]
            };

            this.pieChartOption = {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1,
                legend: {
                    display: true,
                    position: 'right'
                },
                animation: {
                    duration: 0
                },
                hover: {
                    animationDuration: 0
                },
                responsiveAnimationDuration: 0
            };
        });
    }
}
