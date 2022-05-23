import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ReservationConfirmDialogComponent } from './reservation-confirm-dialog/reservation-confirm-dialog.component';
import { ReservationPreviewDialogComponent } from './reservation-preview/reservation-preview-dialog.component';
import { ReservationTransferPreviewComponent } from './reservation-transfer-preview/reservation-transfer-preview.component';

@Component({
    selector: 'app-reservation-draft',
    templateUrl: './reservation-draft.component.html',
    styleUrls: ['./reservation-draft.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class ReservationDraftComponent implements OnInit {
    dataSourceUserRole: any;
    resubmitData;
    userId: number;
    firstName = '';
    lastName = '';
    email = '';
    mobileNo = '';
    ppnNo = '';
    url: any = '';
    userDetail: any;
    rating = 5;
    basicInfoPLSForm: FormGroup;
    public ReservationChartData: any;
    public ReservationChartOption: any;
    @ViewChild('Reservation', { static: false }) ReservationChart: ElementRef; // used barStackedChart, barHorizontalChart
    public ReservationChartTag: CanvasRenderingContext2D;
    isApplicant: any;
    @ViewChild('emailSelect') emailSelect: MatSelect;
    public filteredEmail: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    protected _onDestroyEmail = new Subject<void>();
    public emailFilterCtrl: FormControl = new FormControl();
    emaildata: any[];
    findByEmail;
    searchForm: FormGroup;
    searchResult = [];
    userMetaData: any;
    rolesInfo;
    provinces: any;
    province: any;
    roleId: any;
    roles: any;
    tableColumns: string[] = ['roleName', 'sectionName', 'provinceName', 'isPrimary'];
    resData: any;
    resDraftData: any;
    minDate = new Date();
    surveyDate;
    purpose;
    selectedModes;
    cartData;
    selectedMode;
    form: FormGroup;
    name = '';
    emailDelivery = '';
    phone = '';
    add1 = '';
    add2 = '';
    add3 = '';
    postalCode = '';
    collectionAddress;
    deliveryEmailElec;
    isPrimary;
    surveyname;
    draftId;
    provinceId;
    formApplicant: FormGroup;
    errorMsg = '';
    formApplication: FormGroup;
    electronicEmail;
    disableEmail = false;
    processId: any;
    headerText = "Draft"
    constructor(
        private router: Router,
        private snackbar: SnackbarService,
        private restService: RestcallService,
        private dialog: MatDialog,
        private loaderService: LoaderService) {
        if (this.router.getCurrentNavigation().extras.state === undefined) {
            this.router.navigate(['/reservation/reservation-list']);
        }
        this.resData = this.router.getCurrentNavigation().extras.state.resData;
        this.processId = this.resData?.processId
        this.draftId = this.resData?.draftId;
        this.provinceId = this.resData?.provinceId;
        if (this.processId !== undefined && this.processId === 239) {
            this.headerText = "Transfer"
        }
        this.getDatabyDraftId();
    }

    getDatabyDraftId() {
        this.restService.getReservationDraftById(this.resData.draftId).subscribe(payload => {
            this.resDraftData = payload.data;
            this.loaderService.display(false);

        }, () => {
            this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            this.loaderService.display(false);
        });
    }

    ngOnInit() {
        const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
        this.userId = userInfoJson.userId;
    }

    nvaigateToReservationList() {
        this.router.navigate(['/reservation/reservation-list']);
    }

    deleteReservation() {
        const dialogRef = this.dialog.open(ReservationConfirmDialogComponent, {
            width: '50%',
            data: this.resDraftData
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res === 1) {

            } else {
                this.nvaigateToReservationList();
            }
        });
    }

    previewDraft() {
        if (this.processId === 239) {
            const dialogRef = this.dialog.open(ReservationTransferPreviewComponent, {
                width: '100%',
                height: 'auto',
                data: { draftData: this.resDraftData, resubmitData: this.resubmitData }
            });
            dialogRef.afterClosed().subscribe(() => {
            });
        } else {
            const dialogRef = this.dialog.open(ReservationPreviewDialogComponent, {
                width: '100%',
                height: 'auto',
                data: { draftData: this.resDraftData, resubmitData: this.resubmitData }
            });
            dialogRef.afterClosed().subscribe(() => {
            });
        }

    }

    receiveChildData(data) {
        this.resDraftData = data;
    }
}
