import {AddNewDialogComponent} from './modal/add-new';
import {MatDialog} from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {ExportToCsv} from 'export-to-csv';
import {RestcallService} from '../../services/restcall.service';
import * as enums from './../../constants/enums';
import {SnackbarService} from '../../services/snackbar.service';
import {LoaderService} from '../../services/loader.service';
import {AddrolesComponent} from './addRoles/addroles.component';
import {DefaultListDialogComponent} from './default-list-dialog/default-list-dialog.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';

@Component({
    selector: 'app-list-management',
    templateUrl: './list-management.component.html',
    styleUrls: ['./list-management.component.css']
})
export class ListManagementComponent implements OnInit {
    tab = 'userRoles';
    menuItem = 'communications';
    isSpinnerVisible = false;
    masterList: any;
    provinces: any;
    externalRoles: any;
    internalRoles: any;
    dataCols: Array<string> = ['itemCode', 'name', 'active', 'isDefault', 'action', 'edit'];
    dataSource;
    category;

    commColums: Array<string> = ['code', 'mode'];
    desgColums: Array<string> = ['descode', 'desmode'];
    roleColums: Array<string> = ['descode', 'roleName', 'action', 'edit'];
    formatTypes;
    roleValue: any = 'EXTERNAL';
    roles: any;
    defaultVal: any;
    constructor(private snackbar: SnackbarService, public dialog: MatDialog,
                private restService: RestcallService, private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.loadInitials();
    }

    async loadInitials() {
        this.loaderService.display(true);
        forkJoin([
            this.restService.getAllMasterList(),
            this.restService.getProvinces(),
            this.restService.getRoles('EXTERNAL'),
            this.restService.getRoles('INTERNAL')
        ]).subscribe(([lists, provinces, externalRoles, internalRoles]) => {
            this.masterList = lists.data;
            this.provinces = provinces.data;
            this.externalRoles = externalRoles.data;
            this.internalRoles = internalRoles.data;
            this.changeRoleTable();
            this.loaderService.display(false);
        });
    }

    fetchListData() {
        this.restService.getListItems(this.category.listCode).subscribe(payload => {
            this.defaultVal = undefined;
            const data = payload.data;
            this.dataSource = data;
        }, error => {
            this.snackbar.openSnackBar('Error fetching categories', 'Error');
        });
    }

    changeStatus(itemId, status) {
        this.restService.updateListItemStatus(status, itemId).subscribe(payload => {
            const data = payload.data;
            if (data.update === true) {
                this.snackbar.openSnackBar('Status updated', 'Success');
            } else {
                this.snackbar.openSnackBar('Unable to update status', 'Error');
            }
            this.fetchListData();
        }, error => {
            this.snackbar.openSnackBar('Error updating status', 'Error');
        });
    }

    add() {
        const modalInput = {
            title: this.category.caption,
            compareValues: this.dataSource.map(i => i.caption),
            listCode: this.category.listCode
        };

        const dialogRef = this.dialog.open(AddNewDialogComponent, {
            width: '450px',
            height: 'auto',
            data: modalInput
        });

        dialogRef.afterClosed().subscribe(data => {
            // if (data) {
            //     const payload = {
            //         'caption': data.name,
            //         'description': data.description,
            //         'listCode': this.category.listCode
            //     };
            //     this.restService.addListItem(payload)
            //         .subscribe(data1 => {
            //             this.snackbar.openSnackBar('New item created', 'Success');
            //             this.fetchListData();
            //         }, error => {
            //             this.snackbar.openSnackBar('Error adding new item', 'Error');
            //         });
            // }
            this.fetchListData();
        });
    }

