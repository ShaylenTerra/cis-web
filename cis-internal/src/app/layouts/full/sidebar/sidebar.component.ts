import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {MediaMatcher} from '@angular/cdk/layout';
import * as constants from './../../../constants/localstorage-keys';


import {MenuItems} from '../../../shared/menu-items/menu-items';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
    public config: PerfectScrollbarConfigInterface = {};
    mobileQuery: MediaQueryList;
    status = true;
    userName = '';
    itemSelect: number[] = [];
    private _mobileQueryListener: () => void;

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public menuItems: MenuItems
    ) {
        this.mobileQuery = media.matchMedia('(min-width: 768px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.userName = sessionStorage.getItem(constants.StorageConstants.USERNAME);
    }

    subclickEvent() {
        this.status = true;
    }

    scrollToTop() {
        document.querySelector('.page-wrapper').scroll({
            top: 0,
            left: 0
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}
