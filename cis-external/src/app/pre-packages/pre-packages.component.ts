import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {RestcallService} from '../services/restcall.service';
import {SnackbarService} from '../services/snackbar.service';
import {SubscriptionDialogComponent} from './subscription-dialog/subscription-dialog.component';
import {map} from 'rxjs/operators';
import {PreSubModalDialogComponent} from './prepackageSubDialog/pre-sub-modal.dialog';
import { LoaderService } from '../services/loader.service';

export interface PrePackage {
    title: string;
    image: string;
    description: string;
    type: string;
    cost: string;
}

@Component({
    selector: 'app-pre-packages',
    templateUrl: './pre-packages.component.html',
    styleUrls: ['./pre-packages.component.css']
})

export class PrePackagesComponent implements OnInit {
    location;
    tempLocation;
    province;
    Township;
    Province;
    municipality;
    filteredMuncipality;
    filteredminorregion;
    filteredTownship;
    MajorRegionOrAdminDistrict;
    filteredProvince;
    assignMunicipality;
    townshipForm: FormGroup;
    provinceForm: FormGroup;
    assignTownship;
    assignProvince;
    prePackages: any;
    municipalitydata: any[];
    minorregiondata: any[];
    townshipdata: any[];
    provincepdata: any[];
    municipalityForm: FormGroup;
    minorregion;
    minorregionForm: FormGroup;
    isSpinnerVisible = false;
    configData: any;
    muncipalityTownship: any;
    locationArr: any;
    filteredLocation: any;

    constructor(public snackbar: SnackbarService, public router: Router, private loaderService: LoaderService,
                private restService: RestcallService, private dialog: MatDialog, private fb: FormBuilder) {
        this.prePackages = [];
        this.provinceForm = this.fb.group({
            assignedProvince: ''
        });
        this.municipalityForm = this.fb.group({
            assignedMunicipality: ''
        });
        this.townshipForm = this.fb.group({
            assignedTownship: ''
        });
        this.minorregionForm = this.fb.group({
            assignedminorregion: ''
        });
    }

