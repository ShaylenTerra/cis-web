import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {SearchService} from '../search-page/search.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxGalleryComponent, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import {DatePipe} from '@angular/common';

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
    box;
    requesterForm: FormGroup;
    requestor: any = 'yes';
    requesterType: any = 'walk-in-client';
    loggedUserData: any;
    reqTypes;
    showImageLoader: any = false;
    formatType;
    constructor(private snackbar: SnackbarService, private fb: FormBuilder, private restService: RestcallService,
        private searchService: SearchService, private router: Router, private loaderService: LoaderService,
        private datePipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef) {
        this.loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
        this.requesterForm = this.fb.group({
            firstName: ['', Validators.required],
            surName: ['', Validators.required],
            email: ['', Validators.required],
            fax: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            addressLine3: [''],
            contactNo: ['', Validators.required],
            postalCode: ['', Validators.required]
        });
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
        this.restService.getListItems(41).subscribe(response => {
            this.reqTypes = response.data;
        }, error => {
            this.loaderService.display(false);
        });
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
                const reqVal =  this.cartData.filter(x => x.jsonData.requesterDetails !== undefined).length > 0 ?
                                (this.cartData.filter(x => x.jsonData.requesterDetails.requesterType !== '')[0] !== undefined ?
                              this.cartData.filter(x => x.jsonData.requesterDetails.requesterType !== '')[0].jsonData.requesterDetails :
                              undefined) : undefined;
                if (this.requestorData !== undefined) {
                    if (this.requestorData?.requesterType !== 447) {
                        this.requestor = 'no';
                        this.requesterType = reqVal.requesterType;
                        this.requesterForm.patchValue({
                            firstName: reqVal.requesterDetails.firstName,
                            surName: reqVal.requesterDetails.surName,
                            email: reqVal.requesterDetails.email,
                            fax: reqVal.requesterDetails.fax,
                            addressLine1: reqVal.requesterDetails.addressLine1,
                            addressLine2: reqVal.requesterDetails.addressLine2,
                            addressLine3: reqVal.requesterDetails.addressLine3,
                            contactNo: reqVal.requesterDetails.contactNo,
                            postalCode: reqVal.requesterDetails.postalCode
                        });
                    } else {
                        this.requestor = 'yes';
                        this.requesterType = 447;
                        this.requesterForm.patchValue({
                            firstName: reqVal.requestLoggedBy.firstName,
                            surName: reqVal.requestLoggedBy.surName,
                            email: reqVal.requestLoggedBy.email,
                            fax: reqVal.requestLoggedBy.fax,
                            addressLine1: reqVal.requestLoggedBy.addressLine1,
                            addressLine2: reqVal.requestLoggedBy.addressLine2,
                            addressLine3: reqVal.requestLoggedBy.addressLine3,
                            contactNo: reqVal.requestLoggedBy.contactNo,
                            postalCode: reqVal.requestLoggedBy.postalCode
                        });
                    }
                } else {
                    this.requestor = 'yes';
                    this.requesterType = 447;
                    this.requesterForm.patchValue({
                        firstName: reqVal.requestLoggedBy?.firstName,
                        surName: reqVal.requestLoggedBy?.surName,
                        email: reqVal.requestLoggedBy?.email,
                        fax: reqVal.requestLoggedBy?.fax,
                        addressLine1: reqVal.requestLoggedBy?.addressLine1,
                        addressLine2: reqVal.requestLoggedBy?.addressLine2,
                        addressLine3: reqVal.requestLoggedBy?.addressLine3,
                        contactNo: reqVal.requestLoggedBy?.contactNo,
                        postalCode: reqVal.requestLoggedBy?.postalCode
                    });
                }

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
                }
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
        this.setRequestorData();
        if (JSON.parse(data.jsonData).cartData.ngi === true) {
            this.router.navigate(['/search/search-details-ngi'], { state: { queryParams: data, requestorData: this.requestorData,
                                templateListItemId: item.jsonData.templateListItemId } });
        } else {
            this.router.navigate(['/search/search-details'], { state: { queryParams: data, requestorData: this.requestorData } });
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
        this.setRequestorData();
        this.router.navigate(['/search/delivery-page'], { state: { reqData: this.requestorData } });
    }

    boxfun() {
        this.box = 1;
    }

    closebox() {
        this.box = 0;
    }

    nvaigateToSeach() {
        this.setRequestorData();
        this.router.navigate(['/search/search-page'], { state: { reqData: this.requestorData } });
    }

    setValidation() {
        const Email = this.requesterForm.get('email');
        const Fax = this.requesterForm.get('fax');
        const Address = this.requesterForm.get('addressLine1');
        const contactNumber = this.requesterForm.get('contactNo');
        if (this.requesterType === 440) {
            Email.setValidators([Validators.required]);
            Fax.setValidators(null);
            Address.setValidators(null);
            contactNumber.setValidators(null);
            Fax.clearValidators();
            Fax.updateValueAndValidity();
            Address.clearValidators();
            Address.updateValueAndValidity();
            contactNumber.clearValidators();
            contactNumber.updateValueAndValidity();
        } else if (this.requesterType === 441) {
            Email.setValidators(null);
            Fax.setValidators([Validators.required]);
            Address.setValidators(null);
            contactNumber.setValidators(null);
            Email.clearValidators();
            Email.updateValueAndValidity();
            Address.clearValidators();
            Address.updateValueAndValidity();
            contactNumber.clearValidators();
            contactNumber.updateValueAndValidity();
        } else if (this.requesterType === 442 || this.requesterType === 443) {
            Email.setValidators(null);
            Fax.setValidators(null);
            Address.setValidators([Validators.required]);
            contactNumber.setValidators(null);
            Email.clearValidators();
            Email.updateValueAndValidity();
            Fax.clearValidators();
            Fax.updateValueAndValidity();
            contactNumber.clearValidators();
            contactNumber.updateValueAndValidity();
        } else if (this.requesterType === 444 || this.requesterType === 445) {
            Email.setValidators(null);
            Fax.setValidators(null);
            Address.setValidators(null);
            contactNumber.setValidators([Validators.required]);
            Email.clearValidators();
            Email.updateValueAndValidity();
            Fax.clearValidators();
            Fax.updateValueAndValidity();
            Address.clearValidators();
            Address.updateValueAndValidity();
        } else if (this.requesterType === 446 || this.requesterType === 447) {
            Email.setValidators(null);
            Fax.setValidators(null);
            Address.setValidators(null);
            contactNumber.setValidators(null);
            Email.clearValidators();
            Email.updateValueAndValidity();
            Fax.clearValidators();
            Fax.updateValueAndValidity();
            Address.clearValidators();
            Address.updateValueAndValidity();
            contactNumber.clearValidators();
            contactNumber.updateValueAndValidity();
        } else if (this.requesterType === 439) {
            Email.setValidators([Validators.required]);
            Fax.setValidators([Validators.required]);
            Address.setValidators([Validators.required]);
            contactNumber.setValidators([Validators.required]);
            Email.updateValueAndValidity();
            Fax.updateValueAndValidity();
            Address.updateValueAndValidity();
            contactNumber.updateValueAndValidity();
        }
    }

    setRequestorData() {
        this.requestorData = {
            'userId': this.userId,
            'isMediaToDepartment': 0,
            'requesterType': this.requestor === 'no' ? this.requesterType : 447,
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
                'firstName': this.requestor === 'no' ? this.requesterForm.value.firstName : this.loggedUserData.firstName,
                'surName': this.requestor === 'no' ? this.requesterForm.value.surName : this.loggedUserData.surName,
                'contactNo': this.requestor === 'no' ? this.requesterForm.value.contactNo : this.loggedUserData.contactNo,
                'email': this.requestor === 'no' ? this.requesterForm.value.email : this.loggedUserData.email,
                'fax': this.requestor === 'no' ? this.requesterForm.value.fax : '',
                'addressLine1': this.requestor === 'no' ? this.requesterForm.value.addressLine1 : this.loggedUserData.addressLine1,
                'addressLine2': this.requestor === 'no' ? this.requesterForm.value.addressLine2 : this.loggedUserData.addressLine2,
                'addressLine3': this.requestor === 'no' ? this.requesterForm.value.addressLine3 : this.loggedUserData.addressLine3,
                'postalCode': this.requestor === 'no' ? this.requesterForm.value.postalCode : this.loggedUserData.postalCode
            }
        };
    }
}
