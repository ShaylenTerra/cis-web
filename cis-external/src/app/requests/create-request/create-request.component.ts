import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {SnackbarService} from '../../services/snackbar.service';
import {RequestDialogComponent} from '../request-dialog/request-dialog.component';

@Component({
    selector: 'app-create-request',
    templateUrl: './create-request.component.html',
    styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {
    requestsColumns: string[] = ['select', 'pageNumber', 'adminDep', 'farmNumber', 'farmName', 'lpiCode', 'sgNumber', 'details'];
    requestsData;
    dataLength: number;
    dataSource: any;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private snackbar: SnackbarService,
                private router: Router,
                public dialog: MatDialog) {
        this.requestsData = [
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
            {
                pageNumber: '01',
                adminDep: 'JR',
                farmNumber: 608,
                farmName: 'MAMELODI',
                lpiCode: 'TOJR000608000',
                sgNumber: 'A3974/1986'
            },
        ];
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.requestsData);
        this.dataSource.paginator = this.paginator;
        this.dataLength = this.dataSource.data.length || 0;
    }

    onSubmit() {
        this.snackbar.openSnackBar('Request Created', 'Success');
        this.router.navigate(['/home']);
    }

    openDetails() {
        const dialogRef = this.dialog.open(RequestDialogComponent, {
            width: '1500px'
        });
    }
}
