import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ReservationReason } from '../../constants/enums';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';

@Component({
  selector: 'app-reservation-emulator',
  templateUrl: './reservation-emulator.component.html',
  styleUrls: ['./reservation-emulator.component.css']
})
export class ReservationEmulatorComponent implements OnInit {
  ReservationReason = ReservationReason;
  emulatorForm: FormGroup;
  administrationDistrictStatus = true;
  TownshipStatus = true;
  columns = ['sgNo', 'lpi', 'documentType', 'documentSubType', 'region', 'regionTownship', 'parcel', 'designation'];
  columns2 = [];
  @ViewChild('provinceSelect') provinceSelect: MatSelect;
  @ViewChild('searchTypeSelect') searchTypeSelect: MatSelect;
  @ViewChild('municipalitySelect') municipalitySelect: MatSelect;
  @ViewChild('townshipSelect') townshipSelect: MatSelect;
  @ViewChild('toTownshipSelect') toTownshipSelect: MatSelect;
  page = 0;
  size = 5;
  PageFrom = 1;
  PageTo = 5;
  page2 = 0;
  size2 = 5;
  PageFrom2 = 1;
  PageTo2 = 5;
  municipality;
  device = false;
  userId;
  results;
  province;
  searchType;
  reservationTypeFilters;
  reservationTypeFilter;
  reservationSubTypeFilter;
  townshipdata: any[];
  toTownshipdata: any[];
  municipalitydata: any[];
  provincepdata: any[];
  ReservationReasondata: any[];
  data: any[] = [];
  ReservationDetailsdata: any[] = [];
  adminRegistrationDistricts;
  adminRegistrationDistrict;
  Township;
  Province;
  public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredToTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredMunicipality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredReservationReason: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  assignTownship;
  assignMunicipality;
  assignProvince;
  dataLength;
  ReservationDetailsLength;
  dataSource: any;
  dataSource1: any;
  algo;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public boundaryPage: number;
  public provinceFilterCtrl: FormControl = new FormControl();
  public ReservationReasonFilterCtrl: FormControl = new FormControl();
  public townshipFilterCtrl: FormControl = new FormControl();
  public toTownshipFilterCtrl: FormControl = new FormControl();
  public municipalityFilterCtrl: FormControl = new FormControl();
  protected _onDestroyProvince = new Subject<void>();
  protected _onDestroyTownship = new Subject<void>();
  protected _onDestroyToTownship = new Subject<void>();
  protected _onDestroyMunicipality = new Subject<void>();
  protected _onDestroyReservationReason = new Subject<void>();
  TownshipModel;
  newTownshipName;
  toTownshipModel;
  MunicipalityModel;
  selection = new SelectionModel<any>(true, []);
  subType: any[] = [];
  text = 'Township/Allotment';
  text2 = 'To Township/Allotment';
  disableParcel = false;
  showParcel = false;
  parcel: any = "";
  constructor(private router: Router, private restService: RestcallService,
    private loaderService: LoaderService,
    private dialog: MatDialog, private fb: FormBuilder) {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.dataSource.data.length || 0;

    this.dataSource1 = new MatTableDataSource(this.ReservationDetailsdata);
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
    this.ReservationDetailsLength = this.dataSource1.data.length || 0;
    this.emulatorForm = this.fb.group({
      reservationReason: [''],
      reservationType: ['', Validators.required],
      reservationSubType: ['', Validators.required],
      numberOfRequested: ['', Validators.required],
      assignedProvince: [''],
      assignedTownship: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initialise();
  }

  initialise() {
    this.loaderService.display(true);
    this.assignProvince = '';
    forkJoin([
      this.restService.getProvinces(),
      this.restService.getListItems(268),
    ]).subscribe(([provinces, ReservationReason]) => {
      this.searchType = ReservationReason.data.filter(x => x.isDefault === 1)[0];
      this.ReservationReasondata = ReservationReason.data;
      this.provincepdata = provinces.data.filter(x => x.provinceId !== -1);
      this.province = this.provincepdata[0];
      this.filteredProvince.next(this.provincepdata.slice());
      this.provinceFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProvince))
        .subscribe(() => {
          this.filterProvinces();
        });
      this.onChangeReasonType(this.searchType);
      this.getAllTownship();
      this.filteredReservationReason.next(this.ReservationReasondata.slice());
      this.ReservationReasonFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyReservationReason))
        .subscribe(() => {
          this.filterReservationReason();
        });
    });
    this.loaderService.display(false);
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

  protected filterToTownships() {
    if (!this.toTownshipdata) {
      return;
    }
    let search = this.toTownshipFilterCtrl.value;
    if (!search) {
      this.filteredToTownship.next(this.toTownshipdata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredToTownship.next(
      this.toTownshipdata.filter(bank => bank.majorRegionOrAdminDistrict.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterMunicipality() {
    if (!this.municipalitydata) {
      return;
    }
    let search = this.municipalityFilterCtrl.value;
    if (!search) {
      this.filteredMunicipality.next(this.municipalitydata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMunicipality.next(
      this.municipalitydata.filter(bank => bank.municipality.toLowerCase().indexOf(search) > -1)
    );
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

  protected setInitialTownshipValue() {
    this.filteredTownship
      .pipe(take(1), takeUntil(this._onDestroyTownship))
      .subscribe(() => {
        this.townshipSelect.compareWith = (a: any, b: any) => a && b && a.boundaryId === b.boundaryId;
      });
  }

  protected setInitialToTownshipValue() {
    this.filteredToTownship
      .pipe(take(1), takeUntil(this._onDestroyToTownship))
      .subscribe(() => {
        this.toTownshipSelect.compareWith = (a: any, b: any) => a && b && a.boundaryId === b.boundaryId;
      });
  }

  protected setInitialMunicipalityValue() {
    this.filteredMunicipality
      .pipe(take(1), takeUntil(this._onDestroyMunicipality))
      .subscribe(() => {
        this.municipalitySelect.compareWith = (a: any, b: any) => a && b && a.boundaryId === b.boundaryId;
      });
  }

  protected filterProvinces() {
    if (!this.provincepdata) {
      return;
    }
    let search = this.provinceFilterCtrl.value;
    if (!search) {
      this.filteredProvince.next(this.provincepdata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProvince.next(
      this.provincepdata.filter(bank => bank.provinceName.toLowerCase().indexOf(search) > -1)
    );
  }

  changeProvince() {
    this.getAllTownship();
    // if (this.reservationTypeFilter.caption === 'ERF' || this.reservationTypeFilter.caption === 'Agricultural Holding') {
    //   this.getAllMunicipalitiesByProvinceCode()
    // } else if (this.reservationTypeFilter.caption === 'Farm' || this.reservationTypeFilter.caption === 'Lease') {
    //   this.getAllTownship();
    // }
  }
  getAllMunicipalitiesByProvinceCode() {
    this.loaderService.display(true);
    this.assignMunicipality = '';
    this.restService.getReservationTownshipAllotment(this.province.provinceId).subscribe(response => {
      this.municipalitydata = response.data;
      this.filteredMunicipality.next(this.municipalitydata.slice());
      this.municipalityFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyMunicipality))
        .subscribe(() => {
          this.filterMunicipality();
        });
      // this.setInitialMunicipalityValue();
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  getAllTownship() {
    this.loaderService.display(true);
    // this.assignTownship = '';
    this.emulatorForm.get('assignedTownship').reset();
    this.restService.getReservationTownshipAllotment(this.province.provinceId).subscribe(response => {
      this.townshipdata = response.data;
      this.toTownshipdata = response.data;
      this.filteredTownship.next(this.townshipdata.slice());
      this.filteredToTownship.next(this.toTownshipdata.slice());
      this.townshipFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyTownship))
        .subscribe(() => {
          this.filterTownships();
        });
      this.toTownshipFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyToTownship))
        .subscribe(() => {
          this.filterToTownships();
        });
      // this.setInitialTownshipValue();
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  onChangeType(event) {
    if (event.caption === 'ERF' || event.caption === 'Agricultural Holding') {
      this.text = 'Township/Allotment';
    } else if (event.caption === 'Farm' || event.caption === 'Lease') {
      this.text = 'Administration District/Registration Division';
    }
    // this.getAllTownship();
  }

  onChangeReasonType(event) {
    this.loaderService.display(true);
    this.restService.getReservationType(306, event.itemId).subscribe(response => {
      this.reservationTypeFilters = response.data;
      this.reservationTypeFilter = this.reservationTypeFilters.filter(x => x.isDefault === 1)[0];
      this.onChangeReasonSubType(this.searchType);
      this.setParcel();
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  onChangeReasonSubType(event) {

    this.loaderService.display(true);
    this.onChangeType(event);
    this.restService.getReservationSubType(346, this.searchType.itemId).subscribe(response => {
      this.subType = response.data;
      this.reservationSubTypeFilter = this.subType.filter(x => x.isDefault === 1)[0];
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  search() {
    if (this.emulatorForm.invalid) {
      this.emulatorForm.get('reservationType').markAsTouched();
      this.emulatorForm.get('reservationSubType').markAsTouched();
      this.emulatorForm.get('numberOfRequested').markAsTouched();
      this.emulatorForm.get('assignedTownship').markAsTouched();
    } else {
      const payload = {
        'locationId': this.TownshipModel,
        'noOfParcel': this.emulatorForm.value.numberOfRequested,
        'provinceId': this.province.provinceId,
        'reservationReason': this.emulatorForm.value.reservationReason.itemId,
        'reservationSubType': this.emulatorForm.value.reservationSubType.itemId,
        'reservationType': this.emulatorForm.value.reservationType.itemId,
        'parcel': this.parcel
      };
      this.loaderService.display(true);
      this.restService.processReservation(payload).subscribe((res: any) => {
        this.data = res.data.parentParcels;
        this.ReservationDetailsdata = res.data.reservationDetails;
        this.algo = res.data.algorithm;
        this.bindTable();
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });
    }
  }

  bindTable() {
    if (this.data != null) {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataLength = this.dataSource.data.length || 0;
    }
    if (this.ReservationDetailsdata != null) {
      let objData = this.ReservationDetailsdata.filter(x => x.leaseNo !== null);
      if (objData.length === 0) {
        this.columns2 = ['lpi', 'designation', 'parcel', 'portion'];
      } else {
        this.columns2 = ['lpi', 'designation', 'parcel', 'portion', 'leaseNo'];
      }
      this.dataSource1 = new MatTableDataSource(this.ReservationDetailsdata);
      this.dataSource1.paginator = this.paginator;
      this.dataSource1.sort = this.sort;
      this.ReservationDetailsLength = this.dataSource1.data.length || 0;
    }
  }

  setParcel() {
    if (this.searchType.itemId === ReservationReason.CONSOLIDATION ||
      this.searchType.itemId === ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
      this.disableParcel = true;
      this.emulatorForm.patchValue({
        numberOfRequested: 1
      });
    } else {
      this.disableParcel = false;
    }
  }
  onChangeSubType(event) {
    if (event.value.caption === 'CON_SAME_ERF_DIFF_PORTION') {
      this.showParcel = true;
    } else {
      this.showParcel = false;
    }
  }


}
