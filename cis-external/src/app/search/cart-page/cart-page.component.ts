import { DatePipe } from '@angular/common';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {SearchService} from '../search.service';

@Component({
    selector: 'app-cart-page',
    templateUrl: './cart-page.component.html',
    styleUrls: ['./cart-page.component.scss'],
    providers: [DatePipe]
})
export class CartPageComponent implements OnInit {
    @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    showImageLoader: any = false;
    isSpinnerVisible = false;
    columns: Array<string> = ['sno', 'dataType', 'conversion', 'action'];
    dataSource1 = [];
    dataSource2 = [];
    dataSource3 = [];
    dataSource4 = [];
    columnType1 = ['sno', 'format', 'type'];
    columnType2 = ['sno', 'certType', 'format', 'type'];
    columnType3 = ['sno', 'type'];
    columnType4 = ['sno', 'type'];
    cartId = null;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    cartData;
    selectedImageID = 'image1';
    // imageArray: any;
    selectedImageSource: any;
    requestorData: any;
    loggedUserData: any;
    formatType;
    constructor(private snackbar: SnackbarService, private restService: RestcallService,
                private searchService: SearchService, private router: Router, private loaderService: LoaderService,
                private datePipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef) {
                    this.loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
                    this.galleryOptions = [
                        {
                          width: '300px',
                          height: '500px',
                          thumbnailsColumns: 3,
                          arrowPrevIcon: 'fa fa-chevron-left',
                          arrowNextIcon: 'fa fa-chevron-right',
                          imageAnimation: NgxGalleryAnimation.Slide,
                          previewRotate: true,
                          previewZoom: true,
                          previewFullscreen: true,
                          previewKeyboardNavigation: true,
                          thumbnailsArrows: true,
                          actions: [
                            {
                              icon: 'fa fa-arrow-circle-down',
                              titleText: 'download',
                              onClick: function(event) {
                                // alert(event);
                              }
                            }
                          ]
                        },
                        {
                          breakpoint: 800,
                          width: '100%',
                          height: '600px',
                          imagePercent: 80,
                          thumbnailsPercent: 20,
                          thumbnailsMargin: 20,
                          thumbnailMargin: 20,
                        },
                        {
                          breakpoint: 400,
                          preview: false
                        }
                      ];
    }

    ngOnInit() {
        this.showImageLoader = true;
        this.initialise();
        this.getListItems();
    }

    getListItems() {
        this.restService.getListItems(226).subscribe((res) => {
            this.formatType = res.data;
        });
    }

