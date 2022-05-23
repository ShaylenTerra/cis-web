import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {StorageConstants} from '../../constants/storage-keys';
import {RestcallService} from '../../services/restcall.service';
import {QueryDialogComponent} from '../query-dialog/query-dialog.component';
import * as enums from './../../constants/enums';
import {ExportToCsv} from 'export-to-csv';
import {SnackbarService} from '../../services/snackbar.service';
import {PostqueryDialogComponent} from '../postquery-dialog/postquery-dialog.component';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-my-queries',
    templateUrl: './my-queries.component.html',
    styleUrls: ['./my-queries.component.css']
})
export class MyQueriesComponent implements OnInit {
    // isSpinnerVisible = false;
    form: FormGroup;
    queryform: FormGroup;
    displayedColumns: string[] = ['type', 'issueStatus', 'createdDate', 'action'];
    issueTypes: any[] = [];
    selectedIssueType = '';
    showField = false;
    customIssueType = '';
    description = '';
    page: number;
    last = false;
    dataSource: any;
    dataLength: number;
    queriesData: any;
    jsondata: any = {
        'IssueType': '',
        'description': '',
        'name': JSON.parse(sessionStorage.getItem('userInfo')).firstName + ' ' + JSON.parse(sessionStorage.getItem('userInfo')).surname,
        'email': JSON.parse(sessionStorage.getItem('userInfo')).email
    };
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    requestorData: any;

    constructor(private snackbar: SnackbarService, public dialog: MatDialog,
                private restService: RestcallService, private fb: FormBuilder,
                private loaderService: LoaderService) {
        this.queryform = this.fb.group({
            processid: 11,
            provinceid: -1,
            loggeduserid: this.userId,
            notes: '',
            context: 'test',
            type: 1,
            processdata: {},
            parentworkflowid: 0,
            assignedtouserid: 0
        });
    }

    ngOnInit() {
        this.page = 1;
        this.bindQueryType();
        this.form = this.fb.group({
            selectedIssueType: [null, (Validators.required)],
            customIssueType: [null],
            description: [null],

        });
    }

    bindQueryType() {
        this.restService.getListItems(9).subscribe(response => {
            this.issueTypes = response.data;
        });
    }

    download() {
        const data: any = this.queriesData,
            d = new Date(),
            todayDate = [d.getDate(), d.getMonth(), d.getFullYear()].join('-'),
            fileName = `queries-${todayDate}`;
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

    createQuery() {
        this.loaderService.display(true);
        const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
        const desc = this.selectedIssueType !== 'OTHER' ? this.description : `${this.customIssueType} - ${this.description}`;
        const payload = {
            userId: uid,
            issueTypeItemId: enums.issueType[this.selectedIssueType],
            description: desc
        };
        this.restService.createQuery(payload).subscribe(response => {
            if (response.payload.data.created === true) {
                this.snackbar.openSnackBar('New query created', 'Success');
                this.description = '';
                this.selectedIssueType = '';
                this.customIssueType = '';
                this.showField = false;
                this.loaderService.display(false);
                this.getMyQueries();
            }
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error creating query', 'Error');
        });
    }

    getMyQueries() {
        this.loaderService.display(true);
        const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
        const payload = {
            userId: uid,
            perPage: '10',
            page: String(this.page)
        };
        this.restService.getQueries(payload.page, payload.perPage, payload.userId).subscribe(response => {
            if (response.error === 'No Error') {
                this.queriesData = response.payload.data;
                this.queriesData = this.queriesData.map((query) => {
                    return {
                        'issueType': enums.issueType[query.issueTypeItemId],
                        'description': query.description,
                        'createdDate': query.createdDate,
                        'issueStatus': query.issueStatus,
                    };
                });
                this.dataSource = new MatTableDataSource(this.queriesData);
                this.dataSource.paginator = this.paginator;
                this.dataLength = this.dataSource.data.length || 0;
            }
            if (response.error === 'Error' && response.message === 'No queries found.') {
                this.page--;
                this.last = true;
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            if (error.message === 'No queries found.') {
                this.page--;
                this.last = true;
            }
        });
    }

    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.getMyQueries();
        }
        if (this.last) {
            this.last = false;
        }
    }

    nextPage() {
        this.page++;
        this.getMyQueries();
    }

    issueTypeChange() {
        this.showField = false;
        if (this.selectedIssueType === 'OTHER') {
            this.showField = true;
        }
    }

    openDialog(element): void {
        const dialogRef = this.dialog.open(QueryDialogComponent, {
            width: '650px',
            data: {
                desc: element.description
            }
        });
    }

    postQuery() {
        this.loaderService.display(true);
        const data = this.form.value;
        this.jsondata.IssueType = this.issueTypes.filter(x => x.itemId === this.form.value.selectedIssueType)[0].caption;
        this.jsondata.description = this.form.value.description;
        const obj = this.queryform.value;
        obj.notes = data.description;
        this.setRequestorData();
        obj.processdata = JSON.stringify(this.requestorData);
        this.restService.triggertask(obj).subscribe(res => {
            this.querydialog(res);
            this.loaderService.display(false);
        });
    }

    querydialog(data): void {
        const dialogRef = this.dialog.open(PostqueryDialogComponent, {
            width: '546px',
            data: {value: data}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.form.reset();
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setRequestorData() {
        const loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
        this.requestorData = {
            'requesterInformation': {
            'userId': this.userId,
            'requestLoggedBy': {
                'firstName': loggedUserData.firstName,
                'surName': loggedUserData.surname,
                'contactNo': loggedUserData.mobileNo,
                'email': loggedUserData.email,
                'fax': '',
                'addressLine1': loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': loggedUserData.userProfile.postalAddressLine3,
                'postalCode': loggedUserData.userProfile.postalCode
            },
            'requesterDetails': {
              'firstName': loggedUserData.firstName,
              'surName': loggedUserData.surname,
              'contactNo': loggedUserData.mobileNo,
              'email': loggedUserData.email,
              'fax': '',
              'addressLine1': loggedUserData.userProfile.postalAddressLine1,
              'addressLine2': loggedUserData.userProfile.postalAddressLine2,
              'addressLine3': loggedUserData.userProfile.postalAddressLine3,
              'postalCode': loggedUserData.userProfile.postalCode
            }
            },
            'notifyManagerData': null,
              'queryData': {
                'issueType': this.jsondata.IssueType,
                'description': this.form.value.description,
                'firstName': JSON.parse(sessionStorage.getItem('userInfo')).firstName,
                'surName': JSON.parse(sessionStorage.getItem('userInfo')).surname,
                'email': JSON.parse(sessionStorage.getItem('userInfo')).email
              }
        };
      }
}
