import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {DataRequestDialogComponent} from './data-request-dialog/data-request-dialog.component';
import {MyRequestDialogComponent} from './my-request-dialog/my-request-dialog.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ConfirmQueryRequestComponent } from './confirm-queryrequest/confirm-queryrequest.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-data-viewer',
    templateUrl: './data-viewer.component.html',
    styleUrls: ['./data-viewer.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DataViewerComponent implements OnInit {
    requestsColumns: any[] = [];
    columnDefs: any[] = [];
    displayedColumns: any;
    requestsData: any = [];
    requestsDataSource: any = [];
    showCols = true;
    showQuery = true;
    showResults = false;
    viewsDetail: Array<ViewDetail> = [];
    colsDetail: Array<ColumnDetail> = [];
    isRadioChecked = true;
    query: string;
    filteredProvince;
    assignProvince;
    provincepdata;
    filteredObjectType;
    objectNames;
    selectedObject;
    selectedType;
    flowDataLength: number;
    totalRecords: any;
    headerstatus: any = 'name';
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    errMsg: any;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private router: Router, private dialog: MatDialog, private restService: RestcallService,
        private loaderService: LoaderService, private fb: FormBuilder) {
        this.viewsDetail = [
            {id: 1, name: 'User', isChecked: false},
            {id: 2, name: 'Provinces', isChecked: false},
            {id: 3, name: 'Internal Roles', isChecked: false},
            {id: 4, name: 'External Roles', isChecked: false},
            {id: 5, name: 'Requests', isChecked: false},
            {id: 6, name: 'Farm', isChecked: true},
            {id: 7, name: 'Lists', isChecked: false}
        ];
    }

    navigate() {
        this.router.navigate(['/general/data-viewer2']);
    }

    ngOnInit() {
        // this.getAllProvince();
        this.getDataViewerObjectType();
    }

    dataRequest(): void {
        const data = {
            type: this.selectedType,
            obj: this.selectedObject.objectName,
            query: this.query
        };
        const dialogRef = this.dialog.open(DataRequestDialogComponent, {
            width: '600px',
            autoFocus: false,
            data: {value: data},
        });
        dialogRef.afterClosed().subscribe(resultCode => {
            if (resultCode !== undefined) {
                this.decisionDialog(resultCode);
            }
        });
    }

    myRequest() {
        const dialogRef = this.dialog.open(MyRequestDialogComponent, {
            width: '100%',
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(resultCode => {
            if (resultCode.objectName.includes('VW_')) {
                this.selectedType = 'VIEW';
            } else {
                this.selectedType = 'TABLE';
            }
            this.loaderService.display(true);
            this.restService.getDataViewerObjectName(this.selectedType).subscribe(response => {
                this.objectNames = response.data;
                this.selectedObject = this.objectNames.filter(x => x.objectName === resultCode.objectName)[0];
                this.getColumns(this.selectedObject.objectName);
                this.query = resultCode.query;
                this.loaderService.display(false);
            }, () => {
                this.loaderService.display(false);
            });
        });
    }

    getAllProvince() {
        this.loaderService.display(true);
        this.assignProvince = '';
        this.restService.getProvinces().subscribe(response => {
            this.provincepdata = response.data.filter(x => x.provinceId !== -1);
            this.filteredProvince = response.data.filter(x => x.provinceId !== -1);
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    getDataViewerObjectType() {
        this.loaderService.display(true);
        this.restService.getDataViewerObjectType().subscribe(response => {
            this.filteredObjectType = response.data;
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    onObjectTypeChange(selectedVal) {
        this.getObjectName(selectedVal);
        this.selectedType = selectedVal;
    }

    getObjectName(selectedVal) {
        this.loaderService.display(true);
        this.restService.getDataViewerObjectName(selectedVal).subscribe(response => {
            this.objectNames = response.data;
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    onObjectChangeGetColumns(selectedVal) {
        this.selectedObject = selectedVal;
        this.getColumns(selectedVal.objectName);
    }

    getColumns(selectedVal) {
        this.loaderService.display(true);
        this.restService.getDataViewerColumns(selectedVal).subscribe(response => {
            this.colsDetail = [];
            let cols = '';
            this.colsDetail.push({id: 0, name: 'ALL', isSelected: true});
            for (let i = 0; i < response.data.length; i++) {
                this.colsDetail.push({id: this.colsDetail.length, name: response.data[i], isSelected: true});
                cols = cols + response.data[i] +  (response.data.length - 1 !== i ? ', ' : '');
            }
            this.query = 'SELECT ' + cols + ' FROM ' + selectedVal + ' WHERE rownum < 500';
            this.loaderService.display(false);
        }, () => {
            this.loaderService.display(false);
        });
    }

    viewSelection() {
        this.showCols = true;
    }

    clear() {
        this.showCols = false;
        this.showResults = false;
        this.viewsDetail.forEach((item) => {
            item.isChecked = false;
        });
        // this.showQuery = false;
        this.query = '';
        this.colsDetail.forEach((item) => {
            item.isSelected = false;
        });
    }

    radioCheck(element: ViewDetail) {
        element.isChecked = true;
    }

    updateSelection(element: ColumnDetail) {
       const objIndex = this.colsDetail.findIndex((obj => obj.id === element.id));
       this.colsDetail[objIndex].isSelected = element.isSelected;
        this.showQuery = true;
        if (element.name === 'ALL' && element.isSelected) {
            this.colsDetail.forEach((item) => {
                item.isSelected = true;
            });
        } else if (element.name === 'ALL' && !element.isSelected) {
            this.colsDetail.forEach((item) => {
                item.isSelected = false;
            });
        } else {
            const objAllIndex = this.colsDetail.findIndex((obj => obj.name === 'ALL'));
            this.colsDetail[objAllIndex].isSelected = false;
        }
        let cols = '';
        const selectedCols = this.colsDetail.filter(x => x.isSelected === true && x.name !== 'ALL');
        for (let i = 0; i < selectedCols.length; i++) {
            cols = cols + selectedCols[i].name +  (selectedCols.length - 1 !== i ? ', ' : '');
        }
        this.query = 'SELECT ' + cols + ' FROM ' + this.selectedObject.objectName + ' WHERE rownum < 500';
    }

    execute() {
        this.requestsColumns = [];
        this.columnDefs = [];
        const cols = this.colsDetail.filter(x => x.isSelected === true && x.name !== 'ALL');
        cols.forEach(element => {
            this.requestsColumns.push({columnDef: element.name,
                cell: (ele: any) => `${ele[element.name] ? ele[element.name] : ``}`,
                header: element.name});
        });
        for (let i = 0; i < this.requestsColumns.length; i++) {
            const obj = {field: '', sortable: true, filter: true};
                obj.field = this.requestsColumns[i].columnDef;
                this.columnDefs.push(obj);
        }
        this.displayedColumns = this.requestsColumns.map(c => c.columnDef);
        this.loaderService.display(true);
        const data = {
            'objectName': this.selectedObject.objectName,
            'query': this.query,
            'userId': this.userId
          };

        this.restService.getDataViewerExecuteCustomQuery(data).subscribe(response => {
            this.loaderService.display(false);
            if (response.code === 50000) {
                this.showResults = null;
                this.errMsg = response.data;
            } else {
                this.showResults = true;
                this.totalRecords = response.data.totalCount;
                this.requestsDataSource = response.data.data;
                this.refreshTable();
            }

        }, () => {
            this.loaderService.display(false);
        });
    }

    convertToArrayOfObjects(data) {
        const keys = data.shift(), output = [];
        let i = 0, k = 0, obj = null;
        for (i = 0; i < data.length; i++) {
            obj = {};
            for (k = 0; k < keys.length; k++) {
                obj[keys[k]] = data[i][k];
            }
            output.push(obj);
        }
        return output;
    }

    refreshTable() {
        this.requestsData = new MatTableDataSource(this.requestsDataSource);
        this.requestsData.paginator = this.paginator;
        this.flowDataLength = this.requestsData.data.length || 0;
        this.requestsData.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        this.requestsData.filter = filterValue.trim().toLowerCase();
      }

      onchangestatus(column) {
          this.headerstatus = column.header;
      }

      exportAsXLSX() {
        this.exportAsExcelFile(this.requestsDataSource, this.selectedObject.objectName);
      }

      exportAsExcelFile(json: any[], excelFileName: string) {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
      }

      saveAsExcelFile(buffer: any, fileName: string) {
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }

      decisionDialog(data): void {
        const dialogRef = this.dialog.open(ConfirmQueryRequestComponent, {
            width: '546px',
            data: {value: data}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }
}



export interface ViewDetail {
    id: number;
    name: string;
    isChecked: boolean;
}

export interface ColumnDetail {
    id: number;
    name: string;
    isSelected: boolean;
}
