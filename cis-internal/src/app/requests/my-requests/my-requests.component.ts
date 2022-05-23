import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.component.html',
    styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
    requestsColumns: string[] = ['reference', 'context', 'summary', 'status', 'pendingSince', 'lastStatusUpdatedOn'];
    requestsData;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.requestsData = [
            {
                referenceCode: 'INFO1983',
                context: 'Information Request',
                summary: 'Gauteng Alpha data Request',
                status: 'In Progress',
                pendingSince: '1 month',
                lastStatusUpdated: '16-oct-2020'
            },
            {
                referenceCode: 'INFO1982',
                context: 'Information Request',
                summary: 'Gauteng Alpha data Request',
                status: 'In Progress',
                pendingSince: '20 Days',
                lastStatusUpdated: '14-oct-2020'
            },
            {
                referenceCode: 'INFO1981',
                context: 'Information Request',
                summary: 'Free State Lamination certificate',
                status: 'Dispatched',
                pendingSince: '10 Days',
                lastStatusUpdated: '12-oct-2020'
            },
            {
                referenceCode: 'INFO1980',
                context: 'Information Request',
                summary: 'Gauteng Spatial Data',
                status: 'In Progress',
                pendingSince: '2 Days',
                lastStatusUpdated: '11-oct-2020'
            }
        ];
    }

    navigate() {
        this.router.navigate(['/task-profile']);
    }

}
