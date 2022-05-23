import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LandInfoComponent } from '../../reservation/land-parcel/land-info/land-info.component';
import { SearchMapDialogComponent } from '../../reservation/land-parcel/search-map-dialog/search-map-dialog.component';
import { ViewLandMapDialogComponent } from '../../reservation/land-parcel/view-land-map-dialog/view-land-map-dialog.component';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { PaymentViewDetailsDialogComponent } from '../payment-details/payment-view-details-dialog/payment-view-details-dialog.component';
import { LodgementDocumentDialogComponent } from './lodgement-document-dialog/lodgement-document-dialog.component';
import { UploadLodgeDocDialogComponent } from './upload-lodge-doc-dialog/upload-lodge-doc-dialog.component';

@Component({
  selector: 'app-lodgement-document',
  templateUrl: './lodgement-document.component.html',
  styleUrls: ['./lodgement-document.component.css']
})
export class LodgementDocumentComponent implements OnInit, OnDestroy, OnChanges {

  public filteredReservationReason: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('searchTypeSelect') searchTypeSelect: MatSelect;
  public ReservationReasonFilterCtrl: FormControl = new FormControl();
  protected _onDestroyReservationReason = new Subject<void>();
  searchType;
  ReservationReasondata: any[];
  reservationTypeFilters;
  reservationTypeFilter;
  @Input() draftId;
  @Input() provinceId;
  @Input() readonly;
  // readonly = false;

  lodgeDraftData: any[] = [];
  form: FormGroup;
  @Input() showOutcome;
  @Input() tempData;
  @Input() preview;
  draftData;
  @ViewChild('propertySelect') propertySelect: MatSelect;
  @Output() outputFromChild: EventEmitter<any> = new EventEmitter();
  public filteredProperty: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyProperty = new Subject<void>();
  public propertyFilterCtrl: FormControl = new FormControl();
  propertydata: any[];
  findProperty;

  isAddStep = false;
  constructor(private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService,
    private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    // this.getDatabyDraftId()
  }

  changeProperty(e) {

    if (e !== '' && e.length > 3) {
      this.getDraftRequest(e);
    }
  }


