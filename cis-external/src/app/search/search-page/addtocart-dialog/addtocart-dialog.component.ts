import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SearchDetailsDialogComponent } from '../../search-details/search-details.dialog';
import { ShareDialogComponent } from '../../search-details/share/share.modal';
import { ViewMapDialogComponent } from '../../search-details/view-map/view-map.modal';
import { SearchService } from '../../search.service';
import * as enums from '../../../constants/enums';
import { RedirectDialogComponent } from '../../search-details/redirect/redirect.modal';
import { UtilityService } from '../../../services/utility.service';
import { ExistingDialogComponent } from '../../search-details/existing/existing.modal';
interface Data1 {
  format: any;
  type: any;
  lamination: any;
}

interface Data2 {
  certType: any;
  format: any;
  type: any;
  lamination: any;
}

interface Data3 {
  type: any;
}

const VIEW_MAP_URL = environment.gisServerUrl + '/infomap.aspx?lpi=';

@Component({
  selector: 'app-addtocart-dialog',
  templateUrl: './addtocart-dialog.component.html',
  styleUrls: ['./addtocart-dialog.component.css']
})
export class AddtocartDialogComponent implements OnInit {

  @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  showImageLoader: any = false;
  isSpinnerVisible = false;
  method = 'add';
  searchDetails;
  searchData;
  imageArray = [];
  image1Source = 'assets/images/t1.gif';
  image2Source = 'assets/images/t2.gif';
  image3Source = 'assets/images/t3.gif';
  image4Source = 'assets/images/t4.gif';
  selectedImageSource;
  selectedImageID = 'image1';

  cartId = JSON.parse(sessionStorage.getItem('cartId'));
  itemId = null;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

  formatType;
  paperSize;
  documentFormat;
  certificateType;
  spatialType;
  alphaType;
  coordinateType;
  diagrams = false;
  general = false;
  spatial = false;
  coordinates = false;
  certificates = false;
  alphaNumerics = false;
  advisory = false;
  misc = false;
  ngi = false;
  diagramsData = [{format: null, type: null}];
  generalData = [{format: null, type: null}];
  spatialData = [{type: null}];
  coordinateData = [{type: null}];
  certificatesData = [{certType: null, format: null, type: null}];
  alphaNumericsData = [{type: null}];
  ngiData = { format: null, notes: null };
  advisoryData = '';
  miscData = '';
  queryParam: any;
  requestorData: any;
  infoData: any;
  totalFileSize: any;
  totalPages: any;

  filterName: any;
  searchNumber: any;
  downloadStat: any = false;
  imgConfig: any;

