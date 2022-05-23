import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
  selector: 'app-sys-config-dialog',
  templateUrl: './sys-config-dialog.component.html',
  styleUrls: ['./sys-config-dialog.component.css']
})
export class SysConfigDialogComponent implements OnInit {
  sysForm: FormGroup;
  state: any;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<SysConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder) {
      dialogRef.disableClose = true;
      this.state = this.data === null ? 'Add' : 'Edit';
      this.sysForm = this.formBuilder.group({
        'id': 0,
        'caption': [''],
        'tag': [''],
        'tagValue': [''],
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
      });
     }

  ngOnInit(): void {
    if (this.data != null) {
      this.sysForm.patchValue({
        id: this.data.id,
        caption: this.data.caption,
        tag: this.data.tag,
        tagValue: this.data.tagValue,
        userId: this.data.userId
      });
    }
  }

  saveSystemConfiguration() {
    this.loaderService.display(true);
    this.restService.saveSystemConfiguration(this.sysForm.value).subscribe(() => {
      this.snackbar.openSnackBar(`System configuration ${this.state}ed Successfully`, 'Success');
      this.loaderService.display(false);
      this.dialogRef.close();
    }, () => {
      this.loaderService.display(false);
    });
  }
}
