import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as constants from './../../constants/storage-keys';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css']
})
export class ConfirmPasswordComponent implements OnInit {

  isSpinnerVisible = false;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

  constructor(
      public dialogRef: MatDialogRef<ConfirmPasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService,
      private snackbar: SnackbarService,
      private fb: FormBuilder,
      private loaderService: LoaderService,
      private router: Router
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  async submit() {
    await this.logoutUser();
    sessionStorage.clear();
    this.router.navigate(['/authentication/login']);
    this.dialogRef.close();
  }

  async logoutUser() {
    this.loaderService.display(true);
    const usercode = sessionStorage.getItem(constants.StorageConstants.USERCODE);
    const input = {
      usercode: usercode
    };
    this.restService.logoutUser(input).subscribe(data => {
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }
}
