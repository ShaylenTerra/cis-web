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
import { LodgementConfirmDialogComponent } from './lodgement-confirm-dialog/lodgement-confirm-dialog.component';
import { LodgementPreviewDialogComponent } from './lodgement-preview-dialog/lodgement-preview-dialog.component';

@Component({
  selector: 'app-lodgement-draft',
  templateUrl: './lodgement-draft.component.html',
  styleUrls: ['./lodgement-draft.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class LodgementDraftComponent implements OnInit {

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
  lodgeData: any;
  lodgementDraftData: any;
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
  tempData: any = "";
  preview = false;
  readonly = false;
  showOutcome = false;
  tabIndex = 0;
  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private restService: RestcallService,
    private dialog: MatDialog,
    private loaderService: LoaderService) {
    if (this.router.getCurrentNavigation().extras.state === undefined) {
      this.router.navigate(['/lodgement/lodgement-list']);
    }
    this.lodgeData = this.router.getCurrentNavigation().extras.state.lodgeData;
    this.tempData = this.lodgeData.name;
    this.draftId = this.lodgeData?.draftId;
    this.provinceId = this.lodgeData?.provinceId;
    this.getDatabyDraftId();
  }

  getDatabyDraftId() {
    this.restService.getLodgementDraftById(this.lodgeData.draftId).subscribe(payload => {
      this.lodgementDraftData = payload.data;
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

  nvaigateToLodgementList() {
    this.router.navigate(['/lodgement/lodgement-list']);
  }

  deleteLodgement() {
    const dialogRef = this.dialog.open(LodgementConfirmDialogComponent, {
      width: '50%',
      data: this.lodgementDraftData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 1) {

      } else {
        this.nvaigateToLodgementList();
      }
    });
  }

  previewDraft() {
    const dialogRef = this.dialog.open(LodgementPreviewDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        value: this.lodgementDraftData, tempData: this.tempData
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  receiveChildData(data) {
    this.lodgementDraftData = data;
  }

  changeTab (event) {
    this.tabIndex = event.index;
 }

}
