import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {LoaderService} from '../../../services/loader.service';
import { SnackbarService } from '../../../services/snackbar.service';
@Component({
  selector: 'app-default-list-dialog',
  templateUrl: './default-list-dialog.component.html',
  styleUrls: ['./default-list-dialog.component.css']
})
export class DefaultListDialogComponent implements OnInit {
  defaultVal;
  dataSource1;
  constructor(public dialogRef: MatDialogRef<DefaultListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private restService: RestcallService, private loaderService: LoaderService,
              private snackbar: SnackbarService) {
  }

  ngOnInit() {
    this.dataSource1 = this.data.data;
    this.dataSource1.push({'caption': 'None of the above',
    'description': 'None of the above',
    'isActive': 1,
    'isDefault': null,
    'itemCode': '',
    'itemId': 0,
    'listCode': this.dataSource1[0].listCode});
    this.defaultVal = this.dataSource1.filter(x => x.isDefault === 1)[0]?.itemId;
  }

  close() {
    this.dataSource1 = this.dataSource1.filter(x => x.itemId !== 0);
    this.dialogRef.close(this.dataSource1);
  }

  submit() {
    this.loaderService.display(true);
    this.restService.updateListItemIsDefault(this.defaultVal, this.dataSource1[0].listCode, 1).subscribe((res: any) => {
        this.loaderService.display(false);
        this.snackbar.openSnackBar('Default value set for ' + this.data.header.caption, 'Success');
        this.dialogRef.close(res.data);
    }, () => {
        this.loaderService.display(false);
        this.snackbar.openSnackBar('Error in updating', 'Error');
        this.dataSource1 = this.dataSource1.filter(x => x.itemId !== 0);
        this.dialogRef.close(this.dataSource1);
    });
  }

}
