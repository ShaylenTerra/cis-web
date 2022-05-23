import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-reservation-config-dialog',
  templateUrl: './reservation-config-dialog.component.html',
  styleUrls: ['./reservation-config-dialog.component.css']
})
export class ReservationConfigDialogComponent implements OnInit {

  sysForm: FormGroup;
  state: any;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<ReservationConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder) {
      dialogRef.disableClose = true;
      this.state = this.data.value === null ? 'Add' : 'Edit';
      this.sysForm = this.formBuilder.group({
        'caption': [''],
        'data1': [''],
        'description': ['']
      });
     }

  ngOnInit(): void {
    if (this.data.value != null) {
      this.sysForm.patchValue({
        caption: this.data.value.caption,
        data1: this.data.value.data1,
        description: this.data.value.description,
      });
    }
  }

  saveReservationConfiguration() {
    if (this.sysForm.invalid) {
      this.sysForm.get('caption').markAsTouched();
      this.sysForm.get('data1').markAsTouched();
      this.sysForm.get('description').markAsTouched();
      return;
    } else {
      const arr = [];
      const obj = this.data.value;
      obj.caption = this.sysForm.value.caption;
      obj.data1 = this.sysForm.value.data1;
      obj.description = this.sysForm.value.description;
      arr.push(obj);
      this.loaderService.display(true);
      this.restService.saveListItemDataColl(arr).subscribe(() => {
        this.snackbar.openSnackBar(this.data.msg + ' ' + 'configuration updated Successfully', 'Success');
        this.loaderService.display(false);
        this.dialogRef.close();
      }, () => {
        this.loaderService.display(false);
      });
    }

  }

}
