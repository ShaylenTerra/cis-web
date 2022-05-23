import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestcallService } from '../../services/restcall.service';
import * as constants from './../../constants/localstorage-keys';
import { SnackbarService } from '../../services/snackbar.service';
import { LoaderService } from '../../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    public form: FormGroup;
    hide1 = true;
    isSpinnerVisible = false;
    invalidLogin = false;
    errorMsg: any;
    userDetail: any;
    isLoggedIn: any = false;
    portalUrl: any = environment.portalUrl;
    constructor(private fb: FormBuilder, private router: Router,
        private restService: RestcallService, private snackbar: SnackbarService,
        private spinner: NgxSpinnerService, private cookieService: CookieService) {
        if (this.router.getCurrentNavigation().extras.state !== undefined) {
            this.userDetail = this.router.getCurrentNavigation().extras.state.userDetail;
        }
    }

    ngOnInit() {
        sessionStorage.clear();
        this.form = this.fb.group({
            username: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            password: [null, Validators.compose([Validators.required])],
            // isLoggedIn: false
        });
        // this.isLoggedIn = this.cookieService.get("isLoggedIn") === 'true' ? true : false;
        if (this.userDetail !== undefined) {
            this.form.patchValue({
                username: this.userDetail.username,
                password: this.userDetail.password,
                // isLoggedIn: this.isLoggedIn
            });
        }
        // else {
        //     this.isLoggedIn = this.cookieService.get("isLoggedIn") === 'true' ? true : false;
        //     if (this.isLoggedIn) {
        //         this.form.patchValue({
        //             username: this.cookieService.get("un"),
        //             password: this.cookieService.get("ps"),
        //             isLoggedIn: this.isLoggedIn
        //         });
        //         console.log('User details available')
        //     }
        // }
    }

    changeCheckBox(event) {
        // this.isLoggedIn = event.checked;
    }

    onSubmit() {
        if (!this.form.valid) {
            this.form.get('username').markAsTouched();
            this.form.get('password').markAsTouched();
        } else {


            this.invalidLogin = false;
            const username = this.form.value.username,
                password = this.form.value.password;
            const loginPayload = {
                username: username,
                password: password,
                grant_type: 'password'
            };
            this.spinner.show();
            this.restService.tokenAuth(loginPayload).subscribe((resp) => {
                // this.isSpinnerVisible = true;
                // this.spinner.show();
                if (resp) {
                    this.restService.getUserByUserID(sessionStorage.USERID).subscribe((result) => {
                        // if (this.isLoggedIn) {
                        //     this.cookieService.set("un", this.form.value.username);
                        //     this.cookieService.set("ps", this.form.value.password);
                        // } else {
                        //     this.cookieService.delete("un");
                        //     this.cookieService.delete("ps");
                        // }
                        // this.cookieService.set("isLoggedIn",this.isLoggedIn);
                        const response = result && result.data;
                        const firstName = (response && response.firstName) || '',
                            surname = (response && response.surname) || '';
                        const role = response.userRoles.filter(x => x.isPrimary === 1)[0];
                        this.restService.getSiteMapItemByRoleId(role.roleId)
                            .subscribe(async (res) => {
                                debugger;
                                this.restService.getHomePageSetting(response.userId).subscribe(homeInfo => {
                                    debugger;
                                    const data = res && res.data.privileges;
                                    const route = (homeInfo.data.homepage == null) ? 'home' : homeInfo.data.homepage,
                                        saveObjHome = homeInfo.data;
                                        debugger;
                                    sessionStorage.setItem(constants.StorageConstants.HOME_SETTINGS, JSON.stringify(saveObjHome));
                                    sessionStorage.setItem(constants.StorageConstants.MENU_ITEMS, JSON.stringify(data));
                                    sessionStorage.setItem(constants.StorageConstants.USERINFO, JSON.stringify(response));
                                    sessionStorage.setItem(constants.StorageConstants.USERINTERNALROLESINFO, JSON.stringify(role));
                                    sessionStorage.setItem('name', `${firstName} ${surname}`);
                                    // this.isSpinnerVisible = false;
                                    this.spinner.hide();
                                    this.router.navigate([route]);
                                },
                                    error => {
                                        // this.isSpinnerVisible = false;
                                        this.spinner.hide();
                                        this.errorMsg = error.error.error_description;
                                        // this.snackbar.openSnackBar('Error loggin in.', 'Error');
                                    });
                            });
                    },
                        error => {
                            // this.isSpinnerVisible = false;
                            this.spinner.hide();
                            this.errorMsg = error.error.error_description;
                            // this.snackbar.openSnackBar('Error loggin in.', 'Error');
                        });
                }
            },
                error => {
                    // this.isSpinnerVisible = false;
                    this.spinner.hide();
                    this.errorMsg = error.error.error_description;
                    this.snackbar.openSnackBar(error.error.error, 'Error');
                    if (error.status === 409) {
                        const userData = JSON.parse(error.error.message);
                        this.router.navigate(['/authentication/register'], { state: { userDetail: loginPayload, userData: userData } });
                    }
                });
        }
    }
}
