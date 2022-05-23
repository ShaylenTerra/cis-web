import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {LoaderService} from '../../services/loader.service';

@Component({
    selector: 'app-office-timings-list',
    templateUrl: './office-timings-list.component.html',
    styleUrls: ['./office-timings-list.component.css']
})
export class OfficeTimingsListComponent implements OnInit {
    isSpinnerVisible = false;
    columns = ['sno', 'start', 'end', 'type', 'occasion'];
    data;
    dataSource;
    dataLength;
    provinces: Array<any> = [];
    province;
    type = 'office';

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private snackbar: SnackbarService, private restService: RestcallService, private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        this.loaderService.display(true);
        this.restService.getProvinces().subscribe(payload => {
            this.provinces = payload.data;
            this.province = this.provinces && this.provinces[0];
            this.getOfficeTimings();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error retrieving data', 'Error');
        });
    }

    getOfficeTimings() {
        if (this.province) {
            if (this.type === 'office') {
                this.loaderService.display(true);
                this.restService.getOfficeTimes(this.province.provinceId).subscribe(data => {
                    this.data = data.data;
                    this.dataSource = new MatTableDataSource(this.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataLength = this.dataSource.data.length || 0;
                    this.dataSource.sort = this.sort;
                    this.loaderService.display(false);
                }, error => {
                    this.loaderService.display(false);
                    this.snackbar.openSnackBar('Error fetching Office Timings', 'Error');
                });
            } else {
                this.loaderService.display(true);
                this.restService.getOfficeHolidays(this.province.provinceId).subscribe(data => {
                    this.data = data.data;
                    this.dataSource = new MatTableDataSource(this.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataLength = this.dataSource.data.length || 0;
                    this.loaderService.display(false);
                }, error => {
                    this.loaderService.display(false);
                    this.snackbar.openSnackBar('Error fetching Office Holidays', 'Error');
                });
            }
        }
    }
}
