import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {AddNewHolidayDialogComponent} from './add-new';

@Component({
    selector: 'app-holiday-calender',
    templateUrl: './holiday-calender.component.html',
    styleUrls: ['./holiday-calender.component.css']
})
export class HolidayCalenderComponent implements OnInit {
    isSpinnerVisible = false;
    cols: Array<string> = ['sno', 'day', 'occasion', 'action'];
    data: [] = [];
    years: Array<number> = [];
    selectedYear: number = new Date().getFullYear();
    showAdd = true;

    constructor(private dialog: MatDialog, private snackbar: SnackbarService,
                private restService: RestcallService) {
    }

    ngOnInit() {
        this.fillYears();
        this.getHolidays(this.selectedYear);
    }


    async getHolidays(year: number) {
        this.isSpinnerVisible = true;
        this.restService.getHolidays(year).subscribe(payload => {
            this.data = payload.data || [];
            this.snackbar.openSnackBar(`${year} holidays retrieved Successfully`, 'Success');
            this.showAdd = year >= new Date().getFullYear() ? true : false;
            this.isSpinnerVisible = false;
        }, error => {
            if (error.message === 'No holidays found.') {
                this.snackbar.openSnackBar('No holidays found for year', 'Success');
                this.data = [];
            } else {
                this.snackbar.openSnackBar(`Error in retrieving ${year} holidays`, 'Error');
            }
            this.isSpinnerVisible = false;
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddNewHolidayDialogComponent, {
            width: '450px',
        });
        dialogRef.afterClosed().subscribe((data) => {
            // if (data !== undefined) {
            //     this.isSpinnerVisible = true;
            //     const payload = {
            //         holidayDate: [data.date.getDate(), data.date.getMonth() + 1, data.date.getFullYear()].join('/'),
            //         description: data.occasion
            //     };
            //     this.restService.addHoliday(payload).subscribe(async () => {
                    this.getHolidays(data.date.getFullYear());
            //         this.snackbar.openSnackBar('Added Holiday Successfully', 'Success');
            //         this.isSpinnerVisible = false;
            //     }, error => {
            //         this.snackbar.openSnackBar(`Error in adding holiday`, 'Error');
            //         this.isSpinnerVisible = false;
            //     });
            // }
        });
    }

    fillYears() {
        const start = new Date().getFullYear() - 1, end = new Date().getFullYear() + 1;
        for (let i = start; i <= end; i++) {
            this.years.push(i);
        }
    }

    yearSelection(year: number) {
        this.getHolidays(year);
    }

    removeItem(item) {
        this.isSpinnerVisible = true;
        this.restService.deleteHoliday(item).subscribe(async () => {
            this.snackbar.openSnackBar('Holiday deleted successfully', 'Success');
            this.getHolidays(this.selectedYear);
            this.isSpinnerVisible = false;
        }, error => {
            this.snackbar.openSnackBar(`Error in adding holiday`, 'Error');
            this.isSpinnerVisible = false;
        });
    }
}