  getDraftRequest(value) {
    this.loaderService.display(true);
    forkJoin([
      this.restService.searchDraftRequest(value)
    ]).subscribe(([DraftRequest]) => {

      this.propertydata = DraftRequest.data;
      this.filteredProperty.next(this.propertydata.slice());
      this.propertyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProperty))
        .subscribe(() => {
          this.filterByProperty();
        });
    });
    this.loaderService.display(false);
  }



  protected filterByProperty() {
    if (!this.propertydata) {
      return;
    }
    let search = this.propertyFilterCtrl.value;
    if (!search) {
      this.filteredProperty.next(this.propertydata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProperty.next(
      this.propertydata.filter(x => x.lpi.toLowerCase().indexOf(search) > -1)
    );
  }

  addDraftRequest(stepId) {

    const obj = {
      'designation': this.findProperty.designation,
      'locationId': this.findProperty.locationId,
      'lpi': this.findProperty.lpi,
      'outcomeIdReservation': this.findProperty.outcomeId,
      'stepId': stepId
    };
    this.loaderService.display(true);
    this.restService.addLodgementRequest(obj).subscribe((res: any) => {

      this.loaderService.display(false);
      this.propertydata = [];
      this.filteredProperty.next(this.propertydata.slice());
      this.propertyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProperty))
        .subscribe(() => {
          this.filterByProperty();
        });
      this.getAllLodgementDraftSteps();
    }, error => {
      this.loaderService.display(false);
    });
  }

  protected filterReservationReason() {
    if (!this.ReservationReasondata) {
      return;
    }
    let search = this.ReservationReasonFilterCtrl.value;
    if (!search) {
      this.filteredReservationReason.next(this.ReservationReasondata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredReservationReason.next(
      this.ReservationReasondata.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }


  ngOnDestroy() {
    this._onDestroyProperty.next();
    this._onDestroyProperty.complete();
  }

  getDatabyDraftId() {
    this.loaderService.display(true);
    this.restService.getLodgementDraftById(this.draftId).subscribe(payload => {
      this.draftData = payload.data;
      this.outputFromChild.emit(this.draftData);
      this.getAllLodgementDraftSteps()
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  getAllLodgementDraftSteps() {
    this.loaderService.display(true);
    this.restService.getAllLodgementDraftSteps(this.draftId).subscribe(payload => {
      this.lodgeDraftData = payload.data;
      if (this.lodgeDraftData !== null) {
        for (let i = 0; i < this.lodgeDraftData.length; i++) {
          this.lodgeDraftData[i].totalDocuments = 0;
          for (let j = 0; j < this.lodgeDraftData[i].lodgementDraftRequests.length; j++) {
            this.lodgeDraftData[i].totalDocuments = this.lodgeDraftData[i].totalDocuments +
              this.lodgeDraftData[i].lodgementDraftRequests[j].lodgementDraftDocuments.length;
          }
        }
      }
      // const len = this.lodgeDraftData === null ? 0 : this.lodgeDraftData.filter(x => x.reservationDraftRequestOutcome.length === 0).length;
      // this.isAddStep = len > 0 ? true : false;
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }


  addDocument(): void {
    let data = {
      'draftId': this.draftId,
      'stepNo': this.lodgeDraftData == null ? 1 : this.lodgeDraftData.length + 1
    }
    const dialogRef = this.dialog.open(LodgementDocumentDialogComponent, {
      width: '550px',
      autoFocus: false,
      data: data
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
      this.getAllLodgementDraftSteps();
    });
  }

  viewOnMap(stepId, draftId) {
    const dialogRef = this.dialog.open(ViewLandMapDialogComponent, {
      width: '100%',
      height: '99%',
      data: { stepId: stepId, draftId: this.draftId, val: '&from=LDG' }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  searchOnMap(stepId, draftId) {
    const dialogRef = this.dialog.open(SearchMapDialogComponent, {
      width: '100%',
      height: '99%',
      data: { stepId: stepId, draftId: this.draftId, val: '&from=LDG' }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  viewDetails(stepId) {

    const dialogRef = this.dialog.open(PaymentViewDetailsDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { draftId: this.draftId, stepId: stepId }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  UploadLodgeDoc(stepId, requestId, values, designation) {
    let data = {
      'stepId': stepId,
      'requestId': requestId,
      'draftId': this.draftId,
      'documentItemId': values.documentItemId,
      'reasonItemId': values.reasonItemId,
      'designation': designation
    }
    const dialogRef = this.dialog.open(UploadLodgeDocDialogComponent, {
      width: '70%',
      height: 'auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getDatabyDraftId();
    });
  }

  deleteRequest(data) {
    this.loaderService.display(true);
    this.restService.removeRequestFromStep(data.requestId).subscribe((res) => {
      this.loaderService.display(false);
      this.getAllLodgementDraftSteps();
    });
  }

  navigateToLandProfile(lpi, recordId) {
    this.router.navigate(['/land-profile'], { state: { lpi: lpi, recordId: recordId } });
  }

  landInfo(data) {
    const dialogRef = this.dialog.open(LandInfoComponent, {
      width: 'auto',
      height: 'auto',
      data: { value: data.parentParcels, header: 'Lodgement' }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  navigateTaskProfile(workflowId) {
    if (workflowId !== null) {
      this.restService.getWorkFlow(workflowId).subscribe((res) => {
        this.loaderService.display(false);
        this.router.navigate(['/task-profile'], { state: { taskDetail: res.data } });
      });
    } else {
      this.snackbar.openSnackBar('WorkflowId is not available', 'Warning');
    }

  }

  ngOnChanges() {
    this.getDatabyDraftId();
  }
}
