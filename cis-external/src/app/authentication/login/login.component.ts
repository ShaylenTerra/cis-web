import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestcallService} from '../../services/restcall.service';
import * as constants from './../../constants/storage-keys';
import * as enums from './../../constants/enums';
import {CustomValidators} from 'ng2-validation';
import {SnackbarService} from '../../services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
// import { CookieService } from 'angular2-cookie/services/cookies.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  hide1 = true;
  // isSpinnerVisible = false;
  invalidLogin = false;
  errorMsg: any;
  portalUrl: any = environment.portalUrl;
  constructor(private fb: FormBuilder, private router: Router,
    private restService: RestcallService, private snackbar: SnackbarService, private spinner: NgxSpinnerService
    // ,private _cookieService:CookieService
    ) { 
      // if(_cookieService.get('remember')) {
      //   this.form.value.email = this._cookieService.get('username');
      //   this.form.value.password = this._cookieService.get('password');
      //   this.form.value.rememberme = this._cookieService.get('remember');
      // }
    }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      password: [null, Validators.compose([Validators.required])]
    });
    this.loadUser();
  }
  async loadUser() {
    this.spinner.show();
    const userType = sessionStorage.getItem(constants.StorageConstants.USERTYPE) || '',
      userEmail = sessionStorage.getItem(constants.StorageConstants.USEREMAIL) || '',
      userCode = sessionStorage.getItem(constants.StorageConstants.USERCODE) || '';
    if (userType === enums.UserTypes.EXTERNAL && userEmail.length > 0 && userCode.length > 0) {
      await this.processUserLogin(userEmail.toLowerCase());
    } else {
      this.spinner.hide();
    }
  }

  onSubmit() {
    this.spinner.show();
    this.invalidLogin = false;
    const username = this.form.value.email && this.form.value.email.toLowerCase(),
      password = this.form.value.password;
    const loginPayload = {
      username: username,
      password: password
    };
    // this._cookieService.put('username', username);
    // this._cookieService.put('password', password);
    // this._cookieService.put('remember', this.form.value.rememberme);
    this.restService.tokenAuth(loginPayload).subscribe(async (response) => {
      this.spinner.show();
        if (response) {
            this.restService.getUserByUserID(sessionStorage.USERID).subscribe((result) => {
                const resData = result && result.data;
                const firstName = (resData && resData.firstName) || '',
                    surname = (resData && resData.surname) || '';
                const role = resData.userRoles.filter(x => x.isPrimary === 1)[0];
                sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(resData));
                sessionStorage.setItem(constants.StorageConstants.USEREXTERNALROLESINFO, JSON.stringify(role));
                sessionStorage.setItem('name', `${firstName} ${surname}`);
                sessionStorage.setItem('password', this.form.value.password);
                this.restService.getSiteMapItemByRoleId(role.roleId).subscribe((siteResponse) => {
                  const previlage = siteResponse && siteResponse.data.privileges;
                  sessionStorage.setItem(constants.StorageConstants.MENU_ITEMS, JSON.stringify(previlage));
                  this.router.navigate(['/home']);
                }, error => {
                  this.spinner.hide();
                  this.errorMsg = error.error.error_description;
                  // this.snackbar.openSnackBar(error.error.message, 'Error');
                });
            });
        }

    },
      error => {
        this.spinner.hide();
        this.errorMsg = error.error.error_description;
        // this.snackbar.openSnackBar(error.error.message, 'Error');
      });
      this.spinner.hide();
  }
  async processUserLogin(username: string) {
    return this.restService.getUserInfoByEmail(username).subscribe(async (payload) => {
      const userResponse = payload.data;
      if (userResponse.status === enums.UserAccountStatus.PENDING) {
        this.spinner.hide();
        this.errorMsg = 'Contact - admin@drdlr.gov.za. Not an Active Account';
        // this.snackbar.openSnackBar('Contact - admin@drdlr.gov.za.', 'Not an Active Account');
      } else if (userResponse.status === enums.UserAccountStatus.APPROVED) {
        this.snackbar.openSnackBar('Please Reset your password', 'First Login');
        this.router.navigate(['/authentication/reset-password']);
      } else if (userResponse.status === enums.UserAccountStatus.ACTIVE) {
        sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(userResponse));
        sessionStorage.setItem(constants.StorageConstants.USERTYPE, userResponse.userTypeName);
        sessionStorage.setItem(constants.StorageConstants.USERNAME, `${userResponse.firstName} ${userResponse.surname}`);
        sessionStorage.setItem(constants.StorageConstants.USEREMAIL, userResponse.email.toLowerCase());
        sessionStorage.setItem(constants.StorageConstants.USERCODE, userResponse.userCode);
        sessionStorage.setItem(constants.StorageConstants.USEREXTERNALROLESINFO, JSON.stringify(userResponse.externalUserRoles));
        sessionStorage.setItem('password', this.form.value.password);
        this.spinner.hide();
        this.router.navigate(['/home']);
      } else {
        this.spinner.hide();
        this.errorMsg = 'Contact - admin@drdlr.gov.za. Not an Active Account';
        // this.snackbar.openSnackBar('Contact - admin@drdlr.gov.za.', 'Not an Active Account');
      }
    },
      error => {
        this.spinner.hide();
        this.errorMsg = error.error.error_description;
        // this.snackbar.openSnackBar('Unknown error while retreiving user information.', 'Error');
      });
  }
}
