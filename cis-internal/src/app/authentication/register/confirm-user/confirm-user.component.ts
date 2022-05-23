import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import * as constants from './../../../constants/localstorage-keys';

@Component({
  selector: 'app-confirm-user',
  templateUrl: './confirm-user.component.html',
  styleUrls: ['./confirm-user.component.css']
})
export class ConfirmUserComponent implements OnInit {

  refNo: any;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmUserComponent>,
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

  close() {
    this.loaderService.display(true);
    const loginPayload = {
      username: this.data.username,
      password: this.data.password,
      grant_type: 'password'
  };
  this.restService.tokenAuth(loginPayload).subscribe((resp) => {
      if (resp) {
          this.restService.getUserByUserID(sessionStorage.USERID).subscribe((result) => {
              const response = result && result.data;
              const firstName = (response && response.firstName) || '',
                  surname = (response && response.surname) || '';
              const role = response.userRoles.filter(x => x.isPrimary === 1)[0];
              this.restService.getSiteMapItemByRoleId(role.roleId)
                  .subscribe(async (res) => {
                      this.restService.getHomePageSetting(response.userId).subscribe(homeInfo => {
                          const data = res && res.data.privileges;
                          const route = (homeInfo.data.homepage == null) ? 'home' : homeInfo.data.homepage,
                              saveObjHome = homeInfo.data;

                          sessionStorage.setItem(constants.StorageConstants.HOME_SETTINGS, JSON.stringify(saveObjHome));
                          sessionStorage.setItem(constants.StorageConstants.MENU_ITEMS, JSON.stringify(data));
                          sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(response));
                          sessionStorage.setItem(constants.StorageConstants.USERINTERNALROLESINFO, JSON.stringify(role));
                          sessionStorage.setItem('name', `${firstName} ${surname}`);
                          this.loaderService.display(false);
                          this.dialogRef.close();
                          this.router.navigate([route]);
                      },
                          error => {
                              this.loaderService.display(false);
                              this.snackbar.openSnackBar('Error loggin in.', 'Error');
                              this.dialogRef.close();
                              this.router.navigate(['/authentication/login']);
                          });
                  });
          },
              error => {
                  this.loaderService.display(false);
                  this.snackbar.openSnackBar('Error loggin in.', 'Error');
                  this.dialogRef.close();
                  this.router.navigate(['/authentication/login']);
              });
      } else {
          this.loaderService.display(false);
          this.dialogRef.close();
          this.router.navigate(['/authentication/login']);
      }
  },
      error => {
        this.loaderService.display(false);
          this.snackbar.openSnackBar(error.error.message, 'Error');
          if (error.status === 409) {
              this.router.navigate(['/authentication/register'], { state: { userDetail: loginPayload } });
          } else {
            this.dialogRef.close();
            this.router.navigate(['/authentication/login']);
          }
      });
  }
}
