import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { ReservationDraftDialogComponent } from './reservation-draft-dialog/reservation-draft-dialog.component';

@Component({
    selector: 'app-reservation-list',
    templateUrl: './reservation-list.component.html',
    styleUrls: ['./reservation-list.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReservationListComponent implements OnInit, AfterViewInit, OnChanges {
    direction = '';
    activefield = '';
    sortArr: any[] = [];
    activePage = 0;
    activesize = 10;
    activePageFrom = 1;
    activePageTo = 10;
    tasks;
    isSpinnerVisible = false;
    displayedColumns: string[] = ['referenceNumber', 'reservationName', 'provinceName', 'processName', 'actionRequiredCaption', 'internalStatusCaption', 'triggeredOn', 'lastStatusUpdate'];
    reservationColumns: string[] = ['draftName', 'username', 'updated'];
    dataLength: number;
    dataSource: any[] = [];
    // @ViewChildren(MatPaginator,) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChildren(MatSort) sort = new QueryList<MatSort>();
    page2 = 0;
    size2 = 10;
    PageFrom2 = 1;
    PageTo2 = 10;
    totalprepackaged: any;
    dataSourceReservation: any[] = [];
    userId: number;
    dataSourceList: any;
    dataSourceReservationList: any;
    dataLengthRes: number;
    filteredDrafts: any[] = [];
    serverDate: any;
    filteredReservation: any[] = [];
    processId = 229;
    processId2 = 229;
    constructor(
        private router: Router,
        private restService: RestcallService,
        private dialog: MatDialog,
        private loaderService: LoaderService,
        private topMenu: TopMenuService,
        private ref: ChangeDetectorRef) {
        const navig = this.topMenu.iconsInfo.filter(x => x.name ===
            router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
        if (navig.length > 0) {
            this.topMenu.navigate(navig[0].id);
        }
    }

    ngOnInit() {
        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        this.userId = userInfoJson.userId;
        this.getAllReservationDraft();
        this.getAllReservationWorkflow();
    }

    ngAfterChange() {
    }



    ngOnChanges() {

    }
    createDraft(): void {
        if (this.processId !== undefined) {
            const dialogRef = this.dialog.open(ReservationDraftDialogComponent, {
                width: '550px',
                autoFocus: false,
                data: { processId: this.processId }
            });
            dialogRef.afterClosed().subscribe(resultCode => {
                if (resultCode === 1) {
                    this.getAllReservationDraft();
                } else {
                    this.router.navigate(['/reservation/reservation-draft'], { state: { resData: resultCode.data } });
                }
            });
        }
    }

    getAllReservationDraft() {
        this.loaderService.display(true);
        this.restService.getAllReservationDraft(this.processId).subscribe(response => {
            if (response.code === 50000) {
                this.loaderService.display(false);
                return;
            } else {
                this.filteredDrafts = response.body.data;
                this.dataSource = response.body.data;
                this.refreshTable()
                this.loaderService.display(false);
            }
        }, () => {
            this.loaderService.display(false);
        });
    }

    gotoTaskDetails(element) {
        element.processId = this.processId;
        this.router.navigate(['/reservation/reservation-draft'], { state: { resData: element } });
    }

    getAllReservationWorkflow() {
        this.loaderService.display(true);
        this.restService.getAllReservationWorkflow(this.processId2, this.userId).subscribe(response => {
            if (response.code === 50000) {
                this.loaderService.display(false);
                return;
            } else {
                this.filteredReservation = response.body.data;
                this.dataSourceReservation = response.body.data;
                this.refreshTableReservation();
                this.serverDate = response.body.timestamp;
                this.loaderService.display(false);
            }
        }, () => {
            this.loaderService.display(false);
        });
    }

    filterAll(val) {
        this.filteredDrafts = this.dataSource;
        if (val.target.value !== undefined && val.target.value !== null) {
            this.filteredDrafts = this.filteredDrafts.filter((task) => task.name.toLowerCase().includes(val.target.value.toLowerCase()) ||
                task.provinceName.toLowerCase().includes(val.target.value.toLowerCase()));
        }
        this.refreshTable();
    }

    refreshTable() {
        this.dataSourceList = new MatTableDataSource(this.filteredDrafts);
        this.dataSourceList.paginator = this.paginator.toArray()[0];;
        this.dataSourceList.sort = this.sort.toArray()[0];
        this.dataLength = this.filteredDrafts.length || 0;
        setTimeout(() => this.dataSourceList.paginator = this.paginator.toArray()[0]);
    }

    gotoReservation(element) {
        element.processId = this.processId2;
        this.router.navigate(['/reservation/reservation-task'], { state: { resData: element } });
    }

    filterReservationRequests(val) {
        this.filteredReservation = this.dataSourceReservation;
        if (val.target.value !== undefined && val.target.value !== null) {
            this.filteredReservation = this.filteredReservation.filter((data) => data.referenceNumber.toLowerCase().includes(val.target.value.toLowerCase()) ||
                data.reservationName.toLowerCase().includes(val.target.value.toLowerCase()));
        }
        this.refreshTableReservation();
    }

    refreshTableReservation() {
        this.dataSourceReservationList = new MatTableDataSource(this.filteredReservation);
        this.ref.detectChanges();
        this.dataSourceReservationList.paginator = this.paginator.toArray()[1];
        this.dataSourceReservationList.sort = this.sort.toArray()[1];
        this.dataLengthRes = this.filteredReservation.length || 0;
        setTimeout(() => this.dataSourceReservationList.paginator = this.paginator.toArray()[1]);
    }

    gotReservationTransfer() {
        this.router.navigate(['/reservation/reservation-transfer']);
    }

    download() {
        const data: any = this.filteredReservation,
            d = new Date(),
            todayDate = [d.getDate(), d.getMonth(), d.getFullYear()].join('-'),
            fileName = `reservation_${todayDate}`;
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

    ngAfterViewInit() {

        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        this.userId = userInfoJson.userId;
        this.getAllReservationDraft();
        this.getAllReservationWorkflow();

        if (this.dataSourceList !== undefined) {
            this.refreshTable()
        }
        if (this.dataSourceReservationList !== undefined) {
            this.refreshTableReservation();
        }
    }

}

