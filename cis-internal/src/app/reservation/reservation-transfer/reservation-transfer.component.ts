import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import { ExportToCsv } from 'export-to-csv';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { environment } from '../../../environments/environment';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { ConfirmeventDialogComponent } from '../../tasks/task-list/confirmevent-dialog/confirmevent-dialog.component';
import { forkJoin } from 'rxjs';

const VIEW_MAP_URL = environment.gisServerUrl + '/stat/MapInbox.html?userid=';

@Component({
    selector: 'app-reservation-transfer',
    templateUrl: './reservation-transfer.component.html',
    styleUrls: ['./reservation-transfer.component.css'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class ReservationTransferComponent implements OnInit {
    direction = '';
    activefield = '';
    sortArr: any[] = [];
    activePage = 0;
    activesize = 10;
    activePageFrom = 1;
    activePageTo = 10;
    totalInboxTasks: any;
    selectedDate;
    priorities: any[] = [];
    selectedPriority: any[] = [];
    selectedAction: any[] = [];
    selectedRequestType: any[] = [];
    selectedDateRange: any = 0;
    tasks;
    priority: any[] = ['High', 'Low', 'Medium', 'Normal'];
    filteredTasks: any[];
    isSpinnerVisible = false;
    displayedColumns: string[] = ['referenceNumber', 'designation', 'lpi', 'status', 'reason', 'issueDate', 'expiryDate', 'expiryInDays', 'name', 'provinceName'];
    dataLength: number;
    dataSource: any;
    requestTypeSelected = 'Single';
    radioTypeSelected = '0';
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    zoom = 8;

    // initial center position for the map
    lat = 30.5595;
    lng = 22.9375;
    markers: Marker[] = [
        {
            lat: 25.7479,
            lng: 28.2293,
            label: 'Gauteng',
            draggable: true
        },
        {
            lat: 29.0852,
            lng: 26.1596,
            label: 'Free State',
            draggable: false
        },
        {
            lat: 33.9249,
            lng: 18.4241,
            label: 'Cape Town',
            draggable: true
        }
    ];
    requestTypes: any[] = [];
    priorityList: any[] = [];
    Action: any[] = [];
    userId: number;

    @ViewChild('calendar', { static: true }) calendarComponent: FullCalendarComponent;
    dt = new Date();
    calendarVisible = true;
    calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
    calendarWeekends = true;
    calendarEvents: EventInput[] = [];
    dateRangeForm: FormGroup;
    dateBadges: any = {};
    backFilter: any;
    requestTypeForm: FormGroup;
    mapsrc: any;
    delegateBadgeCount: any = 0;
    showDelegate: any;
    serverDate: any;
    provinces: any;
    reservationData: any[] = [];
    refNumVal;
    projNameVal;
    constructor(
        private router: Router,
        private snackbar: SnackbarService,
        private restService: RestcallService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private loaderService: LoaderService,
        private topMenu: TopMenuService,
        private dom: DomSanitizer
    ) {
        this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL + JSON.parse(sessionStorage.getItem('userInfo')).userId);
        this.tasks = [];
        this.dateRangeForm = this.fb.group({
            startDate: '',
            endDate: ''
        });
        this.requestTypeForm = this.fb.group({
            reqType: [''],
            reqPriority: [''],
            reqAction: [''],
            // reqDelegate: ['']
        });
        if (this.router.getCurrentNavigation() !== null) {
            if (this.router.getCurrentNavigation().extras.state !== undefined) {
                this.backFilter = this.router.getCurrentNavigation().extras.state.filter;
                this.router.getCurrentNavigation().extras.state = undefined;
            }
        }
        const navig = this.topMenu.iconsInfo.filter(x => x.name ===
            router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
        if (navig.length > 0) {
            this.topMenu.navigate(navig[0].id);
        }
    }

    clickedMarker(label: string, index: number) {
    }

    mapClicked($event: any) {
        this.markers.push({
            lat: $event.coords.lat,
            lng: $event.coords.lng,
            draggable: true
        });
    }

    download() {
        const data: any = this.tasks,
            d = new Date(),
            todayDate = [d.getDate(), d.getMonth(), d.getFullYear()].join('-'),
            fileName = `myTasks_${todayDate}`;
        const options = {
            fieldSeparator: ',',
            filename: fileName,
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            title: '',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(data);
    }

    markerDragEnd(m: Marker, $event: MouseEvent) {
    }

    ngOnInit() {
        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        this.userId = userInfoJson.userId;
        // this.getInboxTasks('');
        this.getPriority();
        this.loadInitials();

        // this.getAllReservationWorkflow();
    }

    getAllReservationWorkflow() {
        this.loaderService.display(true);
        this.restService.getAllReservationWorkflow(239, this.userId).subscribe(response => {
            if (response.code === 50000) {
                this.loaderService.display(false);
                return;
            } else {
                this.reservationData = response.body.data;
                this.refreshTable();
                this.loaderService.display(false);
            }
        }, () => {
            this.loaderService.display(false);
        });
    }

    loadInitials() {
        forkJoin([
            this.restService.getProvinces(),
            this.restService.getReservationTransfers(),
        ]).subscribe(([provinces, reservationTransfers]) => {
            this.provinces = provinces.data;
            this.reservationData = reservationTransfers.data;
            for (let i = 0; i < this.reservationData.length; i++) {
                this.reservationData[i].owner = reservationTransfers.data[i].firstName + ' ' + reservationTransfers.data[i].surName;
            }
            this.filteredTasks = reservationTransfers.data;
            for (let i = 0; i < this.filteredTasks.length; i++) {
                this.reservationData[i].owner = reservationTransfers.data[i].firstName + ' ' + reservationTransfers.data[i].surName
            }
            this.refreshTable();
            // extract distinct values
            this.requestTypes = this.distinct(this.reservationData, 'owner');
            this.priorityList = this.distinct(this.reservationData, 'provinceName');
            this.Action = this.distinct(this.reservationData, 'reason');
            this.loaderService.display(false);

            if (this.backFilter !== undefined) {
                this.selectedAction = this.backFilter.selectedAction;
                this.selectedDateRange = this.backFilter.selectedDateRange;
                this.selectedPriority = this.backFilter.selectedPriority;
                this.selectedRequestType = this.backFilter.selectedRequeestType;
                this.radioTypeSelected = this.backFilter.selectedDateRange.toString();
                this.showDelegate = this.backFilter.showDelegate;
                if (this.backFilter.selectedDateRange === 5) {
                    this.dateRangeForm.patchValue({
                        startDate: this.backFilter.selectedDateRangeForm.startDate,
                        endDate: this.backFilter.selectedDateRangeForm.endDate
                    });
                }
                this.Action.forEach(item => {
                    item.checked = false;
                });
                this.priorities.forEach(item => {
                    item.checked = false;
                });
                for (let i = 0; i < this.Action.length; i++) {
                    this.Action[i].checked = this.selectedAction.includes(this.Action[i].key) ? true : false;
                }
                for (let i = 0; i < this.priorities.length; i++) {
                    this.priorities[i].checked = this.selectedPriority.includes(this.priorities[i].key) ? true : false;
                }
                this.requestTypeForm.patchValue({
                    reqType: this.selectedRequestType,
                    reqPriority: this.selectedPriority,
                    reqAction: this.selectedAction,
                    // reqDelegate: ['']
                });
                this.filterAll();
                this.backFilter = undefined;
            }
        }, error => {

            if (error.message === 'No tasks found.') {
                this.snackbar.openSnackBar('No tasks found.', 'Message');
            } else {
                this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            }
            this.loaderService.display(false);
        });

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    refreshTable() {
        this.updateBadges();
        this.dataSource = new MatTableDataSource(this.filteredTasks);
        this.dataSource.paginator = this.paginator;
        this.dataLength = this.dataSource.data.length || 0;
    }

    getPriority() {
        this.restService.getPriorityFlag().subscribe((res: any) => {
            this.priorities = res.data;
        });
    }

    filterAll() {
        this.filteredTasks = this.reservationData;
        if (this.selectedDateRange !== 0) {
            if (this.selectedDateRange !== 5) {
                const dtend = new Date();
                const dtSart = new Date();
                dtSart.setDate(dtSart.getDate() - this.selectedDateRange);
                dtSart.setHours(0, 0, 0, 0);
                this.filteredTasks = this.reservationData.filter((task) => {
                    const date = new Date(task.triggeredOn);
                    return (date >= dtSart && date <= dtend);
                });
            } else {
                if (this.dateRangeForm.value.endDate !== '' && this.dateRangeForm.value.startDate !== '') {
                    const dtend = this.dateRangeForm.value.endDate.setHours(0, 0, 0, 0);
                    const dtSart = this.dateRangeForm.value.startDate.setHours(0, 0, 0, 0);
                    this.filteredTasks = this.reservationData.filter((task) => {
                        const date = new Date(task.triggeredOn);
                        return (date >= dtSart && date <= dtend);
                    });
                }
            }
        }

        if (this.refNumVal !== undefined && this.refNumVal !== null) {
            this.filteredTasks = this.filteredTasks.length > 0
                ? this.filteredTasks.filter((task) => task.referenceNumber.toLowerCase().includes(this.refNumVal.toLowerCase()))
                : this.reservationData.filter((task) => task.referenceNumber.toLowerCase().includes(this.refNumVal.toLowerCase()));
        }

        if (this.projNameVal !== undefined && this.projNameVal !== null) {
            this.filteredTasks = this.filteredTasks.length > 0
                ? this.filteredTasks.filter((task) => task.name.toLowerCase().includes(this.projNameVal.toLowerCase()))
                : this.reservationData.filter((task) => task.name.toLowerCase().includes(this.projNameVal.toLowerCase()));
        }

        if (this.selectedRequestType.length > 0) {
            this.filteredTasks = this.filteredTasks.length > 0 ? this.filteredTasks.filter((task) => {
                return this.selectedRequestType.indexOf(task.owner) !== -1;
            }) : this.reservationData.filter((task) => {
                return this.selectedRequestType.indexOf(task.owner) !== -1;
            });
        }

        if (this.selectedAction.length > 0) {
            this.filteredTasks = this.filteredTasks.length > 0 ? this.filteredTasks.filter((task) => {
                return this.selectedAction.indexOf(task.reason) !== -1;
            }) : this.reservationData.filter((task) => {
                return this.selectedAction.indexOf(task.reason) !== -1;
            });
        }

        if (this.selectedPriority.length > 0) {
            this.filteredTasks = this.filteredTasks.length > 0 ? this.filteredTasks.filter((task) => {
                return this.selectedPriority.indexOf(task.provinceName) !== -1;
            }) : this.reservationData.filter((task) => {
                return this.selectedPriority.indexOf(task.provinceName) !== -1;
            });
        }

        if (this.showDelegate !== undefined) {
            if (this.filteredTasks.length > 0) {
                this.filteredTasks = this.showDelegate === true ? this.filteredTasks.filter((task) => {
                    return task.userId !== this.userId;
                })
                    : this.filteredTasks.filter((task) => {
                        return task.userId === this.userId;
                    });
            }
        }
        this.refreshTable();
    }

    updateBadges() {
        this.dateBadges = {
            0: this.filteredTasks.length,
            1: 0,
            7: 0,
            30: 0
        };
        this.priorityList.forEach(pl => {
            pl.count = 0;
        });
        this.Action.forEach(a => {
            a.count = 0;
        });
        this.filteredTasks.forEach(t => {
            let dtend = new Date();
            let dtSart = new Date();
            dtSart.setDate(dtSart.getDate() - 1);
            dtSart.setHours(0, 0, 0, 0);
            const date = new Date(t.triggeredOn);
            if (date >= dtSart && date <= dtend) {
                this.dateBadges[1]++;
            }
            dtend = new Date();
            dtSart = new Date();
            dtSart.setDate(dtSart.getDate() - 7);
            dtSart.setHours(0, 0, 0, 0);
            if (date >= dtSart && date <= dtend) {
                this.dateBadges[7]++;
            }
            dtend = new Date();
            dtSart = new Date();
            dtSart.setDate(dtSart.getDate() - 30);
            dtSart.setHours(0, 0, 0, 0);
            if (date >= dtSart && date <= dtend) {
                this.dateBadges[30]++;
            }
            this.priorityList.forEach(pl => {
                if (pl.key === t.provinceName) {
                    pl.count++;
                }
            });
            this.Action.forEach(a => {
                if (a.key === t.reason) {
                    a.count++;
                }
            });
            if (t.userId === this.userId) {
                this.delegateBadgeCount++;
            }
        });
    }


    onRequestTypeChange(selectedArr) {
        this.selectedRequestType = selectedArr;
        this.filterAll();
    }

    onRequestPriority(event) {
        this.selectedPriority = event;
        this.filterAll();
    }

    refNumberFilter(val) {
        this.refNumVal = val.target.value;
        this.filterAll();
    }

    projectNameFilter(val) {
        this.projNameVal = val.target.value;
        this.filterAll();
    }

    onRequestAction(event) {
        if (event.checked) {
            this.selectedAction.push(event.source.value);
        } else {
            const index: number = this.selectedAction.indexOf(event.source.value);
            if (index !== -1) {
                this.selectedAction.splice(index, 1);
            }
        }
        this.filterAll();
    }

    ondateFilter(value) {
        this.selectedDateRange = value;
        this.filterAll();
    }

    onValChange(value) {
        this.requestTypeSelected = value;
        this.radioTypeSelected = '0';
        this.snackbar.openSnackBar(`${this.requestTypeSelected} Request Selected with filter of Today`, 'Sucess');
    }

    onRadioValChange(value) {
        this.radioTypeSelected = value;
        const showText = value === 1 ? 'Today' : (value === 2 ? 'Last 7 Days' : 'Last 30 Days');
        this.snackbar.openSnackBar(`${this.requestTypeSelected} Request Selected with filter of ${showText}`, 'Sucess');
    }

    gotoTaskDetails(taskDetail) {
        if (taskDetail.processName === 'Reservation Request') {
            this.router.navigate(['/reservation/task-detail-reservation'], { state: { resData: taskDetail } });
        } else {
            const filters = {
                'selectedAction': this.selectedAction,
                'selectedDateRange': this.selectedDateRange,
                'selectedPriority': this.selectedPriority,
                'selectedRequeestType': this.selectedRequestType,
                'selectedDateRangeForm': this.dateRangeForm.value,
                'showDelegate': this.showDelegate,
            };
            this.router.navigate(['/tasks/task-details'], { state: { taskDetail: taskDetail, filters: filters } });
        }
    }



    getInboxTasks(stat: any) {
        this.loaderService.display(true);
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
        this.restService.getInboxTask(this.userId).subscribe(payload => {
            this.filteredTasks = payload.data;
            this.tasks = payload.data;
            this.refreshTable();
            // this.dataSource = new MatTableDataSource(this.tasks);
            // this.dataSource.paginator = this.paginator;
            // this.dataLength = this.dataSource.data.length || 0;
            this.serverDate = payload.timestamp;
            const objMyDiary = this.tasks.filter(x => x.diarisedate != null);
            if (objMyDiary != null) {
                for (let i = 0; i < objMyDiary.length; i++) {
                    this.calendarEvents.push(
                        {
                            title: objMyDiary[i].referenceNo,
                            start: new Date(objMyDiary[i].diarisedate),
                            workflowId: objMyDiary[i].workflowId,
                            allDay: true,
                        }
                    );
                }
            }
            // extract distinct values
            this.requestTypes = this.distinct(this.tasks, 'owner');
            this.priorityList = this.distinct(this.tasks, 'provinceName');
            this.Action = this.distinct(this.tasks, 'reason');
            this.loaderService.display(false);

            if (this.backFilter !== undefined) {
                this.selectedAction = this.backFilter.selectedAction;
                this.selectedDateRange = this.backFilter.selectedDateRange;
                this.selectedPriority = this.backFilter.selectedPriority;
                this.selectedRequestType = this.backFilter.selectedRequeestType;
                this.radioTypeSelected = this.backFilter.selectedDateRange.toString();
                this.showDelegate = this.backFilter.showDelegate;
                if (this.backFilter.selectedDateRange === 5) {
                    this.dateRangeForm.patchValue({
                        startDate: this.backFilter.selectedDateRangeForm.startDate,
                        endDate: this.backFilter.selectedDateRangeForm.endDate
                    });
                }
                this.Action.forEach(item => {
                    item.checked = false;
                });
                this.priorities.forEach(item => {
                    item.checked = false;
                });
                for (let i = 0; i < this.Action.length; i++) {
                    this.Action[i].checked = this.selectedAction.includes(this.Action[i].key) ? true : false;
                }
                for (let i = 0; i < this.priorities.length; i++) {
                    this.priorities[i].checked = this.selectedPriority.includes(this.priorities[i].key) ? true : false;
                }
                this.requestTypeForm.patchValue({
                    reqType: this.selectedRequestType,
                    reqPriority: this.selectedPriority,
                    reqAction: this.selectedAction,
                    // reqDelegate: ['']
                });
                this.filterAll();
                this.backFilter = undefined;
            }

        }, error => {

            if (error.message === 'No tasks found.') {
                this.snackbar.openSnackBar('No tasks found.', 'Message');
            } else {
                this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            }
            this.loaderService.display(false);
        });
    }

    distinct(dataArr, key) {
        const unique = {};
        const distinct = [];
        for (let i = 0; i < dataArr.length; i++) {
            const element = dataArr[i];
            if (element[key]) {
                if (unique[element[key]] == null || unique[element[key]] === undefined) {
                    unique[element[key]] = distinct.length;
                    distinct.push({
                        key: element[key],
                        count: 1
                    });
                } else {
                    distinct[unique[element[key]]].count++;
                }
            }
        }
        return distinct;
    }


    toggleVisible() {
        this.calendarVisible = !this.calendarVisible;
    }

    toggleWeekends() {
        this.calendarWeekends = !this.calendarWeekends;
    }

    gotoPast() {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
    }

    confirmeventDialog(arg): void {
        const dialogRef = this.dialog.open(ConfirmeventDialogComponent, {
            width: '500px',
            data: { value: arg }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    eventClick(model) {
        const dt = new Date(model.event._instance.range.start);
        const newDate = new Date();
        newDate.setHours(0, 0, 0, 0);
        const obj = {
            title: model.event._def.title,
            eventDate: dt,
            workflowId: model.event._def.extendedProps.workflowId,
        };
        const taskdetail = this.tasks.filter(x => x.workflowId === obj.workflowId);
        if (taskdetail.length > 0) {
            this.gotoTaskDetails(taskdetail[0]);
        }
    }

    activenext() {
        if (this.totalInboxTasks > this.activePageTo) {
            this.activePage = this.activePage + 1;
            this.getInboxTasks('next');
        }
    }

    activeprevious() {
        if (this.activePage > 0) {
            this.activePage = this.activePage - 1;
        }
        this.getInboxTasks('prev');

    }

    datechangeEvent() {
        if (this.dateRangeForm.value.startDate != null && this.dateRangeForm.value.endDate != null
            && this.dateRangeForm.value.startDate !== '' && this.dateRangeForm.value.endDate !== '') {
            this.filterAll();
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
        this.getInboxTasks('');
    }

    ngAfterChange() {
        for (let j = 0; j < this.sortArr.length; j++) {
            // sortData = "&sort=" + this.sortArr[i].colName + "," + this.sortArr[i].direction
            this.sort.sort({ id: this.sortArr[j].colName, start: this.sortArr[j].direction, disableClear: true });
        }
        this.dataSource.sort = this.sort;
    }

    onDelegateAction(event) {
        this.showDelegate = event.checked;
        this.filterAll();
    }

    navigate(requestDetail) {

        requestDetail.processName = "Reservation Transfer"
        this.router.navigate(['/task-profile'],
            { state: { taskDetail: requestDetail !== undefined ? requestDetail : '' } });
    }

}

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

