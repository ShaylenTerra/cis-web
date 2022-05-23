import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {RestcallService} from '../../services/restcall.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionViewdialogComponent } from '../subscriptionviewdialog/subscriptionviewdialog.component';

@Component({
    selector: 'app-my-subscriptions',
    templateUrl: './my-subscriptions.component.html',
    styleUrls: ['./my-subscriptions.component.css']
})
export class MySubscriptionsComponent implements OnInit {
    columns = ['referenceNo', 'type', 'subscriptionDate', 'location', 'locationName', 'subscriptionName', 'frequency', 'subscriptionStatus', 'View'];
    data;
    dataSource;
    dataLength;
    location;
    filteredLocation: any;
    listitems: any[] = [];
    prePackageDataType: any;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private restService: RestcallService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.getAllSubscriptionByUser();
        this.listItemsByListCode();
        this.listItemsByListCodes();
    }

    listItemsByListCode() {
        this.restService.listItemsByListCode(30).subscribe((res: any) => {
            this.filteredLocation = res.data;
        });
    }

    listItemsByListCodes() {
        this.restService.listItemsByListCode(29).subscribe((res: any) => {
            this.listitems = res.data;
        });
    }

    getAllSubscriptionByUser() {
        this.restService.getAllSubscriptionByUser(JSON.parse(sessionStorage.getItem('userInfo')).userId)
            .subscribe(response => {
                this.data = response.data;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i].subscriptionStatus = this.data[i].subscriptionStatus === '1' ? true : false;
                }
                this.dataSource = new MatTableDataSource(this.data);
                this.dataSource.paginator = this.paginator;
                this.dataLength = this.dataSource.data.length || 0;
            });
    }

    updateSubscription(element: any, subsciptionStatus: any) {
        const status = element.subscriptionStatus === false ? 0 : 1;
        this.restService.updateSubscriptionStatus(element.subscriptionId, status,
            JSON.parse(sessionStorage.getItem('userInfo')).userId)
            .subscribe(response => {
                this.getAllSubscriptionByUser();
            });
    }

    displayLocation(locationdata) {
        return locationdata ? (locationdata.caption) : '';
    }
    openDialog(row): void {
        const dialogRef = this.dialog.open(SubscriptionViewdialogComponent, {
            width: '100%',
            data: row
        });
        dialogRef.afterClosed().subscribe(async () => {
        });
    }

}
