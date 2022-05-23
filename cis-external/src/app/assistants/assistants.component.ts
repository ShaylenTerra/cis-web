import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {RestcallService} from '../services/restcall.service';
import * as constants from '../constants/storage-keys';
import {AddAssistantModalDialogComponent} from '../modals/add-assistant/add-assistant-modal.dialog';
import {SnackbarService} from '../services/snackbar.service';
import {DecisionComponent} from './decision/decision.component';


@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.css']
})
export class AssistantsComponent implements OnInit {
    assistantsColumns: string[] = ['USERNAME', 'FIRSTNAME', 'SURNAME', 'detach'];
    assistantsData: any;
    dataSource: any;
    dataLength: any;
    isSpinnerVisible = false;
    parentUserId: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private dialog: MatDialog, private snackbar: SnackbarService
                , private restService: RestcallService) {
        this.assistantsData = [];
        this.parentUserId = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO)).userId || '';
    }

    ngOnInit() {
        this.getAllAssistants();
    }

    getAllAssistants() {
        this.isSpinnerVisible = true;
        this.restService.getAllPlsAssistants(this.parentUserId).subscribe(data => {
                this.assistantsData = data.data;
                console.log(this.assistantsData);
                this.dataSource = new MatTableDataSource(this.assistantsData);
                this.dataSource.sort = this.sort;
                this.dataLength = this.assistantsData.length || 0;
                this.dataSource.paginator = this.paginator;
                setTimeout(() => this.dataSource.paginator = this.paginator, 1000);
                this.isSpinnerVisible = false;
            },
            error => {
                this.isSpinnerVisible = false;
                if (error.message === 'No assistants found.') {
                    this.snackbar.openSnackBar('No assistants found.', 'Message');
                } else {
                    this.snackbar.openSnackBar('Unknown error while retrieving information.', 'Error');
                }
            });
    }

    addNewAssistant() {
        const dialogRef = this.dialog.open(AddAssistantModalDialogComponent, {
            width: '50%'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.snackbar.openSnackBar('Assistants added.', 'Message');
            this.getAllAssistants();
        });
    }

    openDecisionDialog(assistant) {
        const dialogRef = this.dialog.open(DecisionComponent, {
            width: '50%',
            data: assistant
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getAllAssistants();
        });
    }
}