    get getminorregion() {
        return this.minorregionForm.get('assignedminorregion');
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

    ngOnInit() {
        this.getAllPrePackageConfigs();
        this.listItemsByListCode();
    }

    listItemsByListCode() {
        this.restService.listItemsByListCode(30).subscribe((res: any) => {
            this.locationArr = res.data;
            this.filteredLocation = res.data;
            this.isSpinnerVisible = false;
            this.location = this.locationArr.filter(x => x.caption === 'National')[0];
            this.changeLocation();
        });
    }

    subscribe(element: any) {
        let township;
        let muncipality;
        let location;
        let locationId;

        if (element.frequencyType === null) {
            element.errorMsg = 'Please select frequency type';
            return;
        } else if (element.frequencyType !== null) {
            element.errorMsg = '';
        }

        if (this.filteredTownship !== undefined) {
            township = this.townshipForm.value.assignedTownship;
            location = this.townshipForm.value.assignedTownship;
        }
        if (this.filteredMuncipality !== undefined) {
            if (this.municipalityForm.value.assignedMunicipality.localMunicipalityCode !== undefined) {
                muncipality = this.filteredMuncipality
                    .filter(x => x.localMunicipalityCode === this.municipalityForm.value.assignedMunicipality
                        .localMunicipalityCode)[0].localMunicipalityCode;
                location = this.filteredMuncipality[0].localMunicipalityName;
            }
        }

        if (this.location.caption === 'National') {
            location = this.location.caption;
            locationId = 'RSA';
        } else if (this.location.caption === 'Province') {
            location = this.province.province;
            locationId = this.province.mdbCode;
        } else if (this.location.caption === 'Municipality') {
            location = this.municipality.municipality;
            locationId = this.municipality.mdbCode;
        }  else if (this.location.caption === 'Admin District' || this.location.caption === 'Major Region') {
            location = this.MajorRegionOrAdminDistrict.majorRegionOrAdminDistrict;
            locationId = this.MajorRegionOrAdminDistrict.mdbCode;
        } else if (this.location.caption === 'Minor Region') {
            location = this.minorregion.minorRegion;
            locationId = this.minorregion.mdbCode;
        }



        if (element.configurationData != null) {
            let refType = '';
            if (element.frequencyType === '1') {
                refType = 'Daily';
            }
            if (element.frequencyType === '2') {
                refType = 'Monthly';
            }
            if (element.frequencyType === '3') {
                refType = 'Yearly';
            }
            if (element.frequencyType === '4') {
                refType = 'Weekly';
            }
            const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
                width: '550px',
                data: {
                    reference: element.configurationData,
                    referenceType: refType,
                    desc: element,
                    location: this.location.itemId,
                    locationName: location,
                    locationId: locationId,
                    province: (this.province === undefined || this.province == null) ? 0 : this.province.provinceId,
                    municipalityCode: muncipality,
                    township: township
                }
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                if (resultCode != null && resultCode !== undefined) {
                    const dialog = this.dialog.open(PreSubModalDialogComponent, {
                        width: '50%',
                        data: {
                            refNo: resultCode.data.referenceId
                        }
                    });
                }
            });
        } else {
            this.snackbar.openSnackBar('Configuration data not found', 'Error');
        }
    }

    navigate() {
        this.router.navigate(['subscriptions/my-subscriptions']);
    }

    getAllPrePackageConfigs() {
        this.restService.getAllPrePackageConfigs('', '', '', '').subscribe(response => {
            this.prePackages = [];
            if (this.location !== undefined) {
                this.tempLocation = this.location.caption;
                for (let j = 0; j < response.body.data.length; j++) {
                    if (response.body.data[j].configurationData != null) {
                        if (response.body.data[j].configurationData
                            .filter(x => x.subscription === this.tempLocation
                                && (x.daily === 1 || x.monthly === 1 || x.weekly === 1 || x.yearly === 1)
                            ).length > 0) {
                            response.body.data[j].configurationData = response.body.data[j].configurationData
                                .filter(x => x.subscription === this.location.caption)[0];
                            response.body.data[j].frequencyType = null;
                            response.body.data[j].errorMsg = '';
                            this.prePackages.push(response.body.data[j]);
                        }
                    }
                }
                this.setPrepackageImages();
            }
        });
    }

    async setPrepackageImages() {
        for (let i = 0; i < this.prePackages.length; i++) {
            await this.restService.getPrepackagedImage(this.prePackages[i].prePackageId).subscribe(response => {
                const reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onload = (_event) => {
                    if (this.prePackages !== undefined) {
                        this.prePackages[i].sampleImageFile = reader.result;
                    }
                };
            });
        }
    }

    changeLocation() {
        this.getAllPrePackageConfigs();
        // this.province = null;
        this.municipalityForm.patchValue({
            assignedMunicipality: ''
        });
        this.townshipForm.patchValue({
            assignedTownship: ''
        });
        this.restService.getProvinces();
        this.getAllProvince();
    }

    onProvince() {
        if (this.location.caption === 'Municipality') {
            this.getAllMunicipalitiesByProvinceCode();
        }  else if (this.location.caption === 'Admin District' || this.location.caption === 'Major Region') {
            this.getMajorRegionOrAdminDistrict();
        } else if (this.location.caption === 'Minor Region') {
            this.getMinorRegion() ;
        }
    }

    getMajorRegionOrAdminDistrict() {
        this.assignTownship = '';
        this.townshipdata = [];
        this.MajorRegionOrAdminDistrict = null;
        this.restService.getMajorRegionOrAdminDistrict(this.province.provinceId).subscribe(response => {
            this.townshipdata = response.data;
            this.filteredTownship = response.data;
            this.isSpinnerVisible = false;
        });


        this.getTownship.valueChanges
            .pipe(
                map(value => typeof value === 'string' ? value : (value)),
                map(township => township ? this.filterTownship(township) :
                    this.townshipdata !== undefined ? this.townshipdata.slice() : this.townshipdata)
            ).subscribe(response => {
            this.filteredTownship = response;
        });
    }

    getMinorRegion() {
        this.assignMunicipality = '';
        this.minorregiondata = [];
        this.minorregion = null;
        this.restService.getMinorRegion(this.province.provinceId).subscribe(response => {
            this.minorregiondata = response.data;
            this.filteredminorregion = response.data;
        });

        this.getminorregion.valueChanges
            .pipe(
                map(value => typeof value === 'string' ? value : (value)),
                map(minorregion => minorregion ? this.filterminorregion(minorregion) :
                    this.minorregiondata !== undefined ? this.minorregiondata.slice() : this.minorregiondata)
            ).subscribe(response => {
            this.filteredminorregion = response;
        });
    }

    filterminorregion(value: any) {
        const filterValue = value.mdbCode.toLowerCase();
        return this.minorregiondata.filter(muncipality => (muncipality.minorRegion).toLowerCase().includes(filterValue));
    }

    assignedminorregion(event) {
        this.assignMunicipality = event.option.value;
    }

    displayF(minorregiondata) {
        return minorregiondata ? (minorregiondata.minorRegion) : '';
    }

    getAllMunicipalitiesByProvinceCode() {
        this.assignMunicipality = '';
        this.municipality = null;
        this.municipalitydata = [];
        this.restService.getMunicipality(this.province.provinceId).subscribe(response => {
            this.municipalitydata = response.data;
            this.filteredMuncipality = response.data;
        });

        this.getMuncipality.valueChanges
            .pipe(
                map(value => typeof value === 'string' ? value : (value)),
                map(municipality => municipality ? this.filterMunicipality(municipality) :
                    this.municipalitydata !== undefined ? this.municipalitydata.slice() : this.municipalitydata)
            ).subscribe(response => {
            this.filteredMuncipality = response;
        });
    }

    filterMunicipality(value: any) {
        const filterValue = value.mdbCode.toLowerCase();
        return this.municipalitydata.filter(muncipality => (muncipality.municipality)
            .toLowerCase().includes(filterValue)
        );
    }

    assignedMunicipality(event) {
        this.assignMunicipality = event.option.value;

    }

    displayFn(muncipalitydata) {
        return muncipalitydata ? (muncipalitydata.municipality) : '';
    }

    getAllTownship() {
        this.assignTownship = '';
        this.restService.getTownship(this.province.provinceId).subscribe(response => {
            this.townshipdata = response.data;
            this.filteredTownship = response.data;
            this.isSpinnerVisible = false;
        });


        this.getTownship.valueChanges
            .pipe(
                map(value => typeof value === 'string' ? value : (value)),
                map(township => township ? this.filterTownship(township) :
                    this.townshipdata !== undefined ? this.townshipdata.slice() : this.townshipdata)
            ).subscribe(response => {
            this.filteredTownship = response;
        });
    }

    filterTownship(value: any) {
        const filterValue = value.mdbCode.toLowerCase();
        return this.townshipdata.filter(township => (township.majorRegionOrAdminDistrict).toLowerCase().includes(filterValue));
    }

    assignedTownship(event) {
        this.assignTownship = event.option.value;

    }

    displayTownship(townshipdata) {
        return townshipdata ? (townshipdata.majorRegionOrAdminDistrict) : '';
    }

    getAllProvince() {
        this.assignProvince = '';
        this.loaderService.display(true);
        this.restService.getLocation().subscribe(response => {
            this.provincepdata = response.data;
            this.filteredProvince = response.data;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });


        this.getProvince.valueChanges
            .pipe(
                map(value => typeof value === 'string' ? value : (value != null ? value.province : value)),
                map(province => province ? this.filterProvince(province) :
                    this.provincepdata !== undefined ? this.provincepdata.slice() : this.provincepdata)
            ).subscribe(response => {
            this.filteredProvince = response;
        });
    }

    filterProvince(value: string) {
        const filterValue = value.toLowerCase();
        return this.provincepdata.filter(province => (province.province).toLowerCase().includes(filterValue));
    }

    assignedProvince(event) {
        this.assignProvince = event.option.value;

    }

    displayProvince(provincedata) {
        return provincedata ? (provincedata.province) : '';
    }

    displayLocation(locationdata) {
        return locationdata ? (locationdata.caption) : '';
    }

}
