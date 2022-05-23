import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {LoaderService} from '../../services/loader.service';
import * as _ from 'lodash';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { SysConfigDialogComponent } from './sys-config-dialog/sys-config-dialog.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {map, takeUntil} from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { OfficeConfigDialogComponent } from './office-config-dialog/office-config-dialog.component';
import { ReservationConfigDialogComponent } from './reservation-config-dialog/reservation-config-dialog.component';
import { AddNewDialogComponent } from '../../config/list-management/modal/add-new';
import { OfficeLocationDialogComponent } from './officelocation-confirm-dialog/officelocation-confirm-dialog.component';

@Component({
    selector: 'app-system-config',
    templateUrl: './system-config.component.html',
    styleUrls: ['./system-config.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class SystemConfigComponent implements OnInit {
    tab = 'general';
    columns = ['caption', 'tag', 'tagValue', 'action'];
    data: any [] = [];
    dataSource: any;
    dataLength: number;
    provinceFilter: any[] = [];

    columnsReason = ['caption', 'data1', 'action'];
    dataReason: any [] = [];
    dataSourceReason: any;
    dataLengthR: number;

    columnsSystem = ['caption', 'reservationSystem', 'action'];
    dataSystem: any [] = [];
    dataSourceSystem: any;
    dataLengthS: number;

    columnsNotification = ['caption', 'data1', 'action'];
    dataNotification: any [] = [];
    dataSourceNotification: any;
    dataLengthN: number;

    columnsProvince = ['name', 'system', 'action'];
    dataProvince: any [] = [];
    dataSourceProvince: any;
    dataLengthP: number;

    systemProvince: any [] = [];
    provinces;
    province;
    public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    provinceForm: FormGroup;
    assignProvince;
    provincepdata: any[];
    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    public provinceFilterCtrl: FormControl = new FormControl();
    protected _onDestroyProvince = new Subject<void>();

    constructor(private dialog: MatDialog, private snackbar: SnackbarService,
        private restService: RestcallService, private fb: FormBuilder,
        private loaderService: LoaderService) {
            this.provinceForm = this.fb.group({
                assignedProvince: ''
              });
    }

    ngOnInit() {
        this.getGeneralConfig();
        this.getProvinces();
    }

    get getProvince() {
        return this.provinceForm.get('assignedProvince');
      }

    getGeneralConfig() {
        this.loaderService.display(true);
        this.restService.getSystemConfiguration().subscribe((result) => {
            this.data = result.data;
            this.refreshTable();
            this.loaderService.display(false);
        },
        error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error occured.', 'Error');
        });
    }

    addNewSysConfig() {
        const dialogRef = this.dialog.open(SysConfigDialogComponent, {
            width: '50%',
            height: '60%',
            data: null
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getGeneralConfig();
        });
    }

    editSysConfig(details) {
        const dialogRef = this.dialog.open(SysConfigDialogComponent, {
            width: '50%',
            height: '65%',
            data: details
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getGeneralConfig();
        });
    }

    editReservationConfig(details) {
        // Find index of specific object using findIndex method.
        const objIndex = this.dataReason.findIndex((obj => obj.itemId === details.itemId));

        // Update object's name property.
        this.dataReason[objIndex].editable = true;
        // const dialogRef = this.dialog.open(ReservationConfigDialogComponent, {
        //     width: '50%',
        //     height: '55%',
        //     data: {value:details,msg:"Reservation"}
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     this.getReasonConfig();
        // });
    }

    saveReservationReason(details) {
        const data = [];
        delete details.editable;
        data.push(details);
        this.loaderService.display(true);
        this.restService.saveListItemDataColl(data).subscribe(() => {
        this.snackbar.openSnackBar('Reservation updated Successfully', 'Success');
        // Find index of specific object using findIndex method.
        const objIndex = this.dataReason.findIndex((obj => obj.itemId === details.itemId));
        // Update object's name property.
        this.dataReason[objIndex].editable = false;
        this.getReasonConfig();
        this.loaderService.display(false);
        }, () => {
        this.loaderService.display(false);
        });
    }

    editReminderConfig(details) {
        // Find index of specific object using findIndex method.
        const objIndex = this.dataNotification.findIndex((obj => obj.itemId === details.itemId));

        // Update object's name property.
        this.dataNotification[objIndex].editable = true;
        // const dialogRef = this.dialog.open(ReservationConfigDialogComponent, {
        //     width: '50%',
        //     height: '55%',
        //     data: {value:details,msg:"Reservation Notification"}
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     this.getDataNotification();
        // });
    }

    saveNotification(details) {
        const data = [];
        delete details.editable;
        data.push(details);
        this.loaderService.display(true);
        this.restService.saveListItemDataColl(data).subscribe(() => {
        this.snackbar.openSnackBar('Reservation Notification updated Successfully', 'Success');
        // Find index of specific object using findIndex method.
        const objIndex = this.dataNotification.findIndex((obj => obj.itemId === details.itemId));
        // Update object's name property.
        this.dataNotification[objIndex].editable = false;
        this.getDataNotification();
        this.loaderService.display(false);
        }, () => {
        this.loaderService.display(false);
        });
    }

    addReminderConfig() {
        const modalInput = {
            title: 'Reservation Notification',
            compareValues: this.dataNotification.map(i => i.caption),
            listCode: 327
        };

        const dialogRef = this.dialog.open(AddNewDialogComponent, {
            width: '450px',
            data: modalInput
        });
        dialogRef.afterClosed().subscribe(data => {
            this.getDataNotification();
        });
    }

    removeSystemConfiguration(val) {
        this.loaderService.display(true);
        this.restService.removeSystemConfiguration(val.id).subscribe((res: any) => {
          this.snackbar.openSnackBar(`System configuration deleteded`, 'Success');
          this.getGeneralConfig();
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
        });
      }

      getProvinces() {
        this.restService.getProvinceByCategory().subscribe((provinces: any) => {
            this.provincepdata = provinces.data.filter(x => x.provinceId !== -1);
            this.province = this.provincepdata[0];
            this.filteredProvince.next(this.provincepdata.slice());
            this.provinceFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroyProvince))
                .subscribe(() => {
                    this.filterProvinces();
                });
        });
        this.bindOfficeLocationSystem(this.province);
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
            this.provincepdata.filter(bank => bank.caption.toLowerCase().indexOf(search) > -1)
        );
      }


    refreshTable() {
        this.dataSource = new MatTableDataSource(this.data);
        // this.dataSource.sort =  this.sort.toArray()[0];
        this.dataSource.paginator = this.paginator.toArray()[0];
        this.dataLength = this.dataSource.data.length || 0;
    }

    refreshProvinceTable() {
        this.dataSourceProvince = new MatTableDataSource(this.systemProvince);
        // this.dataSource.sort =  this.sort.toArray()[0];
        this.dataSourceProvince.paginator = this.paginator.toArray()[0];
        this.dataLengthP = this.dataSourceProvince.length || 0;
    }

    getReasonConfig() {
        this.loaderService.display(true);
        this.restService.getListItemsData(686, 268).subscribe((result) => {
            this.dataReason = result.data;
            this.dataReason.forEach(function (element) {
                element.editable = false;
            });
            this.refreshReasonTable();
            this.loaderService.display(false);
        },
        error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error occured.', 'Error');
        });
    }

    getSystemConfig() {
        this.loaderService.display(true);
        this.restService.getProvinceByCategory().subscribe((result) => {
            this.dataSystem = result.data;
            this.dataSystem.forEach(function (element) {
                element.editable = false;
            });
            this.refreshSystemTable();
            this.loaderService.display(false);
        },
        error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error occured.', 'Error');
        });
    }

    getDataNotification() {
        this.loaderService.display(true);
        this.restService.getListItemsData(690, 327).subscribe((result) => {
            this.dataNotification = result.data;
            this.dataNotification.forEach(function (element) {
                element.editable = false;
            });
            this.refreshNotificationTable();
            this.loaderService.display(false);
        },
        error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error occured.', 'Error');
        });
    }

    refreshReasonTable() {
        this.dataSourceReason = new MatTableDataSource(this.dataReason);
        // this.dataSource.sort =  this.sort.toArray()[1];
        this.dataSource.paginator = this.paginator.toArray()[1];
        this.dataLengthR = this.dataSourceReason.data.length || 0;
    }
    refreshSystemTable() {
        this.dataSourceSystem = new MatTableDataSource(this.dataSystem);
        // this.dataSourceSystem.sort = this.sort.toArray()[3];
        this.dataSourceSystem.paginator = this.paginator.toArray()[3];
        this.dataLengthS = this.dataSourceSystem.data.length || 0;
    }

    refreshNotificationTable() {
        this.dataSourceNotification = new MatTableDataSource(this.dataNotification);
        // this.dataSourceNotification.sort = this.sort.toArray()[2];
        this.dataSourceNotification.paginator = this.paginator.toArray()[2];
        this.dataLengthS = this.dataSourceNotification.data.length || 0;
    }

    changeTab(val) {

            switch (val) {
                case 'general':
                    this.tab = 'general';
                    this.getGeneralConfig();
                    break;
                case 'reasons':
                    this.tab = 'reasons';
                    this.getReasonConfig();
                    break;
                case 'system':
                    this.tab = 'system';
                    this.getSystemConfig();
                    this.getProvinces();
                    // this.refreshProvinceTable();
                    break;
                case 'notification':
                    this.tab = 'notification';
                    this.getDataNotification();
                    // this.refreshProvinceTable();
                break;
            }
        }

        addLocation(): void {
            const dialogRef = this.dialog.open(OfficeConfigDialogComponent, {
                width: '500px',
                data: {province: this.province}
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                this.bindOfficeLocationSystem(this.province);
            });
        }

        editOfficeSystem(details) {
            // Find index of specific object using findIndex method.
            const objIndex = this.dataSystem.findIndex((obj => obj.boundaryId === details.boundaryId));
            // Update object's name property.
            this.dataSystem[objIndex].editable = true;
        }

        saveOfficeSystem(details) {
            delete details.editable;
            this.loaderService.display(true);
            this.restService.saveLocationReservationSystem(details).subscribe(() => {
            this.snackbar.openSnackBar('Office system updated Successfully', 'Success');
            // Find index of specific object using findIndex method.
            const objIndex = this.dataSystem.findIndex((obj => obj.boundaryId === details.boundaryId));
            // Update object's name property.
            this.dataSystem[objIndex].editable = false;
            this.getSystemConfig();
            this.loaderService.display(false);
            }, () => {
            this.loaderService.display(false);
            });
        }

        bindOfficeLocationSystem(event) {
            if (event !== undefined) {
                this.loaderService.display(true);
                this.restService.getReservationSystemNonProvinceLocations(event.boundaryId).subscribe((result) => {
                    this.systemProvince = result.data;
                    this.refreshProvinceTable();
                    this.loaderService.display(false);
                },
                error => {
                    this.loaderService.display(false);
                    this.snackbar.openSnackBar('Error occured.', 'Error');
                });
            }
        }

        deleteOfficeLocation(ele) {
            const dialogRef = this.dialog.open(OfficeLocationDialogComponent, {
                width: '50%',
                data: ele
            });
            dialogRef.afterClosed().subscribe(async () => {
                this.bindOfficeLocationSystem(this.province);
            });
        }
}
