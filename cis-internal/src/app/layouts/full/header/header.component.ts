import {RestcallService} from '../../../services/restcall.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {Router} from '@angular/router';
import * as constants from './../../../constants/localstorage-keys';
import {SearchService} from '../../../search/search-page/search.service';

interface MenuItems {
    icon: string;
    text: string;
    route: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.component.css']
})
export class AppHeaderComponent implements OnInit {
    @ViewChild('menu') divMenu: ElementRef;
    public config: PerfectScrollbarConfigInterface = {};
    isSpinnerVisible = false;
    name: string;
    public menuItems: MenuItems[] = [];
    rawMenu: any;
    noGrid = false;
    url: any = '';
    searchMenu: any = '';
    public filterMenuItems: MenuItems[] = [];
    constructor(private router: Router, public searchService: SearchService,
                private restService: RestcallService) {
        this.name = sessionStorage.getItem('name') || '';
    }

    ngOnInit() {
        this.rawMenu = JSON.parse(sessionStorage.getItem(constants.StorageConstants.MENU_ITEMS));

        this.getMenuItems();
        this.searchService.getProfileImage();
    }

    getMenuItems() {
        this.menuItems = [];
        if (this.rawMenu && this.rawMenu.length > 0) {
            this.rawMenu.forEach((item) => {
                this.menuItems.push({icon: item.icon, text: item.name, route: item.route});

            });
            this.filterMenuItems = this.menuItems;
        } else {
            this.noGrid = true;
        }
    }

    async logout() {
        sessionStorage.clear();
        this.router.navigate(['/authentication/login']);
    }

    navigateToRoute(route: string) {
        this.divMenu.nativeElement.classList.remove('show');
        this.divMenu.nativeElement.classList.add('hide');
        this.searchMenu = '';
        this.filterMenuItems = this.menuItems;
        this.router.navigate([route]);
    }

    async logoutUser() {
        this.isSpinnerVisible = true;
        const usercode = sessionStorage.getItem(constants.StorageConstants.USERCODE);
        const input = {
            usercode: usercode
        };
        this.restService.logoutUser(input).subscribe(data => {
            this.isSpinnerVisible = false;
            this.router.navigate(['/authentication/login']);
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    filterMenu() {
        this.filterMenuItems = [];
        if (this.searchMenu.length === 0) {
                this.getMenuItems();
        } else {
            this.filterMenuItems = this.menuItems.filter((task) => task.text.toLowerCase().includes(this.searchMenu.toLowerCase()));
        }
    }
}
