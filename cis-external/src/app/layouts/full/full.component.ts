import {MediaMatcher} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {MenuItems} from '../../shared/menu-items/menu-items';

import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import { TopMenuService } from '../../services/topmenu.service';

interface IconInfo {
    id: number;
    name: string;
    activeIconUrl: string;
    inActiveIconUrl: string;
    toolTip: string;
    altRoute: string;
    currentStateUrl: string;
}

/** @title Responsive sidenav */
@Component({
    selector: 'app-full-layout',
    templateUrl: 'full.component.html',
    styleUrls: ['full.component.css']
})
export class FullComponent implements OnDestroy {
    mobileQuery: MediaQueryList;
    dir = 'ltr';
    green: boolean;
    blue: boolean;
    dark: boolean;
    minisidebar: boolean;
    boxed: boolean;
    danger: boolean;
    showHide: boolean;
    url: string;
    iconsInfo: Array<IconInfo> = [];
    public showSearch = false;

    public config: PerfectScrollbarConfigInterface = {};
    private _mobileQueryListener: () => void;

    constructor(
        public router: Router,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public menuItems: MenuItems,
        public topMenu: TopMenuService
    ) {
        this.mobileQuery = media.matchMedia('(min-width: 768px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        // this.iconsInfo = [
        //     {
        //         id: 1,
        //         name: 'home',
        //         activeIconUrl: 'assets/images/icon/a-home.png',
        //         inActiveIconUrl: 'assets/images/icon/ia-home.png',
        //         toolTip: 'Home',
        //         altRoute: 'home',
        //         currentStateUrl: 'assets/images/icon/a-home.png'
        //     },
        //     {
        //         id: 2,
        //         name: 'search',
        //         activeIconUrl: 'assets/images/icon/a-search.png',
        //         inActiveIconUrl: 'assets/images/icon/ia-search.png',
        //         toolTip: 'Search',
        //         altRoute: '/search/search-page',
        //         currentStateUrl: 'assets/images/icon/ia-search.png'
        //     },
        //     {
        //         id: 3,
        //         name: 'maps',
        //         activeIconUrl: 'assets/images/icon/a-maps.png',
        //         inActiveIconUrl: 'assets/images/icon/ia-maps.png',
        //         toolTip: 'Maps',
        //         altRoute: 'general/map-viewer',
        //         currentStateUrl: 'assets/images/icon/ia-maps.png'
        //     }
        // ];
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    navigate(id: number) {
        let route = '';
        this.topMenu.iconsInfo = this.topMenu.iconsInfo.map((icon) => {
            icon.currentStateUrl = icon.inActiveIconUrl;
            if (icon.id === id) {
                icon.currentStateUrl = icon.activeIconUrl;
                route = icon.altRoute;
            }
            return icon;
        });
        this.router.navigate([route]);
    }
}
