import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ReservationReason } from '../../constants/enums';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AddStepDialogComponent } from './add-step-dialog/add-step-dialog.component';
import { AdvanceLandSearchComponent } from './advance-land-search/advance-land-search.component';
import { DeleteDraftStepDialogComponent } from './delete-draft-step-dialog/delete-draft-step-dialog.component';
import { DeletePropertyDialogComponent } from './delete-property-dialog/delete-property-dialog.component';
import { LandInfoComponent } from './land-info/land-info.component';
import { SearchMapDialogComponent } from './search-map-dialog/search-map-dialog.component';
import { ViewLandMapDialogComponent } from './view-land-map-dialog/view-land-map-dialog.component';

@Component({
  selector: 'app-land-parcel',
  templateUrl: './land-parcel.component.html',
  styleUrls: ['./land-parcel.component.css']
})
export class LandParcelComponent implements OnInit, OnDestroy, OnChanges {
  ReservationReason = ReservationReason
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
  resDraftData: any;
  form: FormGroup;
  townshipForm: FormGroup;
  @Input() showOutcome;
  @ViewChild('propertySelect') propertySelect: MatSelect;
  public filteredProperty: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyProperty = new Subject<void>();
  public propertyFilterCtrl: FormControl = new FormControl();
  propertydata: any[];
  findProperty;
  TownshipModel;
  province;
  townshipdata: any[];
  public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public townshipFilterCtrl: FormControl = new FormControl();
  protected _onDestroyTownship = new Subject<void>();
  isAddStep = false;
  newTownshipName
  constructor(private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService,
    private dialog: MatDialog, private router: Router) {
    this.form = this.fb.group({
      // reservationType: ['', Validators.required],
      assignedTownship: ''
    });
    this.townshipForm = this.fb.group({
      newTownshipName: ''
    });
  }

  ngOnInit(): void {
    this.initialise();
    this.getDatabyDraftId();
    this.getAllTownship();
  }


  ngOnDestroy() {
    this._onDestroyProperty.next();
    this._onDestroyProperty.complete();
  }

