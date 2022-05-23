import { Component, Inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {map} from 'rxjs/operators';
import {IProvince} from '../../../interface/province.interface';
import {LoaderService} from '../../../services/loader.service';


@Component({
  selector: 'app-data-request-dialog',
  templateUrl: './data-request-dialog.component.html',
  styleUrls: ['./data-request-dialog.component.css']
})
export class DataRequestDialogComponent implements OnInit {

  provinces: IProvince[];
  isSpinnerVisible = false;
  assignedFilteredProvinces;
  assignProvince;
  form: FormGroup;
  requestType = 'FTP';
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  list: any[] = [
    {'name': 'FTP', 'checked': true},
    {'name': 'EMAIL', 'checked': false}
  ];

  constructor(public dialogRef: MatDialogRef<DataRequestDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
              private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService) {

      this.form = this.fb.group({
          province: ['', Validators.required]
      });
  }

  get getAssignProvince() {
      return this.form.get('province');
  }

  ngOnInit() {
      this.initialise();
  }

  initialise() {
      this.assignProvince = '';
      this.loaderService.display(true);
      this.restService.getProvinces().subscribe(response => {
          this.provinces = response.data;
          this.assignedFilteredProvinces = response.data;
          // this.isSpinnerVisible = false;
          this.loaderService.display(false);
      }, error => {
          this.loaderService.display(false);
          this.snackbar.openSnackBar('Error retrieving data', 'Error');
      });


      this.getAssignProvince.valueChanges
          .pipe(
              map(value => typeof value === 'string' ? value : (value.provinceName)),
              map(name => name ? this.filterProvince(name) : this.provinces.slice())
          ).subscribe(response => {
          this.assignedFilteredProvinces = response;
      });
  }

  filterProvince(value: string) {
      const filterValue = value.toLowerCase();
      return this.provinces.filter(province => (province.provinceName).toLowerCase().includes(filterValue));
  }

  assignedProvinceSelected(event) {
      this.assignProvince = event.option.value;
      this.form.patchValue({
          provinceShortName: this.assignProvince.provinceShortName,
          toBeChangedProvinceId: this.assignProvince.provinceId,
      });
  }

  displayFn(province) {
      return province ? (province.provinceName) : '';
  }

  submit() {
      this.loaderService.display(true);
      const data = {
        'isEmail': this.requestType === 'EMAIL' ? 1 : 0,
        'isFtp': this.requestType === 'FTP' ? 1 : 0,
        'objectName': this.data.value.obj,
        'query': this.data.value.query,
        'userid': this.userId
        };
        this.restService.logDataViewerQuery(data).subscribe(response => {
            this.loaderService.display(false);
            this.dialogRef.close(response);
        }, () => {
            this.loaderService.display(false);
        });
  }

  close() {
      this.dialogRef.close(undefined);
  }

  onProcessChange(event) {
      this.requestType = event.value.name;
  }
}
