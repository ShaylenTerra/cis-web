import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-office-timings',
  templateUrl: './office-timings.component.html',
  styleUrls: ['./office-timings.component.css']
})
export class OfficeTimingsComponent implements OnInit {
  isSpinnerVisible = false;
  columns = ['sno', 'start', 'end', 'type', 'occasion'];
  data;
  dataSource;
  dataLength;
  provinces: Array<any> = [];
  province;
  type = 'office';

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(public snackbar: SnackbarService, private restService: RestcallService) {
  }

  ngOnInit() {
    this.initialise();
  }

  initialise() {
    this.restService.getProvinces().subscribe(payload => {
      this.provinces = payload.data;
      this.province = this.provinces && this.provinces[0];
      this.getOfficeTimings();
    }, error => {
      this.snackbar.openSnackBar('Error retrieving data', 'Error');
    });
  }

  getOfficeTimings() {
    if (this.province) {
      if (this.type === 'office') {
        this.restService.getOfficeTimes(this.province.provinceId).subscribe(data => {
          this.data = data.data;
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataLength = this.dataSource.data.length || 0;
          this.dataSource.sort = this.sort;
        }, error => {
          this.snackbar.openSnackBar('Error fetching Office Timings', 'Error');
        });
      } else {
        this.restService.getOfficeHolidays(this.province.provinceId).subscribe(data => {
          this.data = data.data;
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataLength = this.dataSource.data.length || 0;
        }, error => {
          this.snackbar.openSnackBar('Error fetching Office Holidays', 'Error');
        });
      }
    }
  }
}
