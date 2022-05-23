import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';
import { TopMenuService } from '../../services/topmenu.service';

const VIEW_MAP_URL = environment.gisServerUrl + '/infomap.aspx?UserID=';

@Component({
    selector: 'app-map-viewer',
    templateUrl: './map-viewer.component.html',
    styleUrls: ['./map-viewer.component.css']
})
export class MapViewerComponent implements OnInit {

    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    lpi;
    mapsrc;

    constructor(private dom: DomSanitizer, private topMenu: TopMenuService, private router: Router) {
        if (this.lpi !== null && this.lpi !== undefined) {
            this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL + this.userId + '&LPI=' + this.lpi + '&uam='
            + environment.uamBaseUrl + '&wt=' + environment.triggerUrl);
        } else {
            this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL + this.userId + '&uam='
            + environment.uamBaseUrl + '&wt=' + environment.triggerUrl);
        }
        const navig = this.topMenu.iconsInfo.filter(x => x.name ===
                        router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
        if (navig.length > 0) {
            this.topMenu.navigate(navig[0].id);
        }
    }

    ngOnInit() {
    }

}
