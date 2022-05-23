import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-query',
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class QueryComponent implements OnInit {
    displayedColumns: string[] = ['issueType', 'issueStatus', 'createdDate', 'action'];
    queriesData: any;
    issueTypes: Array<string> = ['Registration', 'User Account', 'Guide To Website',
        'Digital Tour', 'Benifits of Reigstration', 'Other'];
    selectedIssueType = '';
    showField = false;
    dataLength: number;
    dataSource: any;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private snackbar: SnackbarService) {
        this.queriesData = [
            {issueType: 'Registration', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
            {issueType: 'Website Tour', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
            {issueType: 'Placing Request', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
            {issueType: 'Pls User', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
            {issueType: 'Email Change', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
            {issueType: 'MobileNumber Change', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
            {issueType: 'Registration', issueStatus: 'OPEN', createdDate: '19/08/2020 09:25:04'},
        ];
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.queriesData);
        this.dataSource.paginator = this.paginator;
        this.dataLength = this.dataSource.data.length || 0;
    }

    submit() {
        this.snackbar.openSnackBar('Posted Query Successfully', 'Success');
    }

    issueTypeChange() {
        this.showField = false;
        if (this.selectedIssueType === 'Other') {
            this.showField = true;

        }
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
