import {Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-search-config',
    templateUrl: './search-config.component.html',
    styleUrls: ['./search-config.component.css']
})
export class SearchConfigComponent implements OnInit {
    isSpinnerVisible = false;
    criterias;
    criteria;
    userTypes;
    userType;
    data = [];
    dataSource = [];
    columns = ['searchBy', 'lp', 'mp', 'gt', 'nw', 'fs', 'nl', 'ec', 'nc', 'wc'];

    constructor(private restService: RestcallService, private snackbar: SnackbarService) {
    }

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        this.isSpinnerVisible = true;
        forkJoin([
            this.restService.getAllUserTypes(),
            this.restService.getSearchTypeCriteria(0)
        ]).subscribe(([userTypes, searchCriteria]) => {
            this.userTypes = userTypes.data;
            this.userType = userTypes.data[0];
            this.criterias = searchCriteria.data;
            this.criteria = searchCriteria.data[0];
            this.getSubCategories();
        });
    }


    getSubCategories() {
        this.isSpinnerVisible = true;
        this.data = [];
        this.restService.getSearchTypeCriteria(this.criteria.searchTypeId).subscribe(response => {
            const data = response.data;
            for (const x of data) {
                const payload = {
                    config: x.config,
                    controlType: x.controlType,
                    description: x.description,
                    isActive: x.isActive,
                    name: x.name,
                    parentSearchTypeId: x.parentSearchTypeId,
                    searchTypeId: x.searchTypeId,
                    tag: x.tag,
                    data: {
                        LP: {isActive: 0, mapId: 0},
                        MP: {isActive: 0, mapId: 0},
                        GT: {isActive: 0, mapId: 0},
                        NW: {isActive: 0, mapId: 0},
                        FS: {isActive: 0, mapId: 0},
                        KZN: {isActive: 0, mapId: 0},
                        EC: {isActive: 0, mapId: 0},
                        NC: {isActive: 0, mapId: 0},
                        WC: {isActive: 0, mapId: 0},
                    }
                };
                this.restService.getAllSearchTypeOfficeMapping(x.searchTypeId, this.userType).subscribe(y => {
                    for (const z of y.data) {
                        switch (z.provinceId) {
                            case 1:
                                payload.data.LP.isActive = z.isActive;
                                payload.data.LP.mapId = z.mapId;
                                break;
                            case 2:
                                payload.data.MP.isActive = z.isActive;
                                payload.data.MP.mapId = z.mapId;
                                break;
                            case 3:
                                payload.data.GT.isActive = z.isActive;
                                payload.data.GT.mapId = z.mapId;
                                break;
                            case 4:
                                payload.data.NW.isActive = z.isActive;
                                payload.data.NW.mapId = z.mapId;
                                break;
                            case 5:
                                payload.data.FS.isActive = z.isActive;
                                payload.data.FS.mapId = z.mapId;
                                break;
                            case 6:
                                payload.data.KZN.isActive = z.isActive;
                                payload.data.KZN.mapId = z.mapId;
                                break;
                            case 7:
                                payload.data.EC.isActive = z.isActive;
                                payload.data.EC.mapId = z.mapId;
                                break;
                            case 8:
                                payload.data.NC.isActive = z.isActive;
                                payload.data.NC.mapId = z.mapId;
                                break;
                            case 9:
                                payload.data.WC.isActive = z.isActive;
                                payload.data.WC.mapId = z.mapId;
                                break;
                        }

                    }

                });
                this.data.push(payload);
            }

            this.dataSource = this.data;
            this.isSpinnerVisible = false;
        });
    }

    toggleChange(element: any, event: any, provinceId: number, mapId: number) {
        this.isSpinnerVisible = true;
        const payload = {
            'isActive': event.checked ? 1 : 0,
            'mapId': mapId,
            'provinceId': provinceId,
            'searchTypeId': element.searchTypeId,
            'userType': this.userType === 'Internal' ? 'INTERNAL' :
                        (this.userType === 'External- Other' ? 'EXTERNAL_OTHER' :
                         (this.userType === 'External- PLS' ? 'EXTERNAL_PLS' : 'EXTERNAL_ARCHITECT')
                        )
        };
        this.restService.updateSearchTypeOfficeMappings(payload)
            .subscribe(response => {
                if (response.data.update) {
                    this.snackbar.openSnackBar('Updated', 'Success');
                } else {
                    this.snackbar.openSnackBar('Update failed', 'Error');
                }
            });
        this.isSpinnerVisible = false;
    }
}
