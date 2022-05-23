import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActionModalDialogComponent} from '../modals/action-modal/action-modal.dialog';
import {RestcallService} from '../../services/restcall.service';
import {PLSAddModalDialogComponent} from '../modals/pls-add-modal/pls-add-modal.dialog';
import {SnackbarService} from '../../services/snackbar.service';
import {LoaderService} from '../../services/loader.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {APP_DATE_FORMATS, AppDateAdapter} from '../../format-datepicket';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
    selector: 'app-pls-users',
    templateUrl: './pls-users.component.html',
    styleUrls: ['./pls-users.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class PlsUsersComponent implements OnInit {
    columns = ['firstName', 'createdDate', 'status', 'details', 'action'];
    data: any [] = [];
    dataSource: any;
    dataLength: number;
    page = 0;
    pageSize = 10;
    last = false;
    securityQuestions;
    isSpinnerVisible = false;
    filteredUsers: any[];
    dateBadges: any = {};
    provinceFilter: any[] = [];
    status: any[] = [];
    selectedRequestType: any[] = [];
    selectedDateRange: any = 0;
    dateRangeForm: FormGroup;
    selectedPriority: any[] = [];
    requestTypeSelected = 'Single';
    radioTypeSelected = '0';
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    rolesFilter: any[] = [];
    selectedRoleType: any[] = [];
    emailValue;

    pageNo: any = 1;
    totalCount: any;
    pageFromValue: any;
    pageToValue: any;
    public boundaryPage: number;
    backFilter: any;
    filterForm: FormGroup;

    constructor(private dialog: MatDialog, private snackbar: SnackbarService,
        private restService: RestcallService,
        private loaderService: LoaderService,
        private fb: FormBuilder,
        private router: Router) {
        this.boundaryPage = 1;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.dataSource.data.length || 0;
        this.dateRangeForm = this.fb.group({
            startDate: '',
            endDate: ''
        });
        this.filterForm = this.fb.group({
            email: [''],
            reqStatus: [''],
            selProvince: ['']
        });
            if (this.router.getCurrentNavigation().extras.state !== undefined) {
                this.backFilter = this.router.getCurrentNavigation().extras.state.filter;
                this.router.getCurrentNavigation().extras.state = undefined;
            }
    }

    ngOnInit() {
        this.getPlsUsers();
    }

    getPlsUsers() {
        // this.isSpinnerVisible = true;
        this.loaderService.display(true);
        forkJoin([
        this.restService.getListItems(20),
        this.restService.listPlsUsers('PROFESSIONAL_LAND_SURVEYOR', this.pageNo)]).subscribe(([statuses, payload]) => {
            const temp = [];
            this.pageSize = payload.headers.get('X-Total-Count');
            for (let i = 0; i < payload.body.data.length; i++) {
                payload.body.data[i].status = statuses.data.filter(x => x.itemId === payload.body.data[i].statusItemId).length > 0 ?
                                         statuses.data.filter(x => x.itemId === payload.body.data[i].statusItemId)[0].caption : '';
                temp.push(payload.body.data[i]);
            }
            this.filteredUsers = _.orderBy(temp, ['createdDate'], ['desc']);
            this.data = _.orderBy(temp, ['createdDate'], ['desc']);

            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.sort = this.sort;

            this.dataSource.paginator = this.paginator;
            this.dataLength = this.data.length || 0;

            this.status = this.distinct(this.data, 'isActive');
            this.status = this.distinct(this.data, 'status');
            this.provinceFilter = this.distinct(this.data, 'provinceName');
            this.refreshTable();
            this.CalculatePaging();
            // this.setProfileImages();
            this.loaderService.display(false);
            if (this.backFilter !== undefined) {
                this.emailValue = this.backFilter.email;
                this.selectedPriority = this.backFilter.selectedStatus;
                this.selectedDateRange = this.backFilter.selectedDateRange;
                this.selectedRequestType = this.backFilter.selectedProvince;
                this.radioTypeSelected = this.backFilter.selectedDateRange.toString();
                if (this.backFilter.selectedDateRange === 5) {
                    this.dateRangeForm.patchValue({
                        startDate: this.backFilter.selectedDateRangeForm.startDate,
                        endDate: this.backFilter.selectedDateRangeForm.endDate
                    });
                }
                this.status.forEach(item => {
                    item.checked = false;
                });
                for (let i = 0; i < this.status.length; i++) {
                    this.status[i].checked = this.selectedPriority.includes(this.status[i].key) ? true : false;
                }
                this.filterForm.patchValue({
                    email: this.emailValue,
                    reqPriority: this.selectedPriority,
                    selProvince: this.selectedRequestType
                });
                this.filterAll();
                this.backFilter = undefined;
            }
            },
            error => {
                this.loaderService.display(false);
                if (error.message === 'No PLS users found.') {
                    this.snackbar.openSnackBar('No PLS users found.', 'Message');
                } else {
                    this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
                }
            });
    }

    addNewUser() {
        const dialogRef = this.dialog.open(PLSAddModalDialogComponent, {
            width: '70%',
            height: '80%',
            data: 'PLS'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loaderService.display(true);
                this.getPlsUsers();
            }
        });
    }

    // viewDetails(details) {
    //     const dialogRef = this.dialog.open(PLSModalDialogComponent, {
    //         width: '75%',
    //         data: details
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             this.restService.updatePLSUser(result).subscribe(data => {
    //                 this.snackbar.openSnackBar('User updated', 'Success');
    //                 this.getPlsUsers();
    //             }, error => {
    //                 this.snackbar.openSnackBar('Unable to update user', 'Error');
    //             });
    //         }
    //     });
    // }

    viewDetails(details) {
        const data = {
                        details: details,
                        type: 'PLS',
                        securityQuestions: this.securityQuestions
                    };
        const filters = {
            'selectedDateRange': this.selectedDateRange,
            'selectedStatus': this.selectedPriority,
            'email': this.emailValue,
            'selectedDateRangeForm': this.dateRangeForm.value,
            'selectedProvince' : this.selectedRequestType
        };
        this.router.navigate(['/general/user-detail'], {state: {userDetail: data, filters: filters}});
    }

    openDialog(option: number, element: any) {
        let packet = {};
        if (option === 1) {
            packet = {
                action: 'Approve',
                type: 'PLS'
            };
        }
        if (option === 2) {
            packet = {
                action: 'De-Activate',
                type: 'PLS'
            };
        }
        if (option === 3) {
            packet = {
                action: 'Reject',
                type: 'PLS'
            };
        }
        if (option === 4) {
            packet = {
                action: 'Activate',
                type: 'PLS'
            };
        }
        if (option === 5) {
            packet = {
                action: 'Re-Activate',
                type: 'PLS'
            };
        }
        if (option === 6) {
            packet = {
                action: 'Lock',
                type: 'PLS'
            };
        }

        const dialogRef = this.dialog.open(ActionModalDialogComponent, {
            width: '50%',
            data: packet
        });

        dialogRef.afterClosed().subscribe(comments => {
            if (comments) {
                switch (option) {
                    case 1:
                        this.isSpinnerVisible = true;
                        this.restService.activateUserStatus('APPROVED', element.userId).subscribe((result) => {
                            this.snackbar.openSnackBar(`${packet['type']} User ${packet['action']}ed`, 'Success');
                                this.isSpinnerVisible = false;
                                this.getPlsUsers();
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
                            });
                        break;
                    case 2:
                        this.isSpinnerVisible = true;
                        this.restService.activateUserStatus('INACTIVE', element.userId).subscribe((result) => {
                                this.snackbar.openSnackBar(`${packet['type']} User De-activated`, 'Success');
                                this.isSpinnerVisible = false;
                                this.getPlsUsers();
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
                            });
                        break;
                    case 3:
                        this.isSpinnerVisible = true;
                        this.restService.activateUserStatus('INACTIVE', element.userId).subscribe((result) => {
                            this.snackbar.openSnackBar(`${packet['type']} User ${packet['action']}ed`, 'Success');
                                this.isSpinnerVisible = false;
                                this.getPlsUsers();
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
                            });
                        break;
                    case 4:
                        this.isSpinnerVisible = true;
                        this.restService.activateUserStatus('ACTIVE', element.userId).subscribe((result) => {
                                this.snackbar.openSnackBar(`${packet['type']} User Activated`, 'Success');
                                this.isSpinnerVisible = false;
                                this.getPlsUsers();
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
                            });
                        break;
                    case 5:
                        this.isSpinnerVisible = true;
                        this.restService.activateUserStatus('ACTIVE', element.userId).subscribe((result) => {
                                this.snackbar.openSnackBar(`${packet['type']} User Re-Activated`, 'Success');
                                this.isSpinnerVisible = false;
                                this.getPlsUsers();
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
                            });
                        break;
                    case 6:
                        this.isSpinnerVisible = true;
                        this.restService.activateUserStatus('LOCK', element.userId).subscribe((result) => {
                                this.snackbar.openSnackBar(`${packet['type']} User Locked`, 'Success');
                                this.isSpinnerVisible = false;
                                this.getPlsUsers();
                            },
                            error => {
                                this.isSpinnerVisible = false;
                                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
                            });
                        break;
                }
            }
        });
    }

    refreshTable() {
        this.updateBadges();
        this.dataSource = new MatTableDataSource(this.filteredUsers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.dataSource.data.length || 0;
    }

    async setProfileImages() {
        for (let i = 0; i < this.data.length; i++) {
            await this.restService.getDisplayProfileImage(this.data[i].userId).subscribe(response => {
                const reader = new FileReader();
                reader.readAsDataURL(response);
                reader.onload = (_event) => {
                    this.filteredUsers[i].sampleImageFile = reader.result;
                    this.data[i].profileImageFile = reader.result;
                };
            });
        }
    }

    onRequestTypeChange(selectedArr) {
        this.selectedRequestType = selectedArr;
        this.filterAll();
    }

    onRoleTypeChange(selectedArr) {
        this.selectedRoleType = selectedArr;
        this.filterAll();
    }

    emailFilter(val) {
        this.emailValue = val.target.value;
        this.filterAll();
    }

    ondateFilter(value) {
        this.selectedDateRange = value;
        this.filterAll();
    }

    onRequestPriority(event) {
        if (event.checked) {
            this.selectedPriority.push(event.source.value);
        } else {
            const index: number = this.selectedPriority.indexOf(event.source.value);
            if (index !== -1) {
                this.selectedPriority.splice(index, 1);
            }
        }
        this.filterAll();
    }

    filterAll() {
        this.filteredUsers = this.data;
        if (this.selectedDateRange !== 0) {
            if (this.selectedDateRange !== 5) {
                const dtend = new Date();
                const dtSart = new Date();
                dtSart.setDate(dtSart.getDate() - this.selectedDateRange);
                dtSart.setHours(0, 0, 0, 0);
                this.filteredUsers = this.data.filter((task) => {
                    const date = new Date(task.createdDate);
                    return (date >= dtSart && date <= dtend);
                });
            } else {
                if (this.dateRangeForm.value.endDate !== '' && this.dateRangeForm.value.startDate !== '') {
                    const dtend = this.dateRangeForm.value.endDate.setHours(0, 0, 0, 0);
                    const dtSart = this.dateRangeForm.value.startDate.setHours(0, 0, 0, 0);
                    this.filteredUsers = this.data.filter((task) => {
                        const date = new Date(task.createdDate);
                        return (date >= dtSart && date <= dtend);
                    });
                }
            }
        }

        if (this.emailValue !== undefined && this.emailValue !== null) {
            this.filteredUsers = this.filteredUsers.length > 0
            ? this.filteredUsers.filter((task) => task.email != null ? task.email.includes(this.emailValue) : '')
            : this.data.filter((task) => task.email.includes(this.emailValue));
        }

        if (this.selectedRequestType.length > 0) {
            this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers.filter((task) => {
                return this.selectedRequestType.indexOf(task.provinceName) !== -1;
            }) : this.data.filter((task) => {
                return this.selectedRequestType.indexOf(task.provinceName) !== -1;
            });
        }

        if (this.selectedRoleType.length > 0) {
            const arr = [];
            const filterArr = this.filteredUsers.length > 0 ? this.filteredUsers : this.data;
            if (this.filteredUsers.length > 0) {
                for (let j = 0; j < filterArr.length; j++) {
                    if (filterArr[j].userRoles.filter((task) => {
                        return this.selectedRoleType.indexOf(task.roleName) !== -1;
                        }).length > 0) {
                        arr.push(filterArr[j]);
                    }
                }
            }
            this.filteredUsers = arr;
        }

        if (this.selectedPriority.length > 0) {
            this.filteredUsers = this.filteredUsers.length > 0 ? this.filteredUsers.filter((task) => {
                return this.selectedPriority.indexOf(task.status) !== -1;
            }) : this.data.filter((task) => {
                return this.selectedPriority.indexOf(task.status) !== -1;
            });
        }
        this.refreshTable();
    }

    datechangeEvent() {
        if (this.dateRangeForm.value.startDate != null && this.dateRangeForm.value.endDate != null
            && this.dateRangeForm.value.startDate !== '' && this.dateRangeForm.value.endDate !== '') {
            this.filterAll();
        }
    }

    updateBadges() {
        this.dateBadges = {
            0: this.filteredUsers.length,
            1: 0,
            7: 0,
            30: 0
        };
        this.status.forEach(pl => {
            pl.count = 0;
        });
        this.filteredUsers.forEach(t => {
            let dtend = new Date();
            let dtSart = new Date();
            dtSart.setDate(dtSart.getDate() - 1);
            dtSart.setHours(0, 0, 0, 0);
            const date = new Date(t.createdDate);
            if (date >= dtSart && date <= dtend) {
                this.dateBadges[1]++;
            }
            dtend = new Date();
            dtSart = new Date();
            dtSart.setDate(dtSart.getDate() - 7);
            dtSart.setHours(0, 0, 0, 0);
            if (date >= dtSart && date <= dtend) {
                this.dateBadges[7]++;
            }
            dtend = new Date();
            dtSart = new Date();
            dtSart.setDate(dtSart.getDate() - 30);
            dtSart.setHours(0, 0, 0, 0);
            if (date >= dtSart && date <= dtend) {
                this.dateBadges[30]++;
            }
            this.status.forEach(pl => {
                if (pl.key === t.status) {
                    pl.count++;
                }
            });
        });
    }

    onValChange(value) {
        this.requestTypeSelected = value;
        this.radioTypeSelected = '0';
        this.snackbar.openSnackBar(`${this.requestTypeSelected} Request Selected with filter of Today`, 'Sucess');
    }

    onRadioValChange(value) {
        this.radioTypeSelected = value;
        const showText = value === 1 ? 'Today' : (value === 2 ? 'Last 7 Days' : 'Last 30 Days');
        this.snackbar.openSnackBar(`${this.requestTypeSelected} Request Selected with filter of ${showText}`, 'Sucess');
    }

    distinct(dataArr, key) {
        const unique = {};
        const distinct = [];
        for (let i = 0; i < dataArr.length; i++) {
            const element = dataArr[i];
            if (element[key]) {
                if (unique[element[key]] == null || unique[element[key]] === undefined) {
                    unique[element[key]] = distinct.length;
                    distinct.push({
                        key: element[key],
                        count: 1
                    });
                } else {
                    distinct[unique[element[key]]].count++;
                }
            }
        }
        return distinct;
    }

    CalculatePaging() {
        const initialVal = 1;
        if (this.pageNo === 1) {
            this.pageFromValue = initialVal;
            this.pageToValue = (this.data.length * this.pageNo) > Number(this.pageSize) ?
            Number(this.pageSize) : (this.data.length * this.pageNo);
        } else {
            this.pageFromValue = (this.data.length) < 20 ? (20 * (this.pageNo - 1)) + initialVal :
                                (this.data.length * (this.pageNo - 1)) + initialVal;
            this.pageToValue = (this.data.length) < 20 ? Number(this.pageSize) :
                                (this.data.length + 20) > Number(this.pageSize) ? Number(this.pageSize) :
                                ((this.data.length * (this.pageNo - 1)) + 20);
        }
    }

    loadPage(event) {
        this.pageNo = event;
        this.getPlsUsers();
    }
}
