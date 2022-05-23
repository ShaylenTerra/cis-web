import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {forkJoin, ReplaySubject, Subject} from 'rxjs';
import {map, takeUntil, take} from 'rxjs/operators';
import {RestcallService} from '../../services/restcall.service';
import {SearchService} from '../search.service';
import {SearchRequestModalDialogComponent} from './search-request-modal/search-request-modal.dialog';
import {MatSelect} from '@angular/material/select';
import { LoaderService } from '../../services/loader.service';
import { TopMenuService } from '../../services/topmenu.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AddtocartDialogComponent } from './addtocart-dialog/addtocart-dialog.component';
import { AddtocartNgiDialogComponent } from './addtocart-ngi-dialog/addtocart-ngi-dialog.component';

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('provinceSelect') provinceSelect: MatSelect;
    @ViewChild('searchTypeSelect') searchTypeSelect: MatSelect;
    @ViewChild('municipalitySelect', { static: false }) municipalitySelect: MatSelect;
    @ViewChild('townshipSelect', { static: false }) townshipSelect: MatSelect;
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
    dataSource;
    uploadedFileName = 'Upload document';
    fileToUpload: File = null;
    Attachments: File = null;
    userId;
    isSpinnerVisible = false;
    results;
    province;
    searchType;
    searchFilters;
    searchFilter;
    searchNumber = '';
    municipalitydata: any[];
    townshipdata: any[];
    provincepdata: any[];
    criteriadata: any[];
    data;
    adminRegistrationDistricts;
    adminRegistrationDistrict;
    Township;
    Province;
    public filteredMuncipality: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredCriteria: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    filteredSearchFilters;
    searchFiltersdata;
    assignMunicipality;
    assignTownship;
    assignProvince;
    assignCriteria;
    municipalityForm: FormGroup;
    farmForm: FormGroup;
    ERF: FormGroup;
    Lease: FormGroup;
    Holdings: FormGroup;
    sectionalTitle: FormGroup;
    sectionalerf: FormGroup;
    sectionalName: FormGroup;
    sectionalNumber: FormGroup;
    sectionalFilling: FormGroup;
    sectionalSGNumber: FormGroup;
    rangeSearch: FormGroup;
    townshipForm: FormGroup;
    provinceForm: FormGroup;
    criteriaForm: FormGroup;
    searchFiltersForm: FormGroup;
    recentSearch: any;
    dialogdata;
    dataLength;
    prepackagedData: any[] = [];
    totalMysearch: any;
    totalprepackaged: any;
    textSearch: FormGroup;
    columns = ['select', 'sgNo', 'lpi', 'documentType', 'documentSubtype', 'region', 'parcel'];
    ngiColumns = ['select', 'categoryName', 'name', 'documentType', 'documentSubtype'];
    searchColumns: string[] = ['icon', 'title', 'timeAgo'];
    searchBy: string[] = ['Number', 'Parcel Description', 'Free Text', 'Sectional Title', 'NGI Data', 'Data List-Numeric Data'];
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    public boundaryPage: number;
    pageSize: any = 1;
    pageNo: any = 1;
    totalCount: any;
    pageFromValue: any;
    pageToValue: any;
    filterDataBack: any;
    requestorDataBack: any;
    public provinceFilterCtrl: FormControl = new FormControl();
    public searchTypeFilterCtrl: FormControl = new FormControl();
    public municipalityFilterCtrl: FormControl = new FormControl();
    public townshipFilterCtrl: FormControl = new FormControl();
    protected _onDestroyProvince = new Subject<void>();
    protected _onDestroySearchType = new Subject<void>();
    protected _onDestroyMunicipality = new Subject<void>();
    protected _onDestroyTownship = new Subject<void>();
    showMunicipalityFarm = true;
    showMunicipalityERF = true;
    showMunicipalityLPI = true;
    showMunicipalityHolding = true;
    showMunicipalityERFFARM = true;
    showTownshipERF = true;
    showTownshipFarm = true;
    showRange = true;
    showFarmLabel = true;
    TownshipModel;
    municipalityModel;
    selection = new SelectionModel<any>(true, []);

    foundRecord: any = 0;
    totalTemplateRecords: any = 0;
    templateAuditId: any = 0;
    serverDate: any;
    NgiData;
    ngidata;
    constructor(private router: Router, private restService: RestcallService,
                private searchService: SearchService,
                private dialog: MatDialog, private fb: FormBuilder,
                private loaderService: LoaderService,
                private topMenu: TopMenuService) {
        if (this.router.getCurrentNavigation().extras.state !== undefined) {
            this.filterDataBack = this.router.getCurrentNavigation().extras.state.filterData;
        }
        const navig = this.topMenu.iconsInfo.filter(x => x.name ===
            router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
        if (navig.length > 0) {
        this.topMenu.navigate(navig[0].id);
        }
        this.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
        this.recentSearch = [];
        this.boundaryPage = 1;

        this.farmForm = this.fb.group({
            lpi: '',
            farmName: '',
            portion: '',
            provinceId: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            parcelNumber: '',
            userId: '',
            municipalityCode: '',
            township: ''
        });
        this.provinceForm = this.fb.group({
            assignedProvince: ''
        });
        this.criteriaForm = this.fb.group({
            assignedCriteria: ''
        });
        this.searchFiltersForm = this.fb.group({
            assignedSearchFilters: ''
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
        this.Lease = this.fb.group({
            lpi: '',
            farmName: '',
            portion: '',
            provinceId: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            userId: '',
            municipalityCode: '',
            township: ''
        });
        this.Holdings = this.fb.group({
            lpi: '',
            farmName: '',
            portion: '',
            provinceId: '',
            parcelNumber: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            userId: '',
            municipalityCode: '',
            township: ''
        });
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
        this.sectionalTitle = this.fb.group({
            farmName: '',
            parcel: '',
            portion: '',
            municipalityCode: '',
            township: '',
            schemeNumber: '',
            schemeName: '',
            provinceId: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            userId: '',
            filingNumber: '',
            sgNumber: '',
            sectionalCode: ''
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
            userId: ''
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

        this.municipalityForm = this.fb.group({
            assignedMunicipality: ''
        });
        this.townshipForm = this.fb.group({
            assignedTownship: ''
        });
    }

    get getSearchFilters() {
        return this.searchFiltersForm.get('assignedSearchFilters');
    }

    get getMuncipality() {
        return this.municipalityForm.get('assignedMunicipality');
    }

    get getTownship() {
        return this.townshipForm.get('assignedTownship');
    }

    get getProvince() {
        return this.provinceForm.get('assignedProvince');
    }

    get getCriteria() {
        return this.criteriaForm.get('assignedCriteria');
    }

    ngOnInit() {
        this.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
        this.searchService.clearData();
        this.initialise('');
        this.getAllPrePackageConfigs('');
        this.getSearchData('');
    }

    initialise(stat: any) {
        this.loaderService.display(true);
        this.assignCriteria = '';
        this.assignProvince = '';
        forkJoin([
            this.restService.getProvinces(),
            this.restService.getSearchTypeCriteria(0),
        ]).subscribe(([provinces, searchTypes]) => {
            this.searchType = searchTypes.data[0];
            this.criteriadata = searchTypes.data;
            this.provincepdata = provinces.data.filter(x => x.provinceId !== -1);
            this.province = this.provincepdata[0];

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
                if (this.filterDataBack.searchData !== undefined) {
                const fitlData = JSON.parse(this.filterDataBack?.searchData);
                this.province = fitlData.province;
                }
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

    ngAfterViewInit() {
        this.setInitialProvinceValue();
        this.setInitialSearchTypeValue();
    }

    ngOnDestroy() {
        this._onDestroyProvince.next();
        this._onDestroyProvince.complete();
        this._onDestroySearchType.next();
        this._onDestroySearchType.complete();
        this._onDestroyMunicipality.next();
        this._onDestroyMunicipality.complete();
        this._onDestroyTownship.next();
        this._onDestroyTownship.complete();
    }

    protected setInitialProvinceValue() {
    this.filteredProvince
        .pipe(take(1), takeUntil(this._onDestroyProvince))
        .subscribe(() => {
        this.provinceSelect.compareWith = (a: any, b: any) => a && b && a.provinceId === b.provinceId;
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

    protected setInitialSearchTypeValue() {
        this.filteredCriteria
            .pipe(take(1), takeUntil(this._onDestroySearchType))
            .subscribe(() => {
            this.searchTypeSelect.compareWith = (a: any, b: any) => a && b && a.searchTypeId === b.searchTypeId;
            });
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

    setSearchData(element) {
        const data = JSON.parse(element.data);
        this.province = this.provincepdata.filter(x => x.provinceId === element.provinceId)[0];
        this.searchType = this.criteriadata.filter(x => x.searchTypeId === element.searchTypeId)[0];
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

            this.getSearchTypeConfig(element, data, true);
        });
    }

    getSearchTypeConfig(element, data, con) {
        this.loaderService.display(true);
        this.results = undefined;
        this.NgiData = undefined;
        this.selection = new SelectionModel<any>(true, []);
        this.municipalityForm.patchValue({
            assignedMunicipality: ''
        });
        this.townshipForm.patchValue({
            assignedTownship: ''
        });
        this.clearData();
        if (this.filterDataBack !== undefined) {
            if (this.filterDataBack.searchData !== undefined) {
            const fitlData = JSON.parse(this.filterDataBack.searchData);
            this.searchType = fitlData.searchBy;
            this.province = fitlData.province;
            }
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
                this.searchFilter = this.filterDataBack?.searchData === undefined ?
                                    searchFilters.data[0] :
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
                    if (this.filterDataBack.searchData !== undefined) {
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
        this.setFilterData();
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

    onChange(e) {
        this.device = e.checked;
    }

    search() {
        this.loaderService.display(true);
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
                        municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined ?
                                            null : this.municipalityForm.value.assignedMunicipality !== ''
                                            ? this.municipalityForm.value.assignedMunicipality : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                            ? (this.townshipForm.value.assignedTownship !== '' ?
                                            this.townshipForm.value.assignedTownship : null) : null,
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
                        municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined ?
                                            null : this.municipalityForm.value.assignedMunicipality !== ''
                                            ? this.municipalityForm.value.assignedMunicipality : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                            ? (this.townshipForm.value.assignedTownship !== '' ?
                                            this.townshipForm.value.assignedTownship : null) : null,
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
                        municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined ?
                                            null : this.municipalityForm.value.assignedMunicipality !== ''
                                            ? this.municipalityForm.value.assignedMunicipality : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                            ? (this.townshipForm.value.assignedTownship !== '' ?
                                            this.townshipForm.value.assignedTownship : null) : null,
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
                        municipalityCode: this.municipalityForm.value.assignedMunicipality === undefined ?
                                            null : this.municipalityForm.value.assignedMunicipality !== ''
                                            ? this.municipalityForm.value.assignedMunicipality : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                            ? (this.townshipForm.value.assignedTownship !== '' ?
                                            this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.municipalityForm.value.assignedMunicipality !== '' ?
                                        this.municipalityForm.value.assignedMunicipality : null) : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.municipalityForm.value.assignedMunicipality !== '' ?
                                        this.municipalityForm.value.assignedMunicipality : null) : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                            ? (this.municipalityForm.value.assignedMunicipality !== '' ?
                                            this.municipalityForm.value.assignedMunicipality : null) : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.municipalityForm.value.assignedMunicipality !== '' ?
                                        this.municipalityForm.value.assignedMunicipality : null) : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.municipalityForm.value.assignedMunicipality !== '' ?
                                        this.municipalityForm.value.assignedMunicipality : null) : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.municipalityForm.value.assignedMunicipality !== '' ?
                                        this.municipalityForm.value.assignedMunicipality : null) : null,
                        township: this.townshipForm.value.assignedTownship !== undefined
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                        this.townshipForm.value.assignedTownship : null) : null,
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
                                            ? (this.townshipForm.value.assignedTownship !== '' ?
                                            this.townshipForm.value.assignedTownship : null) : null,
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
                                        ? (this.townshipForm.value.assignedTownship !== '' ?
                                            this.townshipForm.value.assignedTownship : null) : null,
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

    searchData(response) {
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
    }

    refreshResult() {
        this.dataSource = new MatTableDataSource(this.results);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataLength = this.results !== undefined ? this.results.length : 0;
    }

    requestSearch() {
        const dialogRef = this.dialog.open(SearchRequestModalDialogComponent, {
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

    openDetails(searchDetails) {
        const searchData = {
            province: this.province,
            searchBy: this.searchType,
            searchFilter: this.searchFilter,
            searchNumber: this.searchNumber,
            farmForm: this.farmForm.value,
            provinceForm: this.provinceForm.value,
            criteriaForm: this.criteriaForm.value,
            searchFiltersForm: this.searchFiltersForm.value,
            ERF: this.ERF.value,
            Lease: this.Lease.value,
            Holdings: this.Holdings.value,
            rangeSearch: this.rangeSearch.value,
            sectionalTitle: this.sectionalTitle.value,
            sectionalerf: this.sectionalerf.value,
            textSearch: this.textSearch.value,
            municipalityForm: this.municipalityForm.value,
            townshipForm: this.townshipForm.value
        };
        const data = {
            searchData: JSON.stringify(searchData),
            searchDetails: JSON.stringify(searchDetails),
            templateItemListId: this.searchFilter.templateListItemId
        };
        this.searchService.setData(this.results, searchData);
        this.router.navigate(['/search/search-details'], {
            state: {
                queryParams: data
            }
        });
    }

    openNgiDetails(ngiDetails) {
        const searchData = {
            province: this.province,
            searchBy: this.searchType,
            searchFilter: this.searchFilter,
            searchNumber: this.searchNumber,
            farmForm: this.farmForm.value,
            provinceForm: this.provinceForm.value,
            criteriaForm: this.criteriaForm.value,
            searchFiltersForm: this.searchFiltersForm.value,
            ERF: this.ERF.value,
            Lease: this.Lease.value,
            Holdings: this.Holdings.value,
            rangeSearch: this.rangeSearch.value,
            sectionalTitle: this.sectionalTitle.value,
            sectionalerf: this.sectionalerf.value,
            textSearch: this.textSearch.value,
            municipalityForm: this.municipalityForm.value,
            townshipForm: this.townshipForm.value,
            config: this.searchFilter.config,
        };
        const data = {
            searchData: JSON.stringify(searchData),
            searchDetails: JSON.stringify(ngiDetails),
            templateItemListId: this.searchFilter.templateListItemId
        };
        this.dialogdata = searchData;
        this.router.navigate(['/search/search-details-ngi'], {
            state: {
                queryParams: data,
            }
        });
    }

    navigate() {
        this.router.navigate(['/pre-packages/configure']);
    }
    getAllMunicipalitiesByProvinceCode() {
        this.loaderService.display(true);
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

    getAllTownship() {
        this.loaderService.display(true);
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

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    downloadcsv() {
        this.loaderService.display(true);
        let filterTypeName = '';
        switch (this.searchFilter.searchTypeId) {
            case 48:
                filterTypeName = 'SG_NUMBER';
                break;
            case 481:
                filterTypeName = 'SURVEY_RECORD';
                break;
            case 483:
                filterTypeName = 'PARCEL_ERF';
            break;
            case 482:
                filterTypeName = 'COMPILATION_NUMBER';
            break;
        }
        this.restService.downloadSampleTemplate(filterTypeName).subscribe((res: any) => {
            this.downloadBlob(res, 'template.csv');
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    downloadBlob(blob, name) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = name;
        document.body.appendChild(link);
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );
        document.body.removeChild(link);
    }

    getAllPrePackageConfigs(stat: any) {
        this.loaderService.display(false);
        this.restService.getAllPrePackageConfigListing(this.page2, this.size2, '', '').subscribe(response => {
            this.prepackagedData = response.body.data;
            this.totalprepackaged = Number(response.headers.get('X-Total-Count'));
            if (this.page2 > 0 && stat === 'next') {
                this.PageFrom2 = this.PageTo2 + 1;
                this.PageTo2 = this.PageTo2 + this.prepackagedData.length;
            }
            if (this.page2 > 0 && stat === 'prev') {
                if (this.PageFrom2 === this.PageTo2) {
                    this.PageFrom2 = this.page2 * this.size2;
                    this.PageTo2 = this.PageFrom2 + this.size2;
                } else {
                    this.PageFrom2 = this.page2 * this.size2 + 1;
                    this.PageTo2 = this.page2 * this.size2 + (this.size2);
                }
            }
            if (this.page2 === 0 && stat === 'prev') {
                this.PageFrom2 = 1;
                this.PageTo2 = 5;
            }
            this.loaderService.display(false);
        });
        this.loaderService.display(false);
    }

    next() {
        if (this.totalMysearch > this.PageTo) {
            this.page = this.page + 1;
            this.getSearchData('next');
        }
    }

    getSearchData(stat) {
        this.loaderService.display(true);
        this.assignTownship = '';
        this.restService.getSearchData(this.page, this.size, '', this.userId, '').subscribe(searchData => {
            this.recentSearch = searchData.body.data;
            this.serverDate = searchData.body.timestamp;
            this.totalMysearch = Number(searchData.headers.get('X-Total-Count'));
            if (this.page > 0 && stat === 'next') {
                this.PageFrom = this.PageTo + 1;
                this.PageTo = this.PageTo + this.recentSearch.length;
            }
            if (this.page > 0 && stat === 'prev') {
                if (this.PageFrom === this.PageTo) {
                    this.PageFrom = this.page * this.size;
                    this.PageTo = this.PageFrom + this.size;
                } else {
                    this.PageFrom = this.page * this.size + 1;
                    this.PageTo = this.page * this.size + (this.size);
                }
            }
            if (this.page === 0 && stat === 'prev') {
                this.PageFrom = 1;
                this.PageTo = 5;
            }
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    previous() {
        if (this.page > 0) {
            this.page = this.page - 1;
        }
        this.getSearchData('prev');
    }

    next2() {
        if (this.totalprepackaged > this.PageTo2) {
            this.page2 = this.page2 + 1;
            this.getAllPrePackageConfigs('next');
        }
    }

    previous2() {
        if (this.page2 > 0) {
            this.page2 = this.page2 - 1;
        }
        this.getAllPrePackageConfigs('prev');
    }

    selectAttachments(file: FileList) {
        this.Attachments = file.item(0);
        this.uploadedFileName = file[0]['name'];
        const reader = new FileReader();
    }

    loadPage(event) {
        this.pageNo = event;
        this.search();
    }

    clearData() {
        this.searchNumber = '';
        this.farmForm = this.fb.group({
            lpi: '',
            farmName: '',
            portion: '',
            provinceId: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            parcelNumber: '',
            userId: '',
            municipalityCode: '',
            township: '',
        });
        this.searchFiltersForm = this.fb.group({
            assignedSearchFilters: ''
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
        this.Lease = this.fb.group({
            lpi: '',
            farmName: '',
            portion: '',
            provinceId: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            userId: '',
            municipalityCode: '',
            township: '',
        });
        this.Holdings = this.fb.group({
            lpi: '',
            farmName: '',
            portion: '',
            provinceId: '',
            parcelNumber: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            userId: '',
            municipalityCode: '',
            township: '',
        });
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
        this.sectionalTitle = this.fb.group({
            farmName: '',
            parcel: '',
            portion: '',
            municipalityCode: '',
            township: '',
            schemeNumber: '',
            schemeName: '',
            provinceId: '',
            searchTypeId: '',
            searchFilterId: '',
            provinceShortName: '',
            userId: '',
            filingNumber: '',
            sgNumber: '',
            sectionalCode: '',
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
        this.municipalityForm = this.fb.group({
            assignedMunicipality: ''
        });
        this.townshipForm = this.fb.group({
            assignedTownship: ''
        });
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

    addToCart() {
        this.dialogdata = {
            province: this.province,
            searchBy: this.searchType,
            searchFilter: this.searchFilter,
            searchNumber: this.searchNumber,
            farmForm: this.farmForm.value,
            provinceForm: this.provinceForm.value,
            criteriaForm: this.criteriaForm.value,
            searchFiltersForm: this.searchFiltersForm.value,
            ERF: this.ERF.value,
            Lease: this.Lease.value,
            Holdings: this.Holdings.value,
            rangeSearch: this.rangeSearch.value,
            sectionalTitle: this.sectionalTitle.value,
            sectionalerf: this.sectionalerf.value,
            textSearch: this.textSearch.value,
            municipalityForm: this.municipalityForm.value,
            townshipForm: this.townshipForm.value
            // township: this.Township,
            // municipality: this.municipality
        };
        const data = {
            searchData: JSON.stringify(this.dialogdata),
            templateItemListId: this.searchFilter.templateListItemId
        };
        if (this.searchFilter.templateListItemId === 567) {
            const dialogRef = this.dialog.open(AddtocartNgiDialogComponent, {
                height: 'autopx',
                width: '600px',
                data: {
                    queryParams: data,
                    searchDetails: this.NgiData,
                    searchdata: this.dialogdata,
                    results: this.selection.selected
                }
            });
            dialogRef.afterClosed().subscribe(() => {

            });
        } else {
            const dialogRef = this.dialog.open(AddtocartDialogComponent, {
                height: 'auto',
                width: 'auto',
                data: {
                    queryParams: data,
                    searchData: this.dialogdata,
                    results: this.selection.selected
                }
            });
            dialogRef.afterClosed().subscribe(() => {

            });
        }
    }

    downloadTemplateResult() {
        this.loaderService.display(true);
        this.restService.downloadTemplateSearchResultFile(this.templateAuditId).subscribe((res: any) => {
            this.downloadBlob(res, 'template.csv');
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }
}
