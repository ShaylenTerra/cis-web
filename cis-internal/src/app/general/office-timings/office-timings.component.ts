import {Component, OnInit, ViewChild} from '@angular/core';
import {OfficeTimingsEditDialogComponent} from './edit-modal/office-timing-edit.modal';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {RestcallService} from '../../services/restcall.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../services/snackbar.service';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../format-datepicket';
import {DatePipe} from '@angular/common';
import { LoaderService } from '../../services/loader.service';

interface TimingModel {
    provinceName: string;
    dayTimings: Array<DayTimings>;
}

interface DayTimings {
    day: string;
    from: string;
    to: string;
    isHoliday: boolean;
}

interface Province {
    createdDate: string;
    description: string;
    isActive: string;
    orgCode: string;
    orgName: string;
    provinceId: string;
    provinceName: string;
    provinceShortName: string;
}

@Component({
    selector: 'app-office-timings',
    templateUrl: './office-timings.component.html',
    styleUrls: ['./office-timings.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class OfficeTimingsComponent implements OnInit {
    form: FormGroup;
    columns = ['sno', 'start', 'end', 'type', 'occasion', 'action'];
    data;
    dataSource;
    dataLength;
    tableCols: Array<string>;
    dayTimingsCols: Array<string>;
    timings;
    provinces: [];
    // startDate;
    // startTime;
    // endDate;
    // endTime;
    // occasion;
    province;
    type = 'office';
    table = false;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(public dialog: MatDialog, private snackbar: SnackbarService,
                private restService: RestcallService, private fb: FormBuilder, public datePipe: DatePipe,
                private loaderService: LoaderService) {
        this.tableCols = ['province', 'timings', 'edit'];
        this.dayTimingsCols = ['day', 'from', 'to'];
        this.form = this.fb.group({
            occasion: ['', Validators.required],
            startDate: ['', Validators.required],
            startTime: ['', Validators.required],
            endDate: ['', Validators.required],
            endTime: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        this.loaderService.display(true);
        this.restService.getProvinces().subscribe(data => {
            this.provinces = data.data;
            this.province = data.data[0];
            this.getOfficeTimings();
            this.loaderService.display(false);
        }, error => {
            this.snackbar.openSnackBar('Error retrieving data', 'Error');
            this.loaderService.display(false);
        });
    }

    getOfficeTimings() {
        if (this.province) {
            this.table = false;
            this.loaderService.display(true);
            if (this.type === 'office') {
                this.restService.getOfficeTimes(this.province.provinceId).subscribe(data => {
                    this.data = data.data;
                    this.dataSource = new MatTableDataSource(this.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataLength = this.dataSource.data.length || 0;
                    this.dataSource.sort = this.sort;
                    if (this.dataLength !== 0) {
                        this.table = true;
                    } else {
                        this.table = false;
                    }
                    this.loaderService.display(false);
                }, error => {
                    this.snackbar.openSnackBar('Error fetching Office Timings', 'Error');
                    this.loaderService.display(false);
                });
            } else {
                this.restService.getOfficeHolidays(this.province.provinceId).subscribe(data => {
                    this.data = data.data;
                    this.dataSource = new MatTableDataSource(this.data);
                    this.dataSource.paginator = this.paginator;
                    this.dataLength = this.dataSource.data.length || 0;
                    this.table = true;
                    this.loaderService.display(false);
                }, error => {
                    this.snackbar.openSnackBar('Error fetching Office Holidays', 'Error');
                    this.loaderService.display(false);
                });
            }
        }
    }

    removeOfficeTiming(officeTimeId) {
        this.loaderService.display(true);
        this.restService.removeOfficeTime(officeTimeId).subscribe(data => {
            if (data.data.update === true) {
                this.snackbar.openSnackBar('Timings removed', 'Success');
                this.getOfficeTimings();
            }
            this.loaderService.display(false);
        }, error => {
            this.snackbar.openSnackBar('Unable to remove', 'Error');
            this.loaderService.display(false);
        });
    }

    saveNewTiming() {
        this.loaderService.display(true);
        if (this.form.invalid) {
            this.form.get('occasion').markAsTouched();
            this.form.get('startDate').markAsTouched();
            this.form.get('startTime').markAsTouched();
            this.form.get('endDate').markAsTouched();
            this.form.get('endTime').markAsTouched();
            this.loaderService.display(false);
        } else {
            const payload = {
                'description': this.form.value.occasion,
                'fromDate': this.datePipe.transform(this.form.value.startDate, 'dd/MMM/yyyy'),
                'fromTime': this.form.value.startTime.length === 7 ? '0' + this.form.value.startTime : this.form.value.startTime,
                'isActive': 1,
                'officeTimingType': this.type === 'office' ? 'OFFICE_TIMING' : 'OFFICE_HOLIDAY',
                'provinceId': this.province.provinceId,
                'toDate': this.datePipe.transform(this.form.value.endDate, 'dd/MMM/yyyy'),
                'toTime': this.form.value.endTime.length === 7 ? '0' + this.form.value.endTime : this.form.value.endTime,
                'userId': 1
            };
            this.restService.addOfficeTiming(payload).subscribe(data => {
                this.snackbar.openSnackBar('Timing added', 'Success');
                this.getOfficeTimings();
                this.form.reset();
                this.loaderService.display(false);
            }, error => {
                this.snackbar.openSnackBar('Error adding timings', 'Error');
                this.loaderService.display(false);
            });
        }
    }

    editClicked(timingElement: TimingModel) {
        const dialogRef = this.dialog.open(OfficeTimingsEditDialogComponent, {
            width: '500px',
            data: {province: timingElement.provinceName}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
                this.snackbar.openSnackBar('Timings Changed Successfully', 'Success');
            }
        });
    }

    historyClicked() {
        this.snackbar.openSnackBar('History will be Displayed', 'Success');
    }

    get occasion() {
        return this.form.get('occasion');
    }
    get startDate() {
        return this.form.get('startDate');
    }
    get endDate() {
        return this.form.get('endDate');
    }
    get startTime() {
        return this.form.get('startTime');
    }
    get endTime() {
        return this.form.get('endTime');
    }
}