  diagramsLabel: any;
  generalLabel: any = '';
  spatialLabel: any = '';
  coordinatesLabel: any = '';
  certificatesLabel: any = '';
  alphaNumericsLabel: any = '';
  advisoryLabel: any = '';
  miscLabel: any = '';
  templateListItemId: any;
  constructor(private snackbar: SnackbarService, private dialog: MatDialog, private router: Router,
              private restService: RestcallService, private route: ActivatedRoute, private searchService: SearchService,
              private utility: UtilityService, private changeDetectorRefs: ChangeDetectorRef, private datePipe: DatePipe
              , public dialogRef: MatDialogRef<AddtocartDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.queryParam = data.queryParams;
                this.templateListItemId = this.queryParam.templateItemListId !== undefined ? this.queryParam.templateItemListId :
                              JSON.parse(this.queryParam.jsonData).templateListItemId;
                // this.requestorData = data.requestorData;
                // this.loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
      this.galleryOptions = [
          {
            width: '300px',
            height: '500px',
            thumbnailsColumns: 3,
            arrowPrevIcon: 'fa fa-chevron-left',
            arrowNextIcon: 'fa fa-chevron-right',
            imageAnimation: NgxGalleryAnimation.Slide,
            imageSize: NgxGalleryImageSize.Contain,
            previewRotate: true,
            previewZoom: true,
            previewFullscreen: true,
            previewKeyboardNavigation: true,
            thumbnailsArrows: true,
            imageArrowsAutoHide: true,
            previewArrowsAutoHide: true,
            actions: [
              {
                icon: 'fa fa-arrow-circle-down',
                titleText: 'download',
                onClick: this.downloadImage.bind(this)
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
      this.isSpinnerVisible = true;
      this.informationTypeByListCodes();
      this.getImageDownloadValue();
      this.initialise();
      this.showImageLoader = true;
  }

  loadData() {
      forkJoin([
          this.restService.getListItems(enums.list_master.FORMATTYPE),
          this.restService.getListItems(enums.list_master.PAPERSIZE),
          this.restService.getListItems(enums.list_master.DOCUMENTFORMAT),
          this.restService.getListItems(enums.list_master.CERTIFICATES),
          this.restService.getListItems(enums.list_master.SPATIALDOCUMENTFORMAT),
          this.restService.getListItems(enums.list_master.ALPHADOCUMENTFORMAT),
          this.restService.getListItems(201)
      ]).subscribe(([formatType, paperSize, documentFormat, certificateType, spatialType, alphaType, coordinateType]) => {
          this.formatType = formatType.data;
          this.paperSize = paperSize.data;
          this.documentFormat = documentFormat.data;
          this.certificateType = certificateType.data;
          this.spatialType = spatialType.data;
          this.alphaType = alphaType.data;
          this.coordinateType = coordinateType.data;
          this.certificatesData[0].type = this.paperSize.filter(x=>x.isDefault == 1)[0];
          this.diagramsData[0].type = this.paperSize.filter(x=>x.isDefault == 1)[0];
          this.generalData[0].type = this.paperSize.filter(x=>x.isDefault == 1)[0];
          this.isSpinnerVisible = false;
      });
  }

  getImageDownloadValue() {
      this.restService.imageConfig().subscribe(payload => {
          this.imgConfig = payload.data.tagValue;
      }, error => {
      });
  }

  async initialise() {
      await this.loadData();
      this.informationTypeByListCodes();
      const data = this.queryParam;
      this.searchData = JSON.parse(data.searchData);
  }

  getDocument() {
      this.restService.getDcoumentForRecord(this.searchDetails.recordId).subscribe(payload => {
          this.totalFileSize = payload.headers.get('X-Total-File-Size');
          this.totalPages = payload.headers.get('X-Total-Count');
          for (let j = 0; j < payload.body.data.length; j++) {
              const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
              this.imageArray.push(
                  {
                      small: payload.body.data[j].thumbnail,
                      medium: payload.body.data[j].preview,
                      big: payload.body.data[j].preview,
                      description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                      url: payload.body.data[j].url
                  }
              );
          }
          this.galleryImages = this.imageArray;
          this.changeDetectorRefs.detectChanges();
          this.showImageLoader = false;
          this.selectedImageSource = this.imageArray[0];
          this.selectedImageID = this.imageArray[0].preview;
          if (this.totalFileSize.includes('MB')) {
              if (this.totalFileSize.split(' ')[0] < Number(this.imgConfig)) {
                  this.downloadStat = false;
              } else {
                  this.downloadStat = true;
                  this.snackbar.openSnackBar('Download not possible as image size is greater than ' + this.imgConfig + 'MB', 'Warning');
              }
          }
      }, error => {
      });
  }

  downloadImage(event, index) {
      const imageUrl = this.imageArray[index].url;
      const image: any[] = [];
      image.push(imageUrl);
      const fileName = imageUrl.split('/').pop();
      const obj = {
          'dataKeyName': 'sgdata',
          'documentName': fileName,
          'documentUrl': image,
          'provinceId': this.searchDetails.provinceId,
          'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
      };
      this.restService.downloadSgDataImage(obj).subscribe(payload => {
          this.downloadBlob(payload, fileName);
      }, error => {
      });
  }

  openViewMapDialog(): void {
      this.dialog.open(ViewMapDialogComponent, {
          width: '90%',
          height: '90%',
          data: {
              url: VIEW_MAP_URL + this.searchDetails.lpi
          }
      });
  }

  openDialog(): void {
      const dialogRef = this.dialog.open(SearchDetailsDialogComponent, {
          width: '750px',
          data: {
              images: this.imageArray
          }
      });
      dialogRef.afterClosed().subscribe(async (resultCode) => {
          if (resultCode) {
              this.snackbar.openSnackBar('Province added Successfully', 'Success');
          }
      });
  }

  openShareDialog(): void {
      this.dialog.open(ShareDialogComponent, {
          width: '750px',
          data: {
              recordId: this.searchDetails.recordId
          }
      });
  }

  openUpdateDialog(cartData): void {
      this.dialog.open(ExistingDialogComponent, {
          width: '750px',
          data: {
              queryParam: {state: {queryParams: cartData}}
          }
      });
  }

  add(type) {
      if (type === 126) {
        this.diagramsData.push({ format: null, type: this.paperSize.filter(x=>x.isDefault == 1)[0] });
      } else if (type === 125) {
        this.generalData.push({ format: null, type: this.paperSize.filter(x=>x.isDefault == 1)[0] });
      } else if (type === 127) {
        this.spatialData.push({ type: null });
      } else if (type === 129) {
        this.certificatesData.push({ certType: null, format: null,
            type: this.paperSize.filter(x=>x.isDefault == 1)[0] });
      } else if (type === 130) {
        this.alphaNumericsData.push({ type: null });
      } else if (type === 128) {
        this.coordinateData.push({ type: null });
      }
  }

  remove(type, index) {
      if (type === 126) {
        this.diagramsData.splice(index, 1);
      } else if (type === 125) {
        this.generalData.splice(index, 1);
      } else if (type === 127) {
        this.spatialData.splice(index, 1);
      } else if (type === 129) {
        this.certificatesData.splice(index, 1);
      } else if (type === 130) {
        this.alphaNumericsData.splice(index, 1);
      }
  }

  addToCart() {
      if (this.diagrams === false && this.general === false && this.spatial === false &&
          this.coordinates === false && this.certificates === false && this.alphaNumerics === false &&
          this.advisory === false && this.misc === false) {
          this.snackbar.openSnackBar('Please select atleast 1 information type', 'Warning');
          return;
      }
      this.isSpinnerVisible = true;
      const arr = [];
      let existing = false;
      for (let i = 0; i < this.data.results.length; i++) {
        if (existing) {
            return;
          }
        const sDetails = this.data.results[i];
          // this.searchData = JSON.parse(this.data.searchData);
          if (sDetails.leaseNo) {
              this.searchNumber = sDetails.leaseNo;
              this.filterName = 'Lease Number';
          } else if (sDetails.surveyRecordNo) {
              this.searchNumber = sDetails.surveyRecordNo;
              this.filterName = 'Survey Record Number';
          } else if (sDetails.deedNo) {
              this.searchNumber = sDetails.deedNo;
              this.filterName = 'Deed Number';
          } else if (sDetails.compilationNo) {
              this.searchNumber = sDetails.compilationNo;
              this.filterName = 'Compilation Number';
          }
      const data = {
          templateListItemId: this.templateListItemId,
          searchDetails: sDetails,
          requesterDetails: this.requestorData,
          cartData: {
              diagrams: false,
              general: false,
              spatial: false,
              coordinates: false,
              certificates: false,
              alphaNumerics: false,
              advisory: false,
              misc: false,
              ngi: false,
              diagramsData: null,
              generalData: null,
              spatialData: null,
              coordinateData: null,
              certificatesData: null,
              alphaNumericsData: null,
              advisoryData: null,
              miscData: null,
              ngiData: null
          }
      };
      if (this.diagrams) {
          data.cartData.diagrams = this.diagrams;
          data.cartData.diagramsData = this.diagramsData;
      }
      if (this.general) {
          data.cartData.general = this.general;
          data.cartData.generalData = this.generalData;
      }
      if (this.spatial) {
          data.cartData.spatial = this.spatial;
          data.cartData.spatialData = this.spatialData;
      }
      if (this.certificates) {
          data.cartData.certificates = this.certificates;
          data.cartData.certificatesData = this.certificatesData;
      }
      if (this.alphaNumerics) {
          data.cartData.alphaNumerics = this.alphaNumerics;
          data.cartData.alphaNumericsData = this.alphaNumericsData;
      }
      if (this.coordinates) {
          data.cartData.coordinates = this.coordinates;
          data.cartData.coordinateData = this.coordinateData;
      }
      if (this.advisory) {
          data.cartData.advisory = this.advisory;
          data.cartData.advisoryData = this.advisoryData;
      }
      if (this.misc) {
          data.cartData.misc = this.misc;
          data.cartData.miscData = this.miscData;
      }
      if (this.ngi) {
        data.cartData.ngi = this.ngi;
        data.cartData.ngiData = this.ngiData;
      }
      this.cartId = sessionStorage.getItem('cartId');

      let payload;
      let validCartItem = true;

      if (this.cartId) {
          const existingCartItems = JSON.parse(sessionStorage.getItem('cartItems'));
          existingCartItems.forEach(item => {
              if (item.dataKeyValue === this.data.results[i].lpi) {
                    validCartItem = false;
                    const val = item;
                    val.jsonData = JSON.stringify(item.jsonData);
                    this.isSpinnerVisible = false;
                    existing = true;
                    this.openUpdateDialog(val);
                    return;
              }
          });

          if (existingCartItems.length > 0) {
              if (existingCartItems[0].provinceId !== Number(this.data.searchData.province.provinceId)) {
                existing = true;
                this.snackbar.openSnackBar('Please add item from same province which already added in cart or remove item of another province first to continue', 'Warning');
                this.isSpinnerVisible = false;
                return;
              }
          }

          payload = {
            id: 0,
            cartId: this.cartId,
            dataKey: 'RecordId',
            dataKeyValue: this.queryParam.recordId,
            dated: new Date(),
            jsonData: JSON.stringify(data),
            provinceId: Number(this.data.searchData.province.provinceId),
            searchTypeId: this.data.searchData.searchBy.searchTypeId,
            userId: this.userId
          };
      } else {
          payload = {
            id: 0,
            dataKey: 'RecordId',
            dataKeyValue: this.data.results[i].recordId,
            dated: new Date(),
            jsonData: JSON.stringify(data),
            provinceId: Number(this.data.searchData.province.provinceId),
            searchTypeId: this.data.searchData.searchBy.searchTypeId,
            userId: this.userId
          };
      }

      if (validCartItem) {
        arr.push(payload);
        }
      }
        this.restService.addBulkToCart(arr).subscribe(response => {
            this.diagrams = false;
            this.general = false;
            this.spatial = false;
            this.coordinates = false;
            this.certificates = false;
            this.alphaNumerics = false;
            this.advisory = false;
            this.misc = false;
            this.ngi = false;
            this.diagramsData = [{format: null, type: null}];
            this.generalData = [{format: null, type: null}];
            this.spatialData = [{type: null}];
            this.coordinateData = [{type: null}];
            this.certificatesData = [{certType: null, format: null, type: null}];
            this.alphaNumericsData = [{type: null}];
            this.ngiData = {format: null, notes: null };
            this.advisoryData = '';
            this.miscData = '';
            this.snackbar.openSnackBar('Added to cart', 'Success');
            this.searchService.trigger();
            this.isSpinnerVisible = false;
            this.dialogRef.close();
            this.router.navigate(['search/cart-page']);
    });
  }

  onchange(data, i, doctype, infotype) {
    if (infotype === 126) {
        doctype === 'format' ? this.diagramsData[i].format = data : this.diagramsData[i].type = data;
    } else if (infotype === 125) {
        doctype === 'format' ? this.generalData[i].format = data : this.generalData[i].type = data;
    } else if (infotype === 127) {
        this.spatialData[i].type = data;
    } else if (infotype === 129) {
        doctype === 'format' ?
        this.certificatesData[i].format = data :
        (doctype === 'type' ? this.certificatesData[i].type = data : this.certificatesData[i].certType = data);
    } else if (infotype === 130) {
        this.alphaNumericsData[i].type = data;
    } else if (infotype === 128) {
        this.coordinateData[i].type = data;
    }
  }

  updateCart() {
      if (this.diagrams === false && this.general === false && this.spatial === false &&
          this.coordinates === false && this.certificates === false && this.alphaNumerics === false &&
          this.advisory === false && this.misc === false) {
          this.isSpinnerVisible = false;
          this.snackbar.openSnackBar('Please select atleast 1 information type', 'Warning');
          return;
      }
      this.isSpinnerVisible = true;
      const data = {
          templateListItemId: this.templateListItemId,
          searchDetails: this.searchDetails,
          cartData: {
              diagrams: false,
              general: false,
              spatial: false,
              coordinates: false,
              certificates: false,
              alphaNumerics: false,
              advisory: false,
              misc: false,
              ngi: false,
              diagramsData: null,
              generalData: null,
              spatialData: null,
              coordinateData: null,
              certificatesData: null,
              alphaNumericsData: null,
              advisoryData: null,
              miscData: null,
              ngiData: null
          }
      };
      if (this.diagrams) {
          data.cartData.diagrams = this.diagrams;
          data.cartData.diagramsData = this.diagramsData;
      }
      if (this.general) {
          data.cartData.general = this.general;
          data.cartData.generalData = this.generalData;
      }
      if (this.spatial) {
          data.cartData.spatial = this.spatial;
          data.cartData.spatialData = this.spatialData;
      }
      if (this.certificates) {
          data.cartData.certificates = this.certificates;
          data.cartData.certificatesData = this.certificatesData;
      }
      if (this.alphaNumerics) {
          data.cartData.alphaNumerics = this.alphaNumerics;
          data.cartData.alphaNumericsData = this.alphaNumericsData;
      }
      if (this.coordinates) {
          data.cartData.coordinates = this.coordinates;
          data.cartData.coordinateData = this.coordinateData;
      }
      if (this.advisory) {
          data.cartData.advisory = this.advisory;
          data.cartData.advisoryData = this.advisoryData;
      }
      if (this.misc) {
          data.cartData.misc = this.misc;
          data.cartData.miscData = this.miscData;
      }
      if (this.ngi) {
        data.cartData.ngi = this.ngi;
        data.cartData.ngiData = this.ngiData;
      }
      this.cartId = sessionStorage.getItem('cartId');

      const payload = {
          id: this.itemId,
          cartId: this.cartId,
          dataKey: 'RecordId',
          dataKeyValue: this.searchDetails.recordId,
          dated: new Date(),
          jsonData: JSON.stringify(data),
          provinceId: Number(this.searchData.province.provinceId),
          searchTypeId: this.searchData.searchBy.searchTypeId,
          userId: this.userId
      };

      this.restService.addToCart(payload).subscribe(response => {
          if (response.data.dated) {
              this.diagrams = false;
              this.general = false;
              this.spatial = false;
              this.coordinates = false;
              this.certificates = false;
              this.alphaNumerics = false;
              this.advisory = false;
              this.misc = false;
              this.ngi = false;
              this.diagramsData = [{format: null, type: null}];
              this.generalData = [{format: null, type: null}];
              this.spatialData = [{type: null}];
              this.coordinateData = [{type: null}];
              this.certificatesData = [{certType: null, format: null, type: null}];
              this.alphaNumericsData = [{type: null}];
              this.ngiData = {format: null, notes: null };
              this.advisoryData = '';
              this.miscData = '';
              this.snackbar.openSnackBar('Cart Updated', 'Success');
              this.router.navigate(['search/cart-page']);
          }
          this.searchService.trigger();
          this.isSpinnerVisible = false;
      });
  }

  downloadZip() {
      const imgArr = [];
      this.imageArray.forEach(element => {
          imgArr.push(element.url);
      });
      const obj = {
          'dataKeyName': 'sgdata',
          'documentName': 'sgdata.zip',
          'documentUrl': imgArr,
          'provinceId': this.searchDetails.provinceId,
          'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
      };

      this.restService.downloadZippedImages(obj).subscribe(payload => {
          this.downloadBlob(payload, 'sgdata.zip');
      }, error => {
      });
  }

  downloadBlob(blob, name) {
      // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
      const blobUrl = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');

      // Set link's href to point to the Blob URL
      link.href = blobUrl;
      link.download = name;

      // Append link to the body
      document.body.appendChild(link);

      // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
          new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
          })
      );

      // Remove link from body
      document.body.removeChild(link);
  }

  selectImage(event) {
      this.selectedImageSource = event;
      this.selectedImageID = event.preview;
  }

  checkout() {
      if (this.method === 'add') {
          this.addToCart();
      } else if (this.method === 'update') {
          this.updateCart();
      }
      // this.router.navigate(['/search/cart-page'], {state: {requestorData: this.requestorData}});
  }

  informationTypeByListCodes() {
      this.restService.getInformationType(this.data.results[0].documentSubTypeId, this.data.results[0].documentTypeId)
      .subscribe((res: any) => {
          this.infoData = res.data;
          for (let i = 0; i < this.infoData.length; i++) {
              this.infoData[i].isChecked = false;
          }
          if (this.queryParam) {
            if (this.infoData.filter(x => x.dataTypeId === 131).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 131)[0].isChecked = this.advisory;
                this.advisoryLabel = this.infoData.filter(x => x.dataTypeId === 131)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 130).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 130)[0].isChecked = this.alphaNumerics;
                this.alphaNumericsLabel = this.infoData.filter(x => x.dataTypeId === 130)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 129).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 129)[0].isChecked = this.certificates;
                this.certificatesLabel = this.infoData.filter(x => x.dataTypeId === 129)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 126).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 126)[0].isChecked = this.diagrams;
                this.diagramsLabel = this.infoData.filter(x => x.dataTypeId === 126)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 128).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 128)[0].isChecked = this.coordinates;
                this.coordinatesLabel = this.infoData.filter(x => x.dataTypeId === 128)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 132).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 132)[0].isChecked = this.misc;
                this.miscLabel = this.infoData.filter(x => x.dataTypeId === 132)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 127).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 127)[0].isChecked = this.spatial;
                this.spatialLabel = this.infoData.filter(x => x.dataTypeId === 127)[0].dataType;
            }
            if (this.infoData.filter(x => x.dataTypeId === 125).length > 0) {
                this.infoData.filter(x => x.dataTypeId === 125)[0].isChecked = this.general;
                this.generalLabel = this.infoData.filter(x => x.dataTypeId === 125)[0].dataType;
            }
          }
      });
  }

  changeInfoData(values) {
    switch (values.dataTypeId) {
        case 131:
          this.advisory = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.advisory;
          break;
        case 130:
          this.alphaNumerics = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.alphaNumerics;
          break;
        case 129:
          this.certificates = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.certificates;
          break;
        case 126:
          this.diagrams = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.diagrams;
          break;
        case 128:
          this.coordinates = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.coordinates;
          break;
        case 132:
          this.misc = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.misc;
          break;
        case 127:
          this.spatial = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.spatial;
          break;
        case 125:
          this.general = !values.isChecked;
          this.infoData.filter(x => x.dataType === values.dataType)[0].isChecked = this.general;
          break;
      }
  }

  navigate() {
      this.router.navigate(['/land-profile'], {state: {taskDetail: this.searchDetails.lpi}});
  }

  nvaigateToSeach() {
      this.router.navigate(['/search/search-page'], {state: {reqData: this.requestorData, filterData: this.queryParam}});
  }
}
