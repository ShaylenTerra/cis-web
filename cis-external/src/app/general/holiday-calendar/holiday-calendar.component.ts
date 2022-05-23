import {Component, OnInit} from '@angular/core';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.css']
})
export class HolidayCalendarComponent implements OnInit {
  isSpinnerVisible = false;
  cols: Array<string> = ['sno', 'day', 'occasion'];
  data: [] = [];
  years: Array<number> = [];
  selectedYear: number = new Date().getFullYear();

  constructor(private snackbar: SnackbarService, private restService: RestcallService) { }

  ngOnInit() {
    this.fillYears();
    this.getHolidays(this.selectedYear);
  }

  async getHolidays(year: number) {
    this.isSpinnerVisible = true;
    this.restService.getHolidays(year).subscribe(data => {
      this.data = data.data || [];
      this.snackbar.openSnackBar(`${year} holidays retrieved Successfully`, 'Success');
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

  fillYears() {
    const start = new Date().getFullYear() - 1, end = new Date().getFullYear() + 1;
    for (let i = start; i <= end; i++) {
      this.years.push(i);
    }
  }

  yearSelection(year: number) {
    this.getHolidays(year);
  }
}
