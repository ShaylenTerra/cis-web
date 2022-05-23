import {Injectable} from '@angular/core';
import { Router } from '@angular/router';

interface IconInfo {
    id: number;
    name: string;
    activeIconUrl: string;
    inActiveIconUrl: string;
    toolTip: string;
    altRoute: string;
    currentStateUrl: string;
}


@Injectable({providedIn: 'root'})
export class TopMenuService {
    iconsInfo = [
            {
                id: 1,
                name: 'home',
                activeIconUrl: 'assets/images/icon/a-home.png',
                inActiveIconUrl: 'assets/images/icon/ia-home.png',
                toolTip: 'Home',
                altRoute: 'home',
                currentStateUrl: 'assets/images/icon/a-home.png'
            },
            {
                id: 2,
                name: 'search',
                activeIconUrl: 'assets/images/icon/a-search.png',
                inActiveIconUrl: 'assets/images/icon/ia-search.png',
                toolTip: 'Search',
                altRoute: '/search/search-page',
                currentStateUrl: 'assets/images/icon/ia-search.png'
            },
            {
                id: 3,
                name: 'general',
                activeIconUrl: 'assets/images/icon/a-maps.png',
                inActiveIconUrl: 'assets/images/icon/ia-maps.png',
                toolTip: 'Maps',
                altRoute: 'general/map-viewer',
                currentStateUrl: 'assets/images/icon/ia-maps.png'
            }
        ];
    constructor(public router: Router) {
    }

    navigate(id: number) {
        let route = '';
        this.iconsInfo = this.iconsInfo.map((icon) => {
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
