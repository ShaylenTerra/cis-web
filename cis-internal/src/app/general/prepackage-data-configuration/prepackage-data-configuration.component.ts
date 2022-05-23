import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {ConfigurationDialogComponent} from './configuration-dialog/configuration-dialog.component';

@Component({
    selector: 'app-prepackage-data-configuration',
    templateUrl: './prepackage-data-configuration.component.html',
    styleUrls: ['./prepackage-data-configuration.component.css']
})
export class PrepackageDataConfigurationComponent implements OnInit {
    direction = '';
    activefield = '';
    dataSource: any;
    page = 0;
    size = 5;
    PageFrom = 1;
    PageTo = 5;
    totalprepackage: any;
    columns = ['name', 'prepackageDataType', 'active', 'cost', 'action'];
    configData: any[] = [];
    dataLength: number;
    sortArr: any[] = [];
    // userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    locationData: any[] = [];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    constructor(private router: Router, private dialog: MatDialog,
                private restService: RestcallService,
                private snackbar: SnackbarService,
                private fb: FormBuilder,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.getAllPrePackageConfigs('');
        this.listItemsByListCodes();
    }

    getAllPrePackageConfigs(stat: any) {
        this.loaderService.display(true);
        let sortData = '';
        if (this.sortArr.length === 0) {
            this.activefield = '';
            this.direction = '';
        } else {
            this.activefield = this.sortArr[0].colName + ',' + this.sortArr[0].direction;
            this.direction = this.sortArr[0].direction;
            for (let i = 1; i < this.sortArr.length; i++) {
                sortData = '&sort=' + this.sortArr[i].colName + ',' + this.sortArr[i].direction;
            }
        }
        this.restService.getAllPrePackageConfigs(this.page, this.size, this.activefield, sortData).subscribe((res: any) => {
            this.configData = res.body.data;
            this.totalprepackage = Number(res.headers.get('X-Total-Count'));
            if (this.page > 0 && stat === 'next') {
                this.PageFrom = this.PageTo + 1;
                this.PageTo = this.PageTo + this.configData.length;
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
                this.PageTo = 3;
            }

            this.dataSource = new MatTableDataSource(this.configData);
            this.dataSource.paginator = this.paginator;
            this.dataLength = this.dataSource.data.length || 0;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    openDialog(data): void {

        const dialogRef = this.dialog.open(ConfigurationDialogComponent, {
                width: '850px',
                height: '700px',
                data: {value: data, location: this.locationData}
            },
        );
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.getAllPrePackageConfigs('');
        });
    }

    listItemsByListCodes() {
        this.restService.listItemsByListCode(30).subscribe((res: any) => {
            for (let i = 0; i < res.data.length; i++) {
                this.locationData.push({subscription: res.data[i].caption, daily: 0, weekly: 0, monthly: 0, yearly: 0});
            }
        });
    }

    next() {

        if (this.totalprepackage > this.PageTo) {
            this.page = this.page + 1;
            this.getAllPrePackageConfigs('next');
        }
    }

    previous() {
        if (this.page > 0) {
            this.page = this.page - 1;
        }
        this.getAllPrePackageConfigs('prev');

    }


    sortData(f) {
        const tempSort = {
            'colName': this.activefield = f.active,
            'direction': this.direction = f.direction
        };
        const exist = this.sortArr.filter(x => x.colName === f.active);
        if (exist.length === 0) {
            this.sortArr.push(tempSort);
        } else {
            const i = this.sortArr.findIndex(x => x.colName === f.active);
            this.sortArr[i] = tempSort;
        }
        this.getAllPrePackageConfigs('');
    }

    ngAfterChange() {
        for (let j = 0; j < this.sortArr.length; j++) {
            this.sort.sort({id: this.sortArr[j].colName, start: this.sortArr[j].direction, disableClear: true});
        }
        this.dataSource.sort = this.sort;
    }

    prepackageChange() {
        this.loaderService.display(true);
        this.restService.getexecutePrepackageSubscriptionChange()
        .subscribe(response => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Prepackage execution is in progress.', 'Success');
        },
        error => {
            this.loaderService.display(false);
      });
    }

    executeAll() {
        this.loaderService.display(true);
        this.restService.getexecutePrepackageSubscription()
        .subscribe(response => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Prepackage execution is in progress.', 'Success');
        },
        error => {
            this.loaderService.display(false);
      });
    }

}