    download(typeId: number) {
        if (this.roleValue === 'EXTERNAL') {
            typeId = 9;
        } else if (this.roleValue === 'INTERNAL') {
            typeId = 10;
        }
        let data: any,
            fileName = '';
        const d = new Date(),
            todayDate = [d.getDate(), d.getMonth(), d.getFullYear()].join('-');

        switch (typeId) {
            case 1:
                // data = this.communicationTypes.map((i) => {
                //   return {
                //     'code': i.communicationTypeCode,
                //     'name': i.communicationTypeName
                //   }
                // });
                // fileName = `commTypes-${todayDate}`;
                break;
            case 2:
                // data = this.sectors.map((i) => {
                //   return {
                //     'code': i.code,
                //     'name': i.name
                //   }
                // });
                // fileName = `sectors-${todayDate}`;
                break;
            case 3:
                // data = this.orgTypes.map((i) => {
                //   return {
                //     'code': i.organizationTypeCode,
                //     'name': i.organizationTypeName
                //   }
                // });
                // fileName = `orgTypes-${todayDate}`;
                break;
            case 4:
                // data = this.designations.map((i) => {
                //   return {
                //     'code': i.designationCode,
                //     'name': i.designationName
                //   }
                // });
                // fileName = `designations-${todayDate}`;
                break;
            case 5:
                // data = this.deliveryMethods.map((i) => {
                //   return {
                //     'code': i.deliveryMethodCode,
                //     'name': i.deliveryMethodName
                //   }
                // });
                // fileName = `deliveryMethods-${todayDate}`;
                break;
            case 6:
                data = this.formatTypes.map((i) => {
                    return {
                        'code': i.formatTypeCode,
                        'name': i.formatTypeName
                    };
                });
                fileName = `formatTypes-${todayDate}`;
                break;
            case 7:
                data = this.provinces.map((i) => {
                    return {
                        'code': i.code,
                        'name': i.name
                    };
                });
                fileName = `provinces-${todayDate}`;
                break;
            case 8:
                // data = this.sections.map((i) => {
                //   return {
                //     'code': i.code,
                //     'name': i.name
                //   }
                // });
                // fileName = `sections-${todayDate}`;
                break;
            case 9:
                data = this.externalRoles.map((i) => {
                    return {
                        'code': i.rolecode,
                        'name': i.rolename
                    };
                });
                fileName = `externalRoleTypes-${todayDate}`;
                break;
            case 10:
                data = this.internalRoles.map((i) => {
                    return {
                        'code': i.rolecode,
                        'name': i.rolename
                    };
                });
                fileName = `internalRoleTypes-${todayDate}`;
                break;
        }
        const options = {
            fieldSeparator: ',',
            filename: fileName,
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: false,
            title: '',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true
        };
        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(data);
    }

    changeMenu(menu) {
        const els = document.querySelectorAll('.listitem');
        for (let i = 0; i < els.length; i++) {
            els[i].classList.remove('active');
        }
        document.getElementById(menu).classList.add('active');
        this.menuItem = menu;
    }

    addRole() {
        const dialogRef = this.dialog.open(AddrolesComponent, {
            width: '550px',
            height: '85%',
            data: {value: null, role: this.roleValue}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.loadInitials();
        });
    }

    editRole(obj) {
        const dialogRef = this.dialog.open(AddrolesComponent, {
            width: '550px',
            height: '85%',
            data: {value: obj, role: this.roleValue}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.loadInitials();
        });
    }

    changeRoleTable() {
        if (this.roleValue === 'INTERNAL') {
            this.roles = this.internalRoles;
        } else if (this.roleValue === 'EXTERNAL') {
            this.roles = this.externalRoles;
        }
    }

    updateRole(event, val) {
        const obj = event;
        obj.isActive = val;
        this.restService.addRole(obj)
        .subscribe((res) => {
            this.loadInitials();
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
        });
    }

    openDefaultList(): void {
        if (this.category !== undefined) {
            const dialogRef =   this.dialog.open(DefaultListDialogComponent, {
                width: 'auto',
                height: 'auto',
                data: {data: this.dataSource, header: this.category}
            });
            dialogRef.afterClosed().subscribe(async (resultCode) => {
                if (resultCode !== undefined) {
                    this.dataSource = resultCode;
                }
            });
        }
    }

    editOtherList(obj) {
        const modalInput = {
            caption: obj.caption,
            description: obj.description,
            isActive: obj.isActive,
            isDefault: obj.isDefault,
            itemCode: obj.itemCode,
            itemId: obj.itemId,
            listCode: obj.listCode
        };

        const dialogRef = this.dialog.open(UpdateCategoryComponent, {
            width: '450px',
            height: 'auto',
            data: {data: modalInput, header: this.category.caption}
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data !== 1) {
                this.fetchListData();
            }
        });
    }
}
