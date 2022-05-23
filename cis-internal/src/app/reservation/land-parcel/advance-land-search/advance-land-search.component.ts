import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take, map } from 'rxjs/operators';
import { AddtocartDialogComponent } from '../../../search/search-page/addtocart-dialog/addtocart-dialog.component';
import { AddtocartNgiDialogComponent } from '../../../search/search-page/addtocart-ngi-dialog/addtocart-ngi-dialog.component';
import { SearchRequestModalComponent } from '../../../search/search-page/search-request-modal/search-request-modal.component';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';

@Component({
  selector: 'app-advance-land-search',
  templateUrl: './advance-land-search.component.html',
  styleUrls: ['./advance-land-search.component.css']
})
export class AdvanceLandSearchComponent implements OnInit {
  @ViewChild('provinceSelect') provinceSelect: MatSelect;
  @ViewChild('searchTypeSelect') searchTypeSelect: MatSelect;
  @ViewChild('municipalitySelect', { static: false }) municipalitySelect: MatSelect;
  @ViewChild('townshipSelect', { static: false }) townshipSelect: MatSelect;
  public townshipFilterCtrl: FormControl = new FormControl();
  public provinceFilterCtrl: FormControl = new FormControl();
  protected _onDestroyProvince = new Subject<void>();
  protected _onDestroySearchType = new Subject<void>();
  protected _onDestroyTownship = new Subject<void>();
  protected _onDestroyMunicipality = new Subject<void>();
  fileToUpload: File = null;
  loggedUserData: any;
  requesterdata;
  dialogdata;
  requestorClient = 439;
  provinceForm: FormGroup;
  searchFiltersForm: FormGroup;
  requesterForm: FormGroup;
  assignProvince;
  assignMunicipality;
  assignTownship;
  provincepdata: any[];
  criteriadata: any[];
  municipalitydata: any[];
  townshipdata: any[];
  criteriaForm: FormGroup;
  sectionalTitle: FormGroup;
  municipalityForm: FormGroup;
  townshipForm: FormGroup;
  Holdings: FormGroup;
  farmForm: FormGroup;
  rangeSearch: FormGroup;
  sectionalerf: FormGroup;
  textSearch: FormGroup;
  Province;
  province;
  searchType;
  searchFilter;
  searchNumber;
  ERF: FormGroup;
  Lease: FormGroup;
  userId;
  selection = new SelectionModel<any>(true, []);
  public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCriteria: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public searchTypeFilterCtrl: FormControl = new FormControl();
  public municipalityFilterCtrl: FormControl = new FormControl();
  results;
  NgiData;
  filterDataBack: any;
  searchFilters;
  filteredSearchFilters;
  Township;
  TownshipModel;
  public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  municipality;
  municipalityModel;
  public filteredMuncipality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  showMunicipalityFarm = true;
  showMunicipalityERF = true;
  showMunicipalityLPI = true;
  showMunicipalityHolding = true;
  showMunicipalityERFFARM = true;
  showTownshipERF = true;
  showTownshipFarm = true;
  showRange = true;
  showFarmLabel = true;
  foundRecord: any = 0;
  totalTemplateRecords: any = 0;
  templateAuditId: any = 0;
  serverDate: any;
  public boundaryPage: number;
  pageSize: any = 1;
  pageNo: any = 1;
  totalCount: any;
  pageFromValue: any;
  pageToValue: any;
  dataSource;
  dataLength;
  searchBy: string[] = ['Number', 'Parcel Description', 'Free Text', 'Sectional Title', 'NGI Data', 'Data List-Numeric Data'];
  columns = ['select', 'sgNo', 'lpi', 'documentType', 'documentSubtype', 'region', 'parcel'];
  requestor: any = 'yes';
  device = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<AdvanceLandSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private router: Router, private restService: RestcallService,
    private loaderService: LoaderService, private dialog: MatDialog

  ) {
    this.provinceForm = this.fb.group({
      assignedProvince: ''
    });

    this.criteriaForm = this.fb.group({
      assignedCriteria: ''
    });

    this.searchFiltersForm = this.fb.group({
      assignedSearchFilters: ''
    });

    this.municipalityForm = this.fb.group({
      assignedMunicipality: ''
    });
    this.townshipForm = this.fb.group({
      assignedTownship: ''
    });
    this.ERF = this.fb.group({
      lpi: '',
      farmName: '',
      portion: '',
      provinceId: '',
      searchTypeId: '',
      searchFilterId: '',
      provinceShortName: '',
      userId: '',
      municipalityCode: '',
      parcelNumber: '',
      township: ''
    });

    this.requesterForm = this.fb.group({
      firstName: ['', Validators.required],
      surName: ['', Validators.required],
      email: ['', Validators.required],
      fax: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      addressLine3: [''],
      contactNo: ['', Validators.required],
      postalCode: ['']
      // Description: '',
      // Notes: ['', Validators.required],
    });
    this.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    this.loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
    this.boundaryPage = 1;
  }

  ngOnInit(): void {
    this.initialise()
  }

  get getMuncipality() {
    return this.municipalityForm.get('assignedMunicipality');
  }

  initialise() {
    // this.loaderService.display(true);
    this.assignProvince = '';
    forkJoin([
      this.restService.getProvinces(),
      this.restService.getSearchTypeCriteria(0),
    ]).subscribe(([provinces, searchTypes]) => {
      this.searchType = searchTypes.data.filter(x => x.name === "Parcel Description")[0];;
      this.criteriadata = searchTypes.data;

      this.provincepdata = provinces.data.filter(x => x.provinceId !== -1);
      this.province = this.provincepdata.filter(x => x.provinceName === "KwaZulu-Natal")[0];

      this.filteredProvince.next(this.provincepdata.slice());
      this.provinceFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyProvince))
        .subscribe(() => {
          this.filterProvinces();
        });

      this.filteredCriteria.next(this.criteriadata.slice());
      this.searchTypeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroySearchType))
        .subscribe(() => {
          this.filterSeachTypes();
        });

      if (this.filterDataBack !== undefined) {
        const fitlData = JSON.parse(this.filterDataBack.searchData);
        this.province = fitlData.province;
      }
      if (this.filterDataBack !== undefined) {
        this.assignTownship = '';
        this.assignMunicipality = '';
        forkJoin([
          this.restService.getMunicipality(this.province.provinceId),
          this.restService.getMajorRegionOrAdminDistrict(this.province.provinceId)
        ]).subscribe(([municip, towns]) => {
          this.municipalitydata = municip.data;
          this.filteredMuncipality.next(this.municipalitydata.slice());
          this.municipalityFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroyMunicipality))
            .subscribe(() => {
              this.filterMunicipalities();
            });
          this.setInitialMunicipalityValue();

          this.townshipdata = towns.data;
          this.filteredTownship.next(this.townshipdata.slice());
          this.townshipFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroyTownship))
            .subscribe(() => {
              this.filterTownships();
            });
          this.setInitialTownshipValue();

          this.getSearchTypeConfig(false, false, true);
        });
      } else {
        this.getSearchTypeConfig(false, false, false);
      }

    });

    this.loaderService.display(false);
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

  protected filterSeachTypes() {
    if (!this.criteriadata) {
      return;
    }
    let search = this.searchTypeFilterCtrl.value;
    if (!search) {
      this.filteredCriteria.next(this.criteriadata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCriteria.next(
      this.criteriadata.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  get getSearchFilters() {
    return this.searchFiltersForm.get('assignedSearchFilters');
  }

  get getProvince() {
    return this.provinceForm.get('assignedProvince');
  }

  get getCriteria() {
    return this.criteriaForm.get('assignedCriteria');
  }

  getSearchFilter() {
    this.results = undefined;
    this.NgiData = undefined;
    this.selection = new SelectionModel<any>(true, []);
    this.searchNumber = '';
    this.sectionalTitle.reset();
    // this.rangeSearch.reset();
    this.municipalityForm.patchValue({
      assignedMunicipality: ''
    });
    this.townshipForm.patchValue({
      assignedTownship: ''
    });
    this.Holdings.reset();
    this.farmForm.reset();
    this.ERF.reset();
    this.Lease.reset();
    this.rangeSearch = this.fb.group({
      farmName: '',
      parcel: '',
      parcelFrom: '',
      parcelTo: '',
      portionFrom: '',
      portionTo: '',
      provinceId: 0,
      searchFilterId: 0,
      searchTypeId: 0,
      provinceShortName: '',
      sgNo: '',
      township: '',
      userId: 0,
      municipalityCode: '',
    });
    this.sectionalerf = this.fb.group({
      parcel: 12,
      portion: '',
      municipalityCode: '',
      township: '',
      provinceId: '',
      searchTypeId: '',
      searchFilterId: '',
      provinceShortName: '',
      userId: '',
    });
    this.textSearch = this.fb.group({
      localMunicipalityName: '',
      lpi: '',
      parcel: '',
      provinceId: 0,
      searchFilterId: 0,
      searchTypeId: 0,
      provinceShortName: '',
      sgNo: '',
      userId: 0
    });
    // this.setFilterData();
  }

  // setFilterData() {
  //   if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
  //     this.searchType.searchTypeId === 10 && this.searchFilter.name === 'Farm') {
  //     this.showMunicipalityFarm = false;
  //   } else {
  //     this.showMunicipalityFarm = true;
  //   }
  //   if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
  //     this.searchType.searchTypeId === 10 && this.searchFilter.name === 'ERF') {
  //     this.showMunicipalityERF = false;
  //   } else {
  //     this.showMunicipalityERF = true;
  //   }
  //   if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
  //     this.searchType.searchTypeId === 10 && this.searchFilter.name === 'LPI') {
  //     this.showMunicipalityLPI = false;
  //   } else {
  //     this.showMunicipalityLPI = true;
  //   }
  //   if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
  //     this.searchType.searchTypeId === 10 && this.searchFilter.name === 'Holdings') {
  //     this.showMunicipalityHolding = false;
  //   } else {
  //     this.showMunicipalityHolding = true;
  //   }
  //   if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 && this.searchType.searchTypeId === 11) {
  //     if (this.searchFilter.name !== 'ERF' || this.searchFilter.name !== 'FARM') {
  //       this.showMunicipalityERFFARM = false;
  //     } else {
  //       this.showMunicipalityERFFARM = true;
  //     }
  //     if (this.searchFilter.name === 'ERF') {
  //       this.showTownshipERF = false;
  //     } else {
  //       this.showTownshipERF = true;
  //     }
  //     if (this.searchFilter.name.includes('FARM')) {
  //       this.showTownshipFarm = false;
  //     } else {
  //       this.showTownshipFarm = true;
  //     }
  //   } else {
  //     this.showMunicipalityERFFARM = true;
  //     this.showTownshipERF = true;
  //     this.showTownshipFarm = true;
  //   }
  //   if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 && this.searchType.searchTypeId === 13) {
  //     this.showRange = false;
  //     if (this.searchFilter.name !== 'FARM') {
  //       this.showFarmLabel = false;
  //     }
  //     if (this.searchFilter.name === 'FARM') {
  //       this.showFarmLabel = true;
  //     }
  //   } else {
  //     this.showRange = true;
  //   }
  // }

  getSearchTypeConfig(element, data, con) {
    // this.loaderService.display(true);
    this.results = undefined;
    this.NgiData = undefined;
    this.selection = new SelectionModel<any>(true, []);
    this.municipalityForm.patchValue({
      assignedMunicipality: ''
    });
    this.townshipForm.patchValue({
      assignedTownship: ''
    });
    if (this.filterDataBack !== undefined) {
      const fitlData = JSON.parse(this.filterDataBack.searchData);
      this.searchType = fitlData.searchBy;
      this.province = fitlData.province;
    }
    this.restService.getSearchFilterByProvince(Number(this.searchType.searchTypeId),
      Number(this.province.provinceId))
      .subscribe(searchFilters => {
        this.searchFilters = searchFilters.data;
        this.filteredSearchFilters = searchFilters.data;
        if (con === false) {
          this.getAllMunicipalitiesByProvinceCode();
          this.getAllTownship();
        }
        this.searchFilter = this.filterDataBack === undefined ? searchFilters.data[0] :
          JSON.parse(this.filterDataBack.searchData).searchFilter;
        this.getSearchFilters.valueChanges
          .pipe(
            map(value => typeof value === 'string' ? value : (value.name)),
            map(searchFilter => searchFilter ? this.filterSearchFilters(searchFilter) :
              this.searchFilters !== undefined ? this.searchFilters.slice() : this.searchFilters)
          ).subscribe(response => {
            this.filteredSearchFilters = response;
          });
        this.setFilterData();
        if (this.filterDataBack !== undefined) {
          const fitlData = JSON.parse(this.filterDataBack.searchData);
          this.province = fitlData.province;
          this.searchBy = fitlData.searchBy;
          this.searchFilter = this.searchFilters.filter(x => x.searchTypeId === fitlData.searchFilter.searchTypeId)[0];
          this.searchNumber = fitlData.searchNumber;
          this.farmForm.patchValue({
            lpi: fitlData.farmForm.lpi,
            farmName: fitlData.farmForm.farmName,
            portion: fitlData.farmForm.portion,
            provinceId: fitlData.farmForm.provinceId,
            searchTypeId: fitlData.farmForm.searchTypeId,
            searchFilterId: fitlData.farmForm.searchFilterId,
            provinceShortName: fitlData.farmForm.provinceShortName,
            parcelNumber: fitlData.farmForm.parcelNumber,
            userId: fitlData.farmForm.userId,
            municipalityCode: fitlData.farmForm.municipalityCode,
            township: fitlData.farmForm.township,
          });
          this.provinceForm.patchValue({
            assignedProvince: fitlData.provinceForm.assignedProvince
          });
          this.criteriaForm.patchValue({
            assignedCriteria: fitlData.criteriaForm.assignedCriteria
          });
          this.searchFiltersForm.patchValue({
            assignedSearchFilters: fitlData.searchFiltersForm.assignedSearchFilters
          });
          this.ERF.patchValue({
            lpi: fitlData.ERF.lpi,
            farmName: fitlData.ERF.farmName,
            portion: fitlData.ERF.portion,
            provinceId: fitlData.ERF.provinceId,
            searchTypeId: fitlData.ERF.searchTypeId,
            searchFilterId: fitlData.ERF.searchFilterId,
            provinceShortName: fitlData.ERF.provinceShortName,
            userId: fitlData.ERF.userId,
            municipalityCode: fitlData.ERF.municipalityCode,
            parcelNumber: fitlData.ERF.parcelNumber,
            township: fitlData.ERF.township
          });
          this.Lease.patchValue({
            lpi: fitlData.Lease.lpi,
            farmName: fitlData.Lease.farmName,
            portion: fitlData.Lease.portion,
            provinceId: fitlData.Lease.provinceId,
            searchTypeId: fitlData.Lease.searchTypeId,
            searchFilterId: fitlData.Lease.searchFilterId,
            provinceShortName: fitlData.Lease.provinceShortName,
            userId: fitlData.Lease.userId,
            municipalityCode: fitlData.Lease.municipalityCode,
            township: fitlData.Lease.township
          });
          this.Holdings.patchValue({
            lpi: fitlData.Holdings.lpi,
            farmName: fitlData.Holdings.farmName,
            portion: fitlData.Holdings.portion,
            provinceId: fitlData.Holdings.provinceId,
            parcelNumber: fitlData.Holdings.parcelNumber,
            searchTypeId: fitlData.Holdings.searchTypeId,
            searchFilterId: fitlData.Holdings.searchFilterId,
            provinceShortName: fitlData.Holdings.provinceShortName,
            userId: fitlData.Holdings.userId,
            municipalityCode: fitlData.Holdings.municipalityCode,
            township: fitlData.Holdings.township,
          });
          this.rangeSearch.patchValue({
            farmName: fitlData.rangeSearch.farmName,
            parcel: fitlData.rangeSearch.parcel,
            parcelFrom: fitlData.rangeSearch.parcelFrom,
            parcelTo: fitlData.rangeSearch.parcelTo,
            portionFrom: fitlData.rangeSearch.portionFrom,
            portionTo: fitlData.rangeSearch.portionTo,
            provinceId: fitlData.rangeSearch.provinceId,
            searchFilterId: fitlData.rangeSearch.searchFilterId,
            searchTypeId: fitlData.rangeSearch.searchTypeId,
            provinceShortName: fitlData.rangeSearch.provinceShortName,
            sgNo: fitlData.rangeSearch.sgNo,
            township: fitlData.rangeSearch.township,
            userId: fitlData.rangeSearch.userId,
            municipalityCode: null,
          });
          this.sectionalTitle.patchValue({
            farmName: fitlData.sectionalTitle.farmName,
            parcel: fitlData.sectionalTitle.parcel,
            portion: fitlData.sectionalTitle.portion,
            municipalityCode: fitlData.sectionalTitle.municipalityCode,
            township: fitlData.sectionalTitle.township,
            schemeNumber: fitlData.sectionalTitle.schemeNumber,
            schemeName: fitlData.sectionalTitle.schemeName,
            provinceId: fitlData.sectionalTitle.provinceId,
            searchTypeId: fitlData.sectionalTitle.searchTypeId,
            searchFilterId: fitlData.sectionalTitle.searchFilterId,
            provinceShortName: fitlData.sectionalTitle.provinceShortName,
            userId: fitlData.sectionalTitle.userId,
            filingNumber: fitlData.sectionalTitle.filingNumber,
            sgNumber: fitlData.sectionalTitle.sgNumber,
            sectionalCode: fitlData.sectionalTitle.sectionalCode
          });
          this.sectionalerf.patchValue({
            parcel: fitlData.sectionalerf.parcel,
            portion: fitlData.sectionalerf.portion,
            municipalityCode: fitlData.sectionalerf.municipalityCode,
            township: fitlData.sectionalerf.township,
            provinceId: fitlData.sectionalerf.provinceId,
            searchTypeId: fitlData.sectionalerf.searchTypeId,
            searchFilterId: fitlData.sectionalerf.searchFilterId,
            provinceShortName: fitlData.sectionalerf.provinceShortName,
            userId: fitlData.sectionalerf.userId,
          });
          this.textSearch.patchValue({
            localMunicipalityName: fitlData.textSearch.localMunicipalityName,
            lpi: fitlData.textSearch.lpi,
            parcel: fitlData.textSearch.parcel,
            provinceId: fitlData.textSearch.provinceId,
            searchFilterId: fitlData.textSearch.searchFilterId,
            searchTypeId: fitlData.textSearch.searchTypeId,
            provinceShortName: fitlData.textSearch.provinceShortName,
            sgNo: fitlData.textSearch.sgNo,
            userId: fitlData.textSearch.userId
          });
          this.municipalityForm.patchValue({
            assignedMunicipality: fitlData.municipalityForm.assignedMunicipality
          });
          this.townshipForm.patchValue({
            assignedTownship: fitlData.townshipForm.assignedTownship
          });

        }
        this.setFilterData();
        if (element) {
          this.searchFilter = this.searchFilters.filter(x => x.searchTypeId === element.searchFilterId)[0];
          if (this.searchType.searchTypeId === 1) {
            switch (this.searchFilter.searchTypeId) {
              case 2:
                this.searchNumber = data.sgNo;
                break;
              case 3:
                this.searchNumber = data.compilationNo;
                break;
              case 6:
                this.searchNumber = data.surveyRecordNo;
                break;
              case 7:
                this.searchNumber = data.deedNo;
                break;
              case 8:
                this.searchNumber = data.deedNo;
                break;
              case 25:
                this.searchNumber = data.lpi;
                break;
              case 38:
                this.searchNumber = data.leaseNo;
                break;
            }
          } else if (this.searchType.searchTypeId === 10) {
            this.Township = this.townshipdata.filter(x => x.mdbCode === data.township)[0];
            this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
            switch (this.searchFilter.name) {
              case 'Farm':
                this.farmForm.patchValue({
                  farmName: data.farmName,
                  portion: data.portion,
                  parcelNumber: data.parcelNumber,
                  lpi: data.lpi,
                  provinceId: data.provinceId,
                  searchTypeId: data.searchTypeId,
                  searchFilterId: data.searchFilterId,
                  provinceShortName: data.provinceShortName,
                  userId: data.userId,
                  municipalityCode: data.municipalityCode,
                  township: data.township
                });
                break;
              case 'ERF':
                this.ERF.patchValue({
                  portion: data.portion,
                  parcelNumber: data.parcelNumber,
                  lpi: data.lpi,
                  farmName: data.farmName,
                  provinceId: data.provinceId,
                  searchTypeId: data.searchTypeId,
                  searchFilterId: data.searchFilterId,
                  provinceShortName: data.provinceShortName,
                  userId: data.userId,
                  municipalityCode: data.municipalityCode,
                  township: data.township
                });
                break;
              case 'LPI':
                this.Lease.patchValue({
                  lpi: data.lpi,
                  farmName: data.farmName,
                  portion: data.portion,
                  provinceId: data.provinceId,
                  searchTypeId: data.searchTypeId,
                  searchFilterId: data.searchFilterId,
                  provinceShortName: data.provinceShortName,
                  userId: data.userId,
                  municipalityCode: data.municipalityCode,
                  township: data.township
                });
                break;
              case 'Holdings':
                this.Holdings.patchValue({
                  portion: data.portion,
                  parcelNumber: data.parcelNumber,
                  lpi: data.lpi,
                  farmName: data.farmName,
                  provinceId: data.provinceId,
                  searchTypeId: data.searchTypeId,
                  searchFilterId: data.searchFilterId,
                  provinceShortName: data.provinceShortName,
                  userId: data.userId,
                  municipalityCode: data.municipalityCode,
                  township: data.township,
                });
                break;
            }
            this.municipalityForm.patchValue({
              assignedMunicipality: this.municipality?.mdbCode
            });
            this.townshipForm.patchValue({
              assignedTownship: this.Township?.mdbCode
            });
          } else if (this.searchType.searchTypeId === 11) {
            this.Township = this.townshipdata.filter(x => x.mdbCode === data.township)[0];
            this.TownshipModel = this.Township?.mdbCode;
            switch (this.searchFilter.name) {
              case 'Scheme Name':
                this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
                this.municipalityModel = this.municipality?.mdbCode;
                this.sectionalTitle.patchValue({
                  schemeName: data.schemeName,
                });
                this.sectionalTitle.patchValue({
                  municipalityCode: this.municipality !== undefined ? this.municipality.mdbCode : '',
                });
                break;
              case 'Filling Number':
                this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
                this.municipalityModel = this.municipality?.mdbCode;
                this.sectionalTitle.patchValue({
                  filingNumber: data.filingNumber,
                });
                this.sectionalTitle.patchValue({
                  municipalityCode: this.municipality !== undefined ? this.municipality.mdbCode : '',
                });
                break;
              case 'ERF':
                this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
                this.municipalityModel = this.municipality?.mdbCode;
                this.sectionalTitle.patchValue({
                  parcel: data.parcel,
                  portion: data.portion,
                });
                this.sectionalTitle.patchValue({
                  municipalityCode: this.municipality !== undefined ? this.municipality.mdbCode : '',
                  township: this.Township !== undefined ? this.Township.mdbCode : ''
                });
                this.municipalityForm.patchValue({
                  assignedMunicipality: this.municipality?.mdbCode
                });
                break;
              case 'FARM':
                this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
                this.municipalityModel = this.municipality?.mdbCode;
                this.sectionalTitle.patchValue({
                  farmName: data.farmName,
                  parcel: data.parcel,
                  portion: data.portion,
                });
                this.sectionalTitle.patchValue({
                  municipalityCode: this.municipality !== undefined ? this.municipality.mdbCode : '',
                  township: this.Township !== undefined ? this.Township.mdbCode : ''
                });
                this.municipalityForm.patchValue({
                  assignedMunicipality: this.municipality?.mdbCode
                });
                break;
              case 'SG Number':
                this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
                this.municipalityModel = this.municipality?.mdbCode;
                this.sectionalTitle.patchValue({
                  sgNumber: data.sgNumber,
                });
                this.sectionalTitle.patchValue({
                  municipalityCode: this.municipality !== undefined ? this.municipality.mdbCode : '',
                });
                break;
              case 'Scheme Number':
                this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
                this.municipalityModel = this.municipality?.mdbCode;
                this.sectionalTitle.patchValue({
                  schemeNumber: data.schemeNumber,
                });
                this.sectionalTitle.patchValue({
                  municipalityCode: this.municipality !== undefined ? this.municipality.mdbCode : '',
                });
                break;
            }
            this.townshipForm.patchValue({
              assignedTownship: this.Township !== undefined ? this.Township?.mdbCode : ''
            });
          } else if (this.searchType.searchTypeId === 47) {

          } else if (this.searchType.searchTypeId === 13) {
            this.Township = this.townshipdata.filter(x => x.mdbCode === data.township)[0];
            this.TownshipModel = this.Township?.mdbCode;
            switch (this.searchFilter.searchTypeId) {
              case 44:
                this.rangeSearch.patchValue({
                  farmName: data.farmName,
                  parcel: data.parcel,
                  portionFrom: data.portionFrom,
                  portionTo: data.portionTo,
                  township: data.township,
                  municipalityCode: null
                });
                break;
              case 45:
                this.Township = this.townshipdata.filter(x => x.mdbCode === data.township)[0];
                this.rangeSearch.patchValue({
                  portionFrom: data.portionFrom,
                  portionTo: data.portionTo,
                  township: data.township,
                  parcel: data.parcel,
                  municipalityCode: null
                });
                break;
              case 15:
                this.Township = this.townshipdata.filter(x => x.mdbCode === data.township)[0];
                this.rangeSearch.patchValue({
                  parcelFrom: data.parcelFrom,
                  parcelTo: data.parcelTo,
                  township: data.township,
                  municipalityCode: null
                });
                break;
              case 41:
                this.rangeSearch.patchValue({
                  parcelFrom: data.parcelFrom,
                  parcelTo: data.parcelTo,
                  township: data.township,
                  municipalityCode: null
                });
                break;
              case 42:
                this.Township = this.townshipdata.filter(x => x.mdbCode === data.township)[0];
                this.rangeSearch.patchValue({
                  portionFrom: data.portionFrom,
                  portionTo: data.portionTo,
                  township: data.township,
                  parcel: data.parcel,
                  municipalityCode: null
                });
                break;
            }
            this.townshipForm.patchValue({
              assignedTownship: this.Township !== undefined ? this.Township?.mdbCode : ''
            });
          } else if (this.searchType.searchTypeId === 46) {
            this.municipality = this.municipalitydata.filter(m => m.mdbCode === data.municipalityCode)[0];
            this.textSearch.patchValue({
              lpi: data.lpi,
              parcel: data.lpi,
              sgNo: data.lpi,
            });
            this.searchNumber = data.lpi;
            this.municipalityForm.patchValue({
              assignedMunicipality: this.municipality
            });
          }
        }
        this.setFilterData();
        if (this.filterDataBack !== undefined) {
          this.filterDataBack = undefined;
          this.search();
        }
        this.loaderService.display(false);
      });
  }

  filterSearchFilters(value: string) {
    const filterValue = value.toLowerCase();
    return this.searchFilters.filter(searchFilter => (searchFilter.name).toLowerCase().includes(filterValue));
  }

  getAllMunicipalitiesByProvinceCode() {
    // this.loaderService.display(true);
    this.assignMunicipality = '';
    this.restService.getMunicipality(this.province.provinceId).subscribe(response => {
      this.municipalitydata = response.data;
      this.filteredMuncipality.next(this.municipalitydata.slice());
      this.municipalityFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyMunicipality))
        .subscribe(() => {
          this.filterMunicipalities();
        });
      this.setInitialMunicipalityValue();
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  protected setInitialMunicipalityValue() {
    this.filteredMuncipality
      .pipe(take(1), takeUntil(this._onDestroyMunicipality))
      .subscribe(() => {
        this.municipalitySelect.compareWith = (a: any, b: any) => a && b && a.mdbCode === b.mdbCode;
      });
  }

  protected filterMunicipalities() {
    if (!this.municipalitydata) {
      return;
    }
    let search = this.municipalityFilterCtrl.value;
    if (!search) {
      this.filteredMuncipality.next(this.municipalitydata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMuncipality.next(
      this.municipalitydata.filter(bank => bank.municipality.toLowerCase().indexOf(search) > -1)
    );
  }

  getAllTownship() {

    // this.loaderService.display(true);
    this.assignTownship = '';
    this.restService.getMajorRegionOrAdminDistrict(this.province.provinceId).subscribe(response => {
      this.townshipdata = response.data;
      this.filteredTownship.next(this.townshipdata.slice());
      this.townshipFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyTownship))
        .subscribe(() => {
          this.filterTownships();
        });
      this.setInitialTownshipValue();
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  protected setInitialTownshipValue() {
    this.filteredTownship
      .pipe(take(1), takeUntil(this._onDestroyTownship))
      .subscribe(() => {
        this.townshipSelect.compareWith = (a: any, b: any) => a && b && a.mdbCode === b.mdbCode;
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

  setFilterData() {
    if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
      this.searchType.searchTypeId === 10 && this.searchFilter.name === 'Farm') {
      this.showMunicipalityFarm = false;
    } else {
      this.showMunicipalityFarm = true;
    }
    if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
      this.searchType.searchTypeId === 10 && this.searchFilter.name === 'ERF') {
      this.showMunicipalityERF = false;
    } else {
      this.showMunicipalityERF = true;
    }
    if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
      this.searchType.searchTypeId === 10 && this.searchFilter.name === 'LPI') {
      this.showMunicipalityLPI = false;
    } else {
      this.showMunicipalityLPI = true;
    }
    if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 &&
      this.searchType.searchTypeId === 10 && this.searchFilter.name === 'Holdings') {
      this.showMunicipalityHolding = false;
    } else {
      this.showMunicipalityHolding = true;
    }
    if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 && this.searchType.searchTypeId === 11) {
      if (this.searchFilter.name !== 'ERF' || this.searchFilter.name !== 'FARM') {
        this.showMunicipalityERFFARM = false;
      } else {
        this.showMunicipalityERFFARM = true;
      }
      if (this.searchFilter.name === 'ERF') {
        this.showTownshipERF = false;
      } else {
        this.showTownshipERF = true;
      }
      if (this.searchFilter.name.includes('FARM')) {
        this.showTownshipFarm = false;
      } else {
        this.showTownshipFarm = true;
      }
    } else {
      this.showMunicipalityERFFARM = true;
      this.showTownshipERF = true;
      this.showTownshipFarm = true;
    }
    if (this.searchType && this.searchFilters !== undefined && this.searchFilters.length > 0 && this.searchType.searchTypeId === 13) {
      this.showRange = false;
      if (this.searchFilter.name !== 'FARM') {
        this.showFarmLabel = false;
      }
      if (this.searchFilter.name === 'FARM') {
        this.showFarmLabel = true;
      }
    } else {
      this.showRange = true;
    }
  }

  searchData(response) {
    this.foundRecord = 0;
    this.totalTemplateRecords = 0;
    this.templateAuditId = 0;
    if (this.searchType.searchTypeId !== 47) {
      this.pageSize = response.headers.get('X-Total-Count');
    }
    if (response.body.data.length < 1) {
      this.requestSearch();
    }
    if (response.body.code !== 50000) {
      this.results = response.body.data;
    }

    this.refreshResult();
    this.CalculatePaging();
    this.loaderService.display(false);
  }

  searchTemplateData(response) {
    this.foundRecord = 0;
    this.totalTemplateRecords = 0;
    this.templateAuditId = 0;
    if (this.searchType.searchTypeId !== 47) {
      this.pageSize = response.headers.get('X-Total-Count');
    }
    if (response.data.length < 1) {
      this.requestSearch();
    }
    if (response.code !== 50000) {
      this.results = response.data.results;
      this.foundRecord = response.data.foundRecords;
      this.totalTemplateRecords = response.data.totalRecords;
      this.templateAuditId = response.data.templateAuditId;
    }
    this.refreshResult();
    this.CalculatePaging();
    this.loaderService.display(false);
  }

  refreshResult() {
    this.dataSource = new MatTableDataSource(this.results);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataLength = this.results !== undefined ? this.results.length : 0;
  }

  CalculatePaging() {
    const initialVal = 1;
    if (this.pageNo === 1) {
      this.pageFromValue = initialVal;
      this.pageToValue = (this.results.length * this.pageNo) > Number(this.pageSize) ?
        Number(this.pageSize) : (this.results.length * this.pageNo);
    } else {
      this.pageFromValue = (this.results.length) < 20 ? (20 * (this.pageNo - 1)) + initialVal :
        (this.results.length * (this.pageNo - 1)) + initialVal;
      this.pageToValue = (this.results.length) < 20 ?
        Number(this.pageSize) : (this.results.length + 20) > Number(this.pageSize) ?
          Number(this.pageSize) : ((this.results.length * (this.pageNo - 1)) + 20);
    }
    this.loaderService.display(false);
  }

  requestSearch() {
    const dialogRef = this.dialog.open(SearchRequestModalComponent, {
      width: '75%',
      height: '550px',
      data: {
        province: this.province,
        searchType: this.searchType,
        searchFilter: this.searchFilter,
        searchNumber: this.searchNumber
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  onChange(e) {
    this.device = e.checked;
  }


  search() {
    this.loaderService.display(true);
    if (this.requestor === 'no') {
      this.setValidation();
      if (this.requesterForm.invalid) {
        this.requesterForm.get('firstName').markAsTouched();
        this.requesterForm.get('surName').markAsTouched();
        this.requesterForm.get('contactNo').markAsTouched();
        this.requesterForm.get('email').markAsTouched();
        this.loaderService.display(false);
        return;
      }
    }
    this.requesterdata = {
      'userId': this.userId,
      'isMediaToDepartment': 0,
      'requesterType': this.requestor === 'no' ? this.requestorClient : 447,
      'deliveryMethod': '',
      'deliveryMedium': '',
      'requestLoggedBy': {
        'firstName': this.loggedUserData.firstName,
        'surName': this.loggedUserData.surname,
        'contactNo': this.loggedUserData.mobileNo,
        'email': this.loggedUserData.email,
        'fax': '',
        'addressLine1': this.loggedUserData.userProfile.postalAddressLine1,
        'addressLine2': this.loggedUserData.userProfile.postalAddressLine2,
        'addressLine3': this.loggedUserData.userProfile.postalAddressLine3,
        'postalCode': this.loggedUserData.userProfile.postalCode
      },
      'requesterDetails': {
        'firstName': this.requesterForm.value.firstName,
        'surName': this.requesterForm.value.surName,
        'contactNo': this.requesterForm.value.contactNo,
        'email': this.requesterForm.value.email,
        'fax': this.requesterForm.value.fax,
        'addressLine1': this.requesterForm.value.addressLine1,
        'addressLine2': this.requesterForm.value.addressLine2,
        'addressLine3': this.requesterForm.value.addressLine3,
        'postalCode': this.requesterForm.value.postalCode
      }
    };
    if (this.searchFilter.templateListItemId !== 567) {
      if (this.searchType.searchTypeId === 1) {
        const payload = {
          'compilationNo': null,
          'deedNo': null,
          'lpi': null,
          'filingNo': null,
          'leaseNo': null,
          'provinceId': this.province.provinceId,
          'searchTypeId': this.searchType.searchTypeId,
          'searchFilterId': this.searchFilter.searchTypeId,
          'provinceShortName': this.province.provinceShortName,
          'sgNo': null,
          'surveyRecordNo': null,
          'userId': this.userId
        };
        switch (this.searchFilter.searchTypeId) {
          case 2:
            payload.sgNo = this.searchNumber;
            this.restService.searchBySgNumber(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 3:
            payload.compilationNo = this.searchNumber;
            this.restService.searchByCompilationNo(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 6:
            payload.surveyRecordNo = this.searchNumber;
            this.restService.searchBySurveyRecordNo(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 7:
            payload.deedNo = this.searchNumber;
            this.restService.searchByDeedNo(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 8:
            payload.deedNo = this.searchNumber;
            this.restService.searchByDeedNo(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 25:
            payload.lpi = this.searchNumber;
            this.restService.searchBySgNumber(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 38:
            payload.leaseNo = this.searchNumber;
            this.restService.searchByLeaseNo(payload, this.pageNo).subscribe(response => {
              this.searchData(response);
            }, () => {
              this.loaderService.display(false);
            });
            break;
        }
      } else if (this.searchType.searchTypeId === 10) {
        let obj;
        switch (this.searchFilter.name) {
          case 'Farm':
            obj = this.farmForm.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined
                ? null : this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.farmForm.value.farmName !== '' ? this.farmForm.value.farmName : null,
              lpi: this.farmForm.value.lpi !== '' ? this.farmForm.value.lpi : null,
              parcelNumber: this.farmForm.value.parcelNumber !== '' ? this.farmForm.value.parcelNumber : null,
              portion: this.farmForm.value.portion !== '' ? this.farmForm.value.portion : null
            });
            this.restService.farmSearch(this.farmForm.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'ERF':
            obj = this.ERF.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined
                ? null : this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.ERF.value.farmName !== '' ? this.ERF.value.farmName : null,
              lpi: this.ERF.value.lpi !== '' ? this.ERF.value.lpi : null,
              parcelNumber: this.ERF.value.parcelNumber !== '' ? this.ERF.value.parcelNumber : null,
              portion: this.ERF.value.portion !== '' ? this.ERF.value.portion : null
            });
            this.restService.erfSearch(this.ERF.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'LPI':
            obj = this.Lease.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined
                ? null : this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.Lease.value.farmName !== '' ? this.Lease.value.farmName : null,
              lpi: this.Lease.value.lpi !== '' ? this.Lease.value.lpi : null,
              portion: this.Lease.value.portion !== '' ? this.Lease.value.portion : null
            });
            this.restService.lpiSearch(this.Lease.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'Holdings':
            obj = this.Holdings.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined
                ? null : this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.Holdings.value.farmName !== '' ? this.Holdings.value.farmName : null,
              lpi: this.Holdings.value.lpi !== '' ? this.Holdings.value.lpi : null,
              parcelNumber: this.Holdings.value.parcelNumber !== '' ? this.Holdings.value.parcelNumber : null,
              portion: this.Holdings.value.portion !== '' ? this.Holdings.value.portion : null
            });
            this.restService.holdingSearch(this.Holdings.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
        }
      } else if (this.searchType.searchTypeId === 11) {
        switch (this.searchFilter.name) {
          case 'Scheme Name':
            this.sectionalTitle.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality !== undefined
                ? (this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null) : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.sectionalTitle.value.farmName !== '' ? this.sectionalTitle.value.farmName : null,
              parcel: this.sectionalTitle.value.parcel !== '' ? this.sectionalTitle.value.parcel : null,
              portion: this.sectionalTitle.value.portion !== '' ? this.sectionalTitle.value.portion : null,
              schemeNumber: this.sectionalTitle.value.schemeNumber !== '' ? this.sectionalTitle.value.schemeNumber : null,
              schemeName: this.sectionalTitle.value.schemeName !== '' ? this.sectionalTitle.value.schemeName : null,
              filingNumber: this.sectionalTitle.value.filingNumber !== '' ? this.sectionalTitle.value.filingNumber : null,
              sgNumber: this.sectionalTitle.value.sgNumber !== '' ? this.sectionalTitle.value.sgNumber : null,
              sectionalCode: (this.sectionalTitle.value.sectionalCode === undefined ||
                this.sectionalTitle.value.sectionalCode === null || this.sectionalTitle.value.sectionalCode === '') ? 0 :
                this.sectionalTitle.value.sectionalCode
            });
            this.restService.sectionalSchemeNameSearch(this.sectionalTitle.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'Filling Number':
            this.sectionalTitle.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality !== undefined
                ? (this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null) : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.sectionalTitle.value.farmName !== '' ? this.sectionalTitle.value.farmName : null,
              parcel: this.sectionalTitle.value.parcel !== '' ? this.sectionalTitle.value.parcel : null,
              portion: this.sectionalTitle.value.portion !== '' ? this.sectionalTitle.value.portion : null,
              schemeNumber: this.sectionalTitle.value.schemeNumber !== '' ? this.sectionalTitle.value.schemeNumber : null,
              schemeName: this.sectionalTitle.value.schemeName !== '' ? this.sectionalTitle.value.schemeName : null,
              filingNumber: this.sectionalTitle.value.filingNumber !== '' ? this.sectionalTitle.value.filingNumber : null,
              sgNumber: this.sectionalTitle.value.sgNumber !== '' ? this.sectionalTitle.value.sgNumber : null,
              sectionalCode: (this.sectionalTitle.value.sectionalCode === undefined ||
                this.sectionalTitle.value.sectionalCode === null || this.sectionalTitle.value.sectionalCode === '') ? 0 :
                this.sectionalTitle.value.sectionalCode
            });
            this.restService.sectionalFilingNoSearch(this.sectionalTitle.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'ERF':
            this.sectionalTitle.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality !== undefined
                ? (this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null) : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.sectionalTitle.value.farmName !== '' ? this.sectionalTitle.value.farmName : null,
              parcel: this.sectionalTitle.value.parcel !== '' ? this.sectionalTitle.value.parcel : null,
              portion: this.sectionalTitle.value.portion !== '' ? this.sectionalTitle.value.portion : null,
              schemeNumber: this.sectionalTitle.value.schemeNumber !== '' ? this.sectionalTitle.value.schemeNumber : null,
              schemeName: this.sectionalTitle.value.schemeName !== '' ? this.sectionalTitle.value.schemeName : null,
              filingNumber: this.sectionalTitle.value.filingNumber !== '' ? this.sectionalTitle.value.filingNumber : null,
              sgNumber: this.sectionalTitle.value.sgNumber !== '' ? this.sectionalTitle.value.sgNumber : null,
              sectionalCode: (this.sectionalTitle.value.sectionalCode === undefined ||
                this.sectionalTitle.value.sectionalCode === null || this.sectionalTitle.value.sectionalCode === '') ? 0 :
                this.sectionalTitle.value.sectionalCode
            });
            this.restService.sectionalErfSearch(this.sectionalTitle.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'FARM':
            this.sectionalTitle.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality !== undefined
                ? (this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null) : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.sectionalTitle.value.farmName !== '' ? this.sectionalTitle.value.farmName : null,
              parcel: this.sectionalTitle.value.parcel !== '' ? this.sectionalTitle.value.parcel : null,
              portion: this.sectionalTitle.value.portion !== '' ? this.sectionalTitle.value.portion : null,
              schemeNumber: this.sectionalTitle.value.schemeNumber !== '' ? this.sectionalTitle.value.schemeNumber : null,
              schemeName: this.sectionalTitle.value.schemeName !== '' ? this.sectionalTitle.value.schemeName : null,
              filingNumber: this.sectionalTitle.value.filingNumber !== '' ? this.sectionalTitle.value.filingNumber : null,
              sgNumber: this.sectionalTitle.value.sgNumber !== '' ? this.sectionalTitle.value.sgNumber : null,
              sectionalCode: (this.sectionalTitle.value.sectionalCode === undefined ||
                this.sectionalTitle.value.sectionalCode === null || this.sectionalTitle.value.sectionalCode === '') ? 0 :
                this.sectionalTitle.value.sectionalCode
            });
            this.restService.sectionalFarmSearch(this.sectionalTitle.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'SG Number':
            this.sectionalTitle.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality !== undefined
                ? (this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null) : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.sectionalTitle.value.farmName !== '' ? this.sectionalTitle.value.farmName : null,
              parcel: this.sectionalTitle.value.parcel !== '' ? this.sectionalTitle.value.parcel : null,
              portion: this.sectionalTitle.value.portion !== '' ? this.sectionalTitle.value.portion : null,
              schemeNumber: this.sectionalTitle.value.schemeNumber !== '' ? this.sectionalTitle.value.schemeNumber : null,
              schemeName: this.sectionalTitle.value.schemeName !== '' ? this.sectionalTitle.value.schemeName : null,
              filingNumber: this.sectionalTitle.value.filingNumber !== '' ? this.sectionalTitle.value.filingNumber : null,
              sgNumber: this.sectionalTitle.value.sgNumber !== '' ? this.sectionalTitle.value.sgNumber : null,
              sectionalCode: (this.sectionalTitle.value.sectionalCode === undefined ||
                this.sectionalTitle.value.sectionalCode === null || this.sectionalTitle.value.sectionalCode === '') ? 0 :
                this.sectionalTitle.value.sectionalCode
            });
            this.restService.sectionalSgNoSearch(this.sectionalTitle.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 'Scheme Number':
            this.sectionalTitle.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: this.municipalityForm.value.assignedMunicipality !== undefined
                ? (this.municipalityForm.value.assignedMunicipality !== ''
                  ? this.municipalityForm.value.assignedMunicipality : null) : null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.sectionalTitle.value.farmName !== '' ? this.sectionalTitle.value.farmName : null,
              parcel: this.sectionalTitle.value.parcel !== '' ? this.sectionalTitle.value.parcel : null,
              portion: this.sectionalTitle.value.portion !== '' ? this.sectionalTitle.value.portion : null,
              schemeNumber: this.sectionalTitle.value.schemeNumber !== '' ? this.sectionalTitle.value.schemeNumber : null,
              schemeName: this.sectionalTitle.value.schemeName !== '' ? this.sectionalTitle.value.schemeName : null,
              filingNumber: this.sectionalTitle.value.filingNumber !== '' ? this.sectionalTitle.value.filingNumber : null,
              sgNumber: this.sectionalTitle.value.sgNumber !== '' ? this.sectionalTitle.value.sgNumber : null,
              sectionalCode: (this.sectionalTitle.value.sectionalCode === undefined ||
                this.sectionalTitle.value.sectionalCode === null || this.sectionalTitle.value.sectionalCode === '') ? 0 :
                this.sectionalTitle.value.sectionalCode
            });
            this.restService.sectionalSchemeNoSearch(this.sectionalTitle.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
        }
      } else if (this.searchType.searchTypeId === 13) {
        switch (this.searchFilter.searchTypeId) {
          case 44:
            this.rangeSearch.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.rangeSearch.value.farmName !== '' ? this.rangeSearch.value.farmName : null,
              parcel: this.rangeSearch.value.parcel !== '' ? this.rangeSearch.value.parcel : null,
              parcelFrom: this.rangeSearch.value.parcelFrom !== '' ? this.rangeSearch.value.parcelFrom : null,
              parcelTo: this.rangeSearch.value.parcelTo !== '' ? this.rangeSearch.value.parcelTo : null,
              portionFrom: this.rangeSearch.value.portionFrom !== '' ? this.rangeSearch.value.portionFrom : null,
              portionTo: this.rangeSearch.value.portionTo !== '' ? this.rangeSearch.value.portionTo : null,
              sgNo: this.rangeSearch.value.sgNo !== '' ? this.rangeSearch.value.farmName : null
            });
            this.restService.getRangeFarmSearchData(this.rangeSearch.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 45:
            this.rangeSearch.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.rangeSearch.value.farmName !== '' ? this.rangeSearch.value.farmName : null,
              parcel: this.rangeSearch.value.parcel !== '' ? this.rangeSearch.value.parcel : null,
              parcelFrom: this.rangeSearch.value.parcelFrom !== '' ? this.rangeSearch.value.parcelFrom : null,
              parcelTo: this.rangeSearch.value.parcelTo !== '' ? this.rangeSearch.value.parcelTo : null,
              portionFrom: this.rangeSearch.value.portionFrom !== '' ? this.rangeSearch.value.portionFrom : null,
              portionTo: this.rangeSearch.value.portionTo !== '' ? this.rangeSearch.value.portionTo : null,
              sgNo: this.rangeSearch.value.sgNo !== '' ? this.rangeSearch.value.farmName : null
            });
            this.restService.getRangeErfPortionSearchData(this.rangeSearch.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 15:
            this.rangeSearch.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.rangeSearch.value.farmName !== '' ? this.rangeSearch.value.farmName : null,
              parcel: this.rangeSearch.value.parcel !== '' ? this.rangeSearch.value.parcel : null,
              parcelFrom: this.rangeSearch.value.parcelFrom !== '' ? this.rangeSearch.value.parcelFrom : null,
              parcelTo: this.rangeSearch.value.parcelTo !== '' ? this.rangeSearch.value.parcelTo : null,
              portionFrom: this.rangeSearch.value.portionFrom !== '' ? this.rangeSearch.value.portionFrom : null,
              portionTo: this.rangeSearch.value.portionTo !== '' ? this.rangeSearch.value.portionTo : null,
              sgNo: this.rangeSearch.value.sgNo !== '' ? this.rangeSearch.value.farmName : null
            });
            this.restService.getRangeErfParcelSearchData(this.rangeSearch.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 41:
            this.rangeSearch.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.rangeSearch.value.farmName !== '' ? this.rangeSearch.value.farmName : null,
              parcel: this.rangeSearch.value.parcel !== '' ? this.rangeSearch.value.parcel : null,
              parcelFrom: this.rangeSearch.value.parcelFrom !== '' ? this.rangeSearch.value.parcelFrom : null,
              parcelTo: this.rangeSearch.value.parcelTo !== '' ? this.rangeSearch.value.parcelTo : null,
              portionFrom: this.rangeSearch.value.portionFrom !== '' ? this.rangeSearch.value.portionFrom : null,
              portionTo: this.rangeSearch.value.portionTo !== '' ? this.rangeSearch.value.portionTo : null,
              sgNo: this.rangeSearch.value.sgNo !== '' ? this.rangeSearch.value.farmName : null
            });
            this.restService.getRangeHoldingParcelSearchData(this.rangeSearch.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 42:
            this.rangeSearch.patchValue({
              provinceId: this.province.provinceId,
              searchTypeId: this.searchType.searchTypeId,
              searchFilterId: this.searchFilter.searchTypeId,
              provinceShortName: this.province.provinceShortName,
              userId: this.userId,
              municipalityCode: null,
              township: this.townshipForm.value.assignedTownship !== undefined
                ? (this.townshipForm.value.assignedTownship !== ''
                  ? this.townshipForm.value.assignedTownship : null) : null,
              farmName: this.rangeSearch.value.farmName !== '' ? this.rangeSearch.value.farmName : null,
              parcel: this.rangeSearch.value.parcel !== '' ? this.rangeSearch.value.parcel : null,
              parcelFrom: this.rangeSearch.value.parcelFrom !== '' ? this.rangeSearch.value.parcelFrom : null,
              parcelTo: this.rangeSearch.value.parcelTo !== '' ? this.rangeSearch.value.parcelTo : null,
              portionFrom: this.rangeSearch.value.portionFrom !== '' ? this.rangeSearch.value.portionFrom : null,
              portionTo: this.rangeSearch.value.portionTo !== '' ? this.rangeSearch.value.portionTo : null,
              sgNo: this.rangeSearch.value.sgNo !== '' ? this.rangeSearch.value.farmName : null
            });
            this.restService.getRangeHoldingPortionSearchData(this.rangeSearch.value, this.pageNo).subscribe((res: any) => {
              this.searchData(res);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          default:
            this.loaderService.display(false);
            break;
        }
      } else if (this.searchType.searchTypeId === 47) {
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload[0]);
        formData.append('provinceId', this.province.provinceId);
        switch (this.searchFilter.searchTypeId) {
          case 48:
            this.restService.templateSearchSgNumber(formData).subscribe(payload => {
              this.searchTemplateData(payload);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 481:
            this.restService.templateSearchSurveyRecordNumber(formData).subscribe(payload => {
              this.searchTemplateData(payload);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 483:
            formData.append('searchFilterId', this.searchType.searchTypeId);
            formData.append('provinceShortName', this.province.provinceShortName);
            formData.append('searchTypeId', this.searchFilter.searchTypeId);
            formData.append('userId', this.userId);
            this.restService.templateSearchParcelErf(formData).subscribe(payload => {
              this.searchTemplateData(payload);
            }, () => {
              this.loaderService.display(false);
            });
            break;
          case 482:
            this.restService.templateSearchCompilationNumber(formData).subscribe(payload => {
              this.searchTemplateData(payload);
            }, () => {
              this.loaderService.display(false);
            });
            break;
        }
      } else if (this.searchType.searchTypeId === 46) {
        this.textSearch.patchValue({
          provinceId: this.province.provinceId,
          searchTypeId: this.searchType.searchTypeId,
          searchFilterId: this.searchFilter.searchTypeId,
          provinceShortName: this.province.provinceShortName,
          userId: this.userId,
          localMunicipalityName: this.textSearch.value.lpi,
          parcel: this.textSearch.value.lpi,
          sgNo: this.textSearch.value.lpi,
        });
        this.searchNumber = this.textSearch.value.lpi;
        this.restService.getTextSearch(this.textSearch.value, this.pageNo).subscribe(payload => {
          this.searchData(payload);
        }, () => {
          this.loaderService.display(false);
        });
      }
    } else if (this.searchFilter.templateListItemId === 567) {
      const obj = {
        'provinceId': this.province.provinceId,
        'provinceShortName': this.province.provinceShortName,
        'searchFilterId': this.searchFilter.config,
        'searchTypeId': this.searchType.searchTypeId,
        'userId': this.userId
      };
      this.restService.getNgiSearchResult(obj).subscribe(payload => {
        this.searchDataNgi(payload);
        this.NgiData = payload.data;
        this.loaderService.display(false);
      }, () => {
        this.loaderService.display(false);
      });

    }
  }

  searchDataNgi(response) {
    this.foundRecord = 0;
    this.totalTemplateRecords = 0;
    this.templateAuditId = 0;

    if (response.data.length < 1) {
      this.requestSearch();
    }
    if (response.code !== 50000) {
      this.results = response.data;
    }

    this.refreshResult();
    this.CalculatePaging();
    this.loaderService.display(false);
  }

  setValidation() {
    const Email = this.requesterForm.get('email');
    const Fax = this.requesterForm.get('fax');
    const Address = this.requesterForm.get('addressLine1');
    const contactNumber = this.requesterForm.get('contactNo');
    if (this.requestorClient === 440) {
      Email.setValidators([Validators.required]);
      Fax.setValidators(null);
      Address.setValidators(null);
      contactNumber.setValidators(null);
      Fax.clearValidators();
      Fax.updateValueAndValidity();
      Address.clearValidators();
      Address.updateValueAndValidity();
      contactNumber.clearValidators();
      contactNumber.updateValueAndValidity();
    } else if (this.requestorClient === 441) {
      Email.setValidators(null);
      Fax.setValidators([Validators.required]);
      Address.setValidators(null);
      contactNumber.setValidators(null);
      Email.clearValidators();
      Email.updateValueAndValidity();
      Address.clearValidators();
      Address.updateValueAndValidity();
      contactNumber.clearValidators();
      contactNumber.updateValueAndValidity();
    } else if (this.requestorClient === 442 || this.requestorClient === 443) {
      Email.setValidators(null);
      Fax.setValidators(null);
      Address.setValidators([Validators.required]);
      contactNumber.setValidators(null);
      Email.clearValidators();
      Email.updateValueAndValidity();
      Fax.clearValidators();
      Fax.updateValueAndValidity();
      contactNumber.clearValidators();
      contactNumber.updateValueAndValidity();
    } else if (this.requestorClient === 444 || this.requestorClient === 445) {
      Email.setValidators(null);
      Fax.setValidators(null);
      Address.setValidators(null);
      contactNumber.setValidators([Validators.required]);
      Email.clearValidators();
      Email.updateValueAndValidity();
      Fax.clearValidators();
      Fax.updateValueAndValidity();
      Address.clearValidators();
      Address.updateValueAndValidity();
    } else if (this.requestorClient === 446 || this.requestorClient === 447) {
      Email.setValidators(null);
      Fax.setValidators(null);
      Address.setValidators(null);
      contactNumber.setValidators(null);
      Email.clearValidators();
      Email.updateValueAndValidity();
      Fax.clearValidators();
      Fax.updateValueAndValidity();
      Address.clearValidators();
      Address.updateValueAndValidity();
      contactNumber.clearValidators();
      contactNumber.updateValueAndValidity();
      this.requesterForm.patchValue({
        firstName: this.loggedUserData.firstName,
        surName: this.loggedUserData.surname
      });
    } else if (this.requestorClient === 439) {
      Email.setValidators([Validators.required]);
      Fax.setValidators([Validators.required]);
      Address.setValidators([Validators.required]);
      contactNumber.setValidators([Validators.required]);
      Email.updateValueAndValidity();
      Fax.updateValueAndValidity();
      Address.updateValueAndValidity();
      contactNumber.updateValueAndValidity();
    }
  }

  loadPage(event) {
    this.pageNo = event;
    this.search();
  }


  addToCart() {
    // this.dialogdata = {
    //   province: this.province,
    //   searchBy: this.searchType,
    //   searchFilter: this.searchFilter,
    //   searchNumber: this.searchNumber,
    //   farmForm: this.farmForm.value,
    //   provinceForm: this.provinceForm.value,
    //   criteriaForm: this.criteriaForm.value,
    //   searchFiltersForm: this.searchFiltersForm.value,
    //   ERF: this.ERF.value,
    //   Lease: this.Lease.value,
    //   Holdings: this.Holdings.value,
    //   rangeSearch: this.rangeSearch.value,
    //   sectionalTitle: this.sectionalTitle.value,
    //   sectionalerf: this.sectionalerf.value,
    //   textSearch: this.textSearch.value,
    //   municipalityForm: this.municipalityForm.value,
    //   townshipForm: this.townshipForm.value

    // };

    // const data = {
    //   searchData: JSON.stringify(this.dialogdata),
    //   templateItemListId: this.searchFilter.templateListItemId
    // };
    // if (this.searchFilter.templateListItemId === 567) {
    //   const dialogRef = this.dialog.open(AddtocartNgiDialogComponent, {
    //     height: 'autopx',
    //     width: '600px',
    //     data: {
    //       queryParams: data,
    //       searchDetails: this.NgiData,
    //       requestorData: this.requesterdata,
    //       searchdata: this.dialogdata,
    //       results: this.selection.selected
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe(() => {

    //   });
    // } else {
    //   const dialogRef = this.dialog.open(AddtocartDialogComponent, {
    //     height: 'autopx',
    //     width: 'auto',
    //     data: {
    //       queryParams: data,
    //       requestorData: this.requesterdata,
    //       searchdata: this.dialogdata,
    //       results: this.selection.selected
    //     }
    //   });
    //   dialogRef.afterClosed().subscribe(() => {

    //   });
    // }
  }

  openDetails(searchDetails) {
    // const searchData = {
    //   province: this.province,
    //   searchBy: this.searchType,
    //   searchFilter: this.searchFilter,
    //   searchNumber: this.searchNumber,
    //   farmForm: this.farmForm.value,
    //   provinceForm: this.provinceForm.value,
    //   criteriaForm: this.criteriaForm.value,
    //   searchFiltersForm: this.searchFiltersForm.value,
    //   ERF: this.ERF.value,
    //   Lease: this.Lease.value,
    //   Holdings: this.Holdings.value,
    //   rangeSearch: this.rangeSearch.value,
    //   sectionalTitle: this.sectionalTitle.value,
    //   sectionalerf: this.sectionalerf.value,
    //   textSearch: this.textSearch.value,
    //   municipalityForm: this.municipalityForm.value,
    //   townshipForm: this.townshipForm.value,

    // };
    // const data = {
    //   searchData: JSON.stringify(searchData),
    //   searchDetails: JSON.stringify(searchDetails),
    //   templateItemListId: this.searchFilter.templateListItemId
    // };
    // this.dialogdata = searchData;
    // this.router.navigate(['/search/search-details'], {
    //   state: {
    //     queryParams: data,
    //     requestorData: this.requesterdata
    //   }
    // });
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }
}
