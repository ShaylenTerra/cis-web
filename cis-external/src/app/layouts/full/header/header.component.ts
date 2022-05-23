import {RestcallService} from '../../../services/restcall.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {Router} from '@angular/router';
import * as constants from './../../../constants/storage-keys';
import {SearchService} from '../../../search/search.service';

interface MenuItems {
  icon: string;
  text: string;
  route: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @ViewChild('menu') divMenu: ElementRef;
  public config: PerfectScrollbarConfigInterface = {};
  name: string;
  isSpinnerVisible = false;
  cartLength = 0;
  role: any;
  public filterMenuItems: MenuItems[] = [];
  public menuItems: MenuItems[] = [];
  rawMenu: any;
  noGrid = false;
  searchMenu: any = '';

  constructor(private router: Router, public searchService: SearchService,
              private restService: RestcallService) {
    this.name = sessionStorage.getItem('name') || '';
    this.role = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USEREXTERNALROLESINFO));

  }

  ngOnInit() {
    this.rawMenu = JSON.parse(sessionStorage.getItem(constants.StorageConstants.MENU_ITEMS));
     this.getMenuItems();
    // this.searchService.getProfileImage();
  }

  async logout() {
    await this.logoutUser();
    sessionStorage.clear();
    this.router.navigate(['/authentication/login']);
  }

  async logoutUser() {
    this.isSpinnerVisible = true;
    const usercode = sessionStorage.getItem(constants.StorageConstants.USERCODE);
    const input = {
      usercode: usercode
    };
    this.restService.logoutUser(input).subscribe(data => {
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
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

  navigateToRoute(route: string) {
    this.divMenu.nativeElement.classList.remove('show');
    this.divMenu.nativeElement.classList.add('hide');
    this.searchMenu = '';
    this.filterMenuItems = this.menuItems;
    this.router.navigate([route]);
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