  getDatabyDraftId() {
    this.loaderService.display(true);
    this.restService.getAllDraftSteps(this.draftId).subscribe(payload => {
      this.resDraftData = payload.data;

      // for (let i = 0; i < this.resDraftData.length; i++) {
      //   if (this.resDraftData[i].otherData !== null) {
      //     this.resDraftData[i].otherData = JSON.parse(this.resDraftData[i].otherData);
      //   }
      // }
      if (this.resDraftData !== null && this.resDraftData.length > 0) {
        for (let i = 0; i < this.resDraftData.length; i++) {
          if (this.resDraftData[i].reasonItemId === ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
            this.townshipForm.patchValue({
              newTownshipName: this.resDraftData[i].otherData.toLocationName
            })
          }
        }
      }
      const len = this.resDraftData === null ? 0 : this.resDraftData.filter(x => x.reservationDraftRequestOutcome.length === 0).length;
      this.isAddStep = len > 0 ? true : false;
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  initialise() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.getListItems(268),
    ]).subscribe(([ReservationReasondata]) => {
      this.ReservationReasondata = ReservationReasondata.data;
      this.filteredReservationReason.next(this.ReservationReasondata.slice());
      this.ReservationReasonFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyReservationReason))
        .subscribe(() => {
          this.filterReservationReason();
        });
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  onChangeReasonType(event) {
    this.loaderService.display(true);
    this.restService.getReservationType(306, event.itemId).subscribe(response => {
      this.reservationTypeFilters = response.data;
      this.reservationTypeFilter = this.reservationTypeFilters.filter(x => x.isDefault === 1)[0];
      // this.onChangeReasonSubType(this.searchType);
      this.loaderService.display(false);
    }, () => {
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

  // addStep() {
  //   if (this.form.invalid) {
  //     this.form.get('reservationType').markAsTouched();
  //     this.loaderService.display(false);
  //     return;
  //   } else {
  //     const obj = {
  //       'draftId': this.draftId,
  //       'otherData': '',
  //       'parcelRequested': 1,
  //       'reasonItemId': this.form.value.reservationType.itemId,
  //       'stepNo': this.resDraftData.reservationDraftSteps.length + 1
  //     };
  //     this.restService.addDraftSteps(obj).subscribe((res: any) => {
  //         this.loaderService.display(false);
  //         this.getDatabyDraftId();
  //     }, error => {
  //         this.loaderService.display(false);
  //     });
  //   }
  // }

  addStep(): void {
    const dialogRef = this.dialog.open(AddStepDialogComponent, {
      width: '550px',
      autoFocus: false,
      data: {
        draftId: this.draftId,
        stepNo: this.resDraftData === null ? 1 : this.resDraftData.length + 1,
        provinceId: this.provinceId
      }
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
      this.getDatabyDraftId();
    });
  }

  protected setInitialPropertyValue() {
    this.filteredProperty
      .pipe(take(1), takeUntil(this._onDestroyProperty))
      .subscribe(() => {
        this.propertySelect.compareWith = (a: any, b: any) => a && b && a.lpi === b.lpi;
      });
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

  loadPropertyData(val, stepId) {
    const stepData = this.resDraftData.filter(x => x.stepId === stepId)[0];
    let locationId = 0;
    if (stepData.reservationDraftRequests.length > 0) {
      locationId = stepData.reservationDraftRequests[0].locationId;
    }
    forkJoin([
      this.restService.getReservationRequest(locationId, this.provinceId, val),
    ]).subscribe(([searchbyKey]) => {
      this.propertydata = searchbyKey.data;
      this.filteredProperty.next(this.propertydata.slice());
      this.propertyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProperty))
        .subscribe(() => {
          this.filterByProperty();
        });
    });
  }

  changeProperty(e, stepId) {
    if (e !== '' && e.length > 3) {
      this.loadPropertyData(e, stepId);
    }
  }

  addDraftRequest(stepId) {
    this.loaderService.display(true);
    let isValidProperty = false;
    const stepData = this.resDraftData.filter(x => x.stepId === stepId)[0];
    if (stepData.reasonItemId === this.ReservationReason.SUBDIVISION || stepData.reasonItemId === this.ReservationReason.LEASE) {
      if (stepData.reservationDraftRequests.length >= 1) {
        this.snackbar.openSnackBar('You can add only one property for ' + stepData.requestReason, 'Warning');
        this.loaderService.display(false);
        return;
      }
    }
    if (stepData.reasonItemId === this.ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
      if (stepData.reservationDraftRequests.length >= 1) {
        this.snackbar.openSnackBar('Only one farm property allowed.', 'Warning');
        this.loaderService.display(false);
        return;
      }
    }
    if (stepData.reservationDraftRequests.length > 0) {
      const obj1 = stepData.reservationDraftRequests.filter(x => x.locationId === this.findProperty.registrationTownshipId);
      if (obj1.length > 0) {
        const duplicate = stepData.reservationDraftRequests.filter(x => x.lpi === this.findProperty.lpi);
        if (duplicate.length > 0) {
          this.snackbar.openSnackBar('Property already added', 'Warning');
          this.loaderService.display(false);
          return;
        }
        isValidProperty = true;
      } else {
        isValidProperty = false;
        this.snackbar.openSnackBar('Property should be same location', 'Warning');
        this.loaderService.display(false);
        return;
      }
    } else {
      isValidProperty = true;
    }
    const obj = {
      'designation': this.findProperty.designation,
      'location': this.findProperty.registrationTownshipName,
      'locationId': this.findProperty.registrationTownshipId,
      'lpi': this.findProperty.lpi,
      'parcel': this.findProperty.parcel,
      'portion': this.findProperty.portion,
      'recordId': this.findProperty.recordId,
      'recordTypeId': this.findProperty.recordTypeId,
      'stepId': stepId
    };
    this.restService.addDraftRequest(obj).subscribe((res: any) => {
      this.loaderService.display(false);
      this.propertydata = [];
      this.filteredProperty.next(this.propertydata.slice());
      this.propertyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProperty))
        .subscribe(() => {
          this.filterByProperty();
        });
      this.getDatabyDraftId();
    }, error => {
      this.loaderService.display(false);
    });
  }

  deleteDraftRequest(value) {
    // this.loaderService.display(true);
    // this.restService.deleteDraftRequestById(value.draftRequestId).subscribe((res: any) => {
    //   this.loaderService.display(false);
    //   this.getDatabyDraftId();
    // }, error => {
    //     this.loaderService.display(false);
    // });
    const dialogRef = this.dialog.open(DeletePropertyDialogComponent, {
      width: '50%',
      // height: '30%',
      data: value.draftRequestId
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getDatabyDraftId();
    });
  }

  processOutcome(stepId, reasonItemId) {

    const stepObj = this.resDraftData.filter(x => x.stepId === stepId)[0];
    if (reasonItemId === ReservationReason.REDESIGNATION) {
      if (this.form.invalid) {
        this.form.get('assignedTownship').markAsTouched();
        this.snackbar.openSnackBar('please select township', 'Warning');
        return;
      } else {
        let objData = this.townshipdata.filter(x => x.boundaryId === this.form.value.assignedTownship)[0]
        stepObj.otherData = { 'toLocationId': objData.boundaryId, 'toLocationName': objData.majorRegionOrAdminDistrict };
      }
    }
    if (reasonItemId === ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
      if (this.townshipForm.invalid) {
        this.townshipForm.get('newTownshipName').markAsTouched();
        this.snackbar.openSnackBar('Enter New Township/Allotment Name', 'Warning');
        return;
      }
    }

    if (stepObj.otherData !== null) {
      if (reasonItemId === ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
        stepObj.otherData.toLocationName = this.townshipForm.value.newTownshipName;
      }

      if (reasonItemId === ReservationReason.EXTENSIONOFTOWNSHIPS) {
        if (stepObj.reservationDraftRequests.length > 0) {
          let data = stepObj.reservationDraftRequests[0];
          stepObj.otherData = { 'toLocationId': data.locationId, 'toLocationName': data.location };
        }
      }
    }
    if (stepObj.reservationDraftRequests.length > 0) {
      this.loaderService.display(true);
      if (reasonItemId === ReservationReason.EXTENSIONOFTOWNSHIPS) {
        let data = stepObj.reservationDraftRequests[0];
        stepObj.otherData = { 'toLocationId': data.locationId, 'toLocationName': data.location };
      }
      stepObj.otherData = JSON.stringify(stepObj.otherData);
      this.restService.processDraftStepsRequest(stepObj).subscribe((res: any) => {
        this.loaderService.display(false);
        this.getDatabyDraftId();
      }, error => {
        this.loaderService.display(false);
      });
    } else {
      this.snackbar.openSnackBar('Minimum 1 property require to process request', 'Warning');
      return;
    }
  }

  navigateToLandProfile(lpi, recordId) {
    this.router.navigate(['/land-profile'], { state: { lpi: lpi, recordId: recordId } });
  }

  viewOnMap(stepId, draftId) {
    const dialogRef = this.dialog.open(ViewLandMapDialogComponent, {
      width: '100%',
      height: '99%',
      data: { stepId: stepId, draftId: draftId }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  searchOnMap(stepId, draftId) {
    const dialogRef = this.dialog.open(SearchMapDialogComponent, {
      width: '100%',
      height: '99%',
      data: { stepId: stepId, draftId: draftId }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }


  landInfo(data) {

    const dialogRef = this.dialog.open(LandInfoComponent, {
      width: 'auto',
      height: 'auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  addRecord() {

    const dialogRef = this.dialog.open(AdvanceLandSearchComponent, {
      width: '80%',
      height: 'auto'
      // data: data
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  getAllTownship() {
    this.loaderService.display(true);
    // this.assignTownship = '';
    this.form.get('assignedTownship').reset();
    this.restService.getReservationTownshipAllotment(this.provinceId).subscribe(response => {
      this.townshipdata = response.data;
      this.filteredTownship.next(this.townshipdata.slice());
      this.townshipFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyTownship))
        .subscribe(() => {
          this.filterTownships();
        });
      // this.setInitialTownshipValue();
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  protected filterTownships() {
    if (!this.townshipdata) {
      return;
    }
    let search = this.townshipFilterCtrl.value;
    if (!search) {
      this.filteredTownship.next(this.townshipdata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTownship.next(
      this.townshipdata.filter(bank => bank.majorRegionOrAdminDistrict.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnChanges() {
  }


  addExtTownship(data, stepId) {

    this.loaderService.display(true);
    const stepData = this.resDraftData.filter(x => x.stepId === stepId)[0];
    if (stepData.reasonItemId === this.ReservationReason.EXTENSIONOFTOWNSHIPS) {
      if (stepData.reservationDraftRequests.length >= 1) {
        this.snackbar.openSnackBar('You can add only one township for ' + stepData.requestReason, 'Warning');
        this.loaderService.display(false);
        return;
      }
    }
    const obj = {
      'designation': '',
      'location': data.majorRegionOrAdminDistrict,
      'locationId': data.boundaryId,
      'lpi': '',
      'parcel': '',
      'portion': '',
      'recordId': '',
      'recordTypeId': '',
      'stepId': stepId
    };
    this.restService.addDraftRequest(obj).subscribe((res: any) => {
      this.loaderService.display(false);
      this.propertydata = [];
      this.filteredProperty.next(this.propertydata.slice());
      this.propertyFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProperty))
        .subscribe(() => {
          this.filterByProperty();
        });
      this.getDatabyDraftId();
    }, error => {
      this.loaderService.display(false);
    });
  }

  deleteDraftStep(value) {

    const dialogRef = this.dialog.open(DeleteDraftStepDialogComponent, {
      width: '50%',
      // height: '30%',
      data: value
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getDatabyDraftId();
    });
  }
}
