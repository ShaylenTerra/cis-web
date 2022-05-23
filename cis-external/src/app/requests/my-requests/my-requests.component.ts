import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';

@Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.component.html',
    styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
    requestsColumns: string[] = ['referenceCode', 'context', 'summary', 'status', 'pendingSince', 'lastStatusUpdatedOn'];
    requestsData;
    dataLength: number;
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private router: Router) {
    this.requestsData = [
      {
        referenceCode: 'INFO1983', context: 'Information Request', summary: 'Gauteng Alpha data Request', status: 'In Progress',
        pendingSince: '1 month', lastStatusUpdatedOn: '	16-oct-2020'
      },
      {
        referenceCode: 'INFO1982', context: 'Information Request', summary: 'Gauteng Alpha data Request', status: 'In Progress',
        pendingSince: '20 Days', lastStatusUpdatedOn: '	14-oct-2020'
      },
      {
        referenceCode: 'INFO1981', context: 'Information Request', summary: 'Free State Lamination certificate', status: 'Dispatched',
        pendingSince: '10 Days', lastStatusUpdatedOn: '	12-oct-2020'
      },
      {
        referenceCode: 'INFO1980', context: 'Information Request', summary: 'Gauteng Spatial Data', status: 'In Progress',
        pendingSince: '2 Days', lastStatusUpdatedOn: '	11-oct-2020'
      },
      {
        referenceCode: 'INFO1983', context: 'Information Request', summary: 'Gauteng Alpha data Request', status: 'In Progress',
        pendingSince: '1 month', lastStatusUpdatedOn: '	16-oct-2020'
      },
      {
        referenceCode: 'INFO1982', context: 'Information Request', summary: 'Gauteng Alpha data Request', status: 'In Progress',
        pendingSince: '20 Days', lastStatusUpdatedOn: '	14-oct-2020'
      },
      {
        referenceCode: 'INFO1981', context: 'Information Request', summary: 'Free State Lamination certificate', status: 'Dispatched',
        pendingSince: '10 Days', lastStatusUpdatedOn: '	12-oct-2020'
      },
      {
        referenceCode: 'INFO1980', context: 'Information Request', summary: 'Gauteng Spatial Data', status: 'In Progress',
        pendingSince: '2 Days', lastStatusUpdatedOn: '	11-oct-2020'
      }
    ];
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.requestsData);
    this.dataSource.paginator = this.paginator;
    this.dataLength = this.dataSource.data.length || 0;
  }

  onRowClick(input) {
    this.router.navigate(['/requests/detail']);
  }
}