    initialise() {
        this.loaderService.display(true);
        this.restService.getCartDetails(this.userId).subscribe(response => {
            if (response.data) {
                this.cartData = [];
                this.cartId = response.data.cartId;
                const arr = [];
                const data = response.data.cartStageData;

                for (const x of data) {
                    const json = x.jsonData;
                    const payload = {
                        cartId: x.cartId,
                        dataKey: x.dataKey,
                        dataKeyValue: x.dataKeyValue,
                        dated: x.dated,
                        id: x.id,
                        jsonData: JSON.parse(json.replace(/\\|/g, '')),
                        provinceId: x.provinceId,
                        searchTypeId: x.searchTypeId,
                        userId: x.userId,
                    };
                    arr.push(payload);
                }
                this.cartData = arr;
                for (let i = 0; i < this.cartData.length; i++) {
                    if (this.cartData[i].jsonData.searchDetails.leaseNo) {
                        this.cartData[i].jsonData.searchDetails.searchNumber = this.cartData[i].jsonData.searchDetails.leaseNo;
                        this.cartData[i].jsonData.searchDetails.filterName = 'Lease Number';
                    } else if (this.cartData[i].jsonData.searchDetails.surveyRecordNo) {
                        this.cartData[i].jsonData.searchDetails.searchNumber = this.cartData[i].jsonData.searchDetails.surveyRecordNo;
                        this.cartData[i].jsonData.searchDetails.filterName = 'Survey Record Number';
                    } else if (this.cartData[i].jsonData.searchDetails.deedNo) {
                        this.cartData[i].jsonData.searchDetails.searchNumber = this.cartData[i].jsonData.searchDetails.deedNo;
                        this.cartData[i].jsonData.searchDetails.filterName = 'Deed Number';
                    } else if (this.cartData[i].jsonData.searchDetails.compilationNo) {
                        this.cartData[i].jsonData.searchDetails.searchNumber = this.cartData[i].jsonData.searchDetails.compilationNo;
                        this.cartData[i].jsonData.searchDetails.filterName = 'Compilation Number';
                    }
                    this.getDocument(this.cartData[i].jsonData.searchDetails.recordId, i);
                    // const arr1 = this.cartData[i].jsonData.searchDetails.preview.split(',').filter(function (el) {
                    //     return el !== '';
                    //   });
                    // this.cartData[i].jsonData.searchDetails.tempPreview = arr1;
                    // this.cartData[i].jsonData.searchDetails.firstImgPreview = arr1[0];
                }
                // this.selectedImageSource = this.cartData.length > 0 ? this.cartData[0].jsonData.searchDetails.tempPreview[0] : '';
            } else {
                this.cartData = [];
            }
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    selectImage(event) {
        this.selectedImageSource = event;
        this.selectedImageID = event.preview;
    }

    getDocument(id, i) {
        this.restService.getDcoumentForRecord(id).subscribe(payload => {
            this.cartData[i].jsonData.searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
            this.cartData[i].jsonData.searchDetails.totalPages = payload.headers.get('X-Total-Count');
            // this.imageArray = payload.body.data;
            this.cartData[i].jsonData.searchDetails.tempPreview = payload.body.data[0];
            this.cartData[i].jsonData.searchDetails.imageArray = [];
            for (let j = 0; j < payload.body.data.length; j++) {
                const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
                this.cartData[i].jsonData.searchDetails.imageArray.push(
                    {
                        small: payload.body.data[j].thumbnail,
                        medium: payload.body.data[j].preview,
                        big: payload.body.data[j].preview,
                        description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                        url: payload.body.data[j].url
                    }
                );
            }
            this.galleryImages = this.cartData[i].jsonData.searchDetails.imageArray;
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
        }, error => {
        });
    }

    emptyCart() {
        // this.isSpinnerVisible = true;
        this.loaderService.display(true);
        this.restService.emptyCart(this.cartId).subscribe(() => {
            this.searchService.trigger();
            this.snackbar.openSnackBar('Cart emptied', 'Success');
            this.initialise();
            // this.isSpinnerVisible = false;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    editProduct(item) {
        const data = item;
        data.jsonData = JSON.stringify(item.jsonData);
        if (JSON.parse(data.jsonData).cartData.ngi === true) {
            this.router.navigate(['/search/search-details-ngi'],
            { state: { queryParams: data, templateListItemId: item.jsonData.templateListItemId } });
        } else {
            this.router.navigate(['/search/search-details'], { state: { queryParams: data } });
        }
    }

    removeProduct(item) {
        // this.isSpinnerVisible = true;
        this.loaderService.display(true);
        this.restService.removeCartItem(this.cartId, item.id).subscribe(() => {
            this.snackbar.openSnackBar('Cart data removed', 'Success');
            this.searchService.trigger();
            this.initialise();
            // this.isSpinnerVisible = false;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }

    delete() {
        this.snackbar.openSnackBar('Item deleted Successfully', 'Success');
    }

    selectDelivery() {
        this.router.navigate(['/search/delivery-page'], {state: {reqData: this.requestorData}});
    }

    setRequestorData() {
        this.requestorData = {
            'userId': this.userId,
            'isMediaToDepartment': 0,
            'requesterType': 447,
            'deliveryMethod': '',
            'deliveryMedium': '',
            'requestLoggedBy': {
                'firstName': this.loggedUserData.firstName,
                'surName': this.loggedUserData.surname,
                'contactNo': this.loggedUserData.mobileNo,
                'email': this.loggedUserData.email,
                'fax': '',
                'addressLine1': this.loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': this.loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': this.loggedUserData.userProfile.postalAddressLine3,
                'postalCode': this.loggedUserData.userProfile.postalCode
            },
            'requesterDetails': {
                'firstName': this.loggedUserData.firstName,
                'surName': this.loggedUserData.surName,
                'contactNo': this.loggedUserData.contactNo,
                'email': this.loggedUserData.email,
                'fax': '',
                'addressLine1': this.loggedUserData.addressLine1,
                'addressLine2': this.loggedUserData.addressLine2,
                'addressLine3': this.loggedUserData.addressLine3,
                'postalCode': this.loggedUserData.postalCode
            }
        };
      }
}
