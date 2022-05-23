import {Component, OnInit} from '@angular/core';
import {RestcallService} from '../services/restcall.service';
import {SnackbarService} from '../services/snackbar.service';
import * as constants from './../constants/localstorage-keys';

@Component({
    selector: 'app-manage-home-page',
    templateUrl: './manage-home-page.component.html',
    styleUrls: ['./manage-home-page.component.css']
})

export class ManageHomePageComponent implements OnInit {
    homepage = '';
    userId: number;
    settings: any;
    sections: any;
    settingId: number;
    bind: any;
    isSpinnerVisible = false;

    constructor(private snackbar: SnackbarService, private restService: RestcallService) {
    }

    ngOnInit() {
        const data = sessionStorage.getItem(constants.StorageConstants.USERINFO);
        const userInfo = data && JSON.parse(data);
        this.userId = userInfo && userInfo.userId;
        this.loadInitials();
    }

    loadInitials() {
        this.isSpinnerVisible = true;
        const data = sessionStorage.getItem(constants.StorageConstants.HOME_SETTINGS);
        this.settings = data && JSON.parse(data) || '';
        this.sections = this.settings && this.settings.sections && JSON.parse(this.settings.sections.replace(/'/g, '"')) || {};
        this.homepage = this.settings.homepage;
        this.settingId = this.settings.settingId;
        this.bind = {
            ActiveTask: false,
            Notifications: false,
            MyRequests: false,
            RequestStatus: false,
        };
        if (this.sections !== {}) {
            this.bind = {
                ActiveTask: this.sections.ActiveTask || false,
                Notifications: this.sections.Notifications || false,
                MyRequests: this.sections.MyRequests || false,
                RequestStatus: this.sections.RequestStatus || false
            };
        }
        this.isSpinnerVisible = false;
    }

    subscribeChanges() {
        const payload = {
            'settingId': this.settingId || 0,
            'userId': this.userId,
            'homepage': this.homepage || '',
            'sections': JSON.stringify(this.bind)
        };
        this.isSpinnerVisible = true;
        this.restService.saveHomePageSetting(payload).subscribe((result) => {
            this.restService.getHomePageSetting(this.userId).subscribe(homeInfo => {
                this.isSpinnerVisible = false;
                const settings = homeInfo && homeInfo.data;
                sessionStorage.setItem(constants.StorageConstants.HOME_SETTINGS, JSON.stringify(settings));
                this.loadInitials();
                this.snackbar.openSnackBar('changes saved', 'Success');
            });
        });
    }
}
