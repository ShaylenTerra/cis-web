import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import {NgxGalleryComponent, NgxGalleryImageSize, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-invoice-detail-dialog',
  templateUrl: './invoice-detail-dialog.component.html',
  styleUrls: ['./invoice-detail-dialog.component.scss'],
  providers: [DatePipe]
})
export class InvoiceDetailDialogComponent implements OnInit {
  @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  ItemData;
  deliveryData: any;
  selectedImageSource: any;
  selectedMode;
  deliveryMethodPrice;
  deliveryMedia;
  noOfCD;
  deliveryModePrice;
  tempDeliveryModePrice;
  selectedModes;
  deliveryMedias;
  deliveryMediasdata;
  notes;
  total = 0;
  paymentInfo;
  columns = ['sno', 'Item', 'type', 'details', 'estimate', 'time', 'comment', 'finalCost'];
  showImageLoader: any = false;
  constructor(public dialogRef: MatDialogRef<InvoiceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService,
    private datePipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.galleryOptions = [
        {
          width: '250px',
          height: '360px',
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
    forkJoin([
      this.restService.getListItems(16),
      this.restService.getListItems(18)
  ]).subscribe(([method, media]) => {
      this.selectedModes = method.data;
      this.selectedMode = method.data[0];
      this.deliveryMedias = media.data;
      this.deliveryMedia = media.data[0];
      if (this.selectedMode.caption === 'ELECTRONIC') {
          this.deliveryMediasdata = [];
          for (let i = 0; i < this.deliveryMedias.length; i++) {
              if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
                  this.deliveryMediasdata.push(this.deliveryMedias[i]);
              }
          }
      } else {
          this.deliveryMediasdata = [];
          for (let i = 0; i < this.deliveryMedias.length; i++) {
              if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
              } else {
                  this.deliveryMediasdata.push(this.deliveryMedias[i]);
              }
          }
      }
      if (this.deliveryData !== undefined && this.deliveryData.length === 0) {
          if (this.selectedMode !== undefined) {
              const tempInvData = {
                  'dataTypeListItemId': 0,
                  'formatListItemId': this.selectedMode.itemId,
                  'paperSizeListItemId': 0,
                  'searchDataTypeId': -100,
                  'subTypeListItemId': 0
              };
              this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                  const tempInvoiceData = {
                      'comment': '',
                      'details': '',
                      'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                          Number(response.data.fee),
                      'format': '',
                      'item': this.selectedMode.caption,
                      'lpiCode': -1111111111,
                      'srNo': '',
                      'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                          Number(response.data.fee),
                      'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                          'PER HOUR' : response.data.type
                  };
                  this.deliveryMethodPrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                      Number(response.data.fee);
                  this.ItemData.deliveryMethod = tempInvoiceData;
                  this.calculate();
              });
          }

          if (this.deliveryMedia !== undefined) {
              const tempInvData = {
                  'dataTypeListItemId': 0,
                  'formatListItemId': this.deliveryMedia.itemId,
                  'paperSizeListItemId': 0,
                  'searchDataTypeId': -100,
                  'subTypeListItemId': 0
              };
              this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                  const tempInvoiceData = {
                      'comment': this.notes,
                      'details': '',
                      'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                          Number(response.data.fee),
                      'format': this.noOfCD,
                      'item': this.deliveryMedia.caption,
                      'lpiCode': -1111111111,
                      'srNo': '',
                      'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                          Number(response.data.fee),
                      'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                          'PER HOUR' : response.data.type
                  };
                  this.deliveryModePrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                      Number(response.data.fee);
                  this.tempDeliveryModePrice = this.deliveryModePrice;
                  this.ItemData.deliveryMedium = tempInvoiceData;
                  this.calculate();
              });
          }
      } else if (this.deliveryData !== undefined && this.deliveryData.length > 0) {
          this.ItemData.deliveryMethod = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0];
          this.ItemData.deliveryMedium = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0];
          this.deliveryMethodPrice = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].finalCost;
          const selectedMode = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].item;
          this.selectedMode = this.selectedModes.filter(x => x.caption === selectedMode)[0];

          const deliveryMedia = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].item;
          this.deliveryMedia = this.deliveryMediasdata.filter(x => x.caption === deliveryMedia)[0];
          this.noOfCD = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].type;
          this.deliveryModePrice = this.deliveryData[0].cartInvoiceItems
          .filter(x => x.details === 'Delivery Mode')[0].finalCost / this.noOfCD;
          this.tempDeliveryModePrice = this.deliveryModePrice;
          this.notes = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].comments;

          this.calculate();
      }
  });
  this.getInvoiceData();

  }

  getInvoiceData() {
    this.loaderService.display(true);
    this.restService.getInvoiceData(this.data.workflowId).subscribe(res => {
        if (res.data) {
            this.ItemData = res.data.filter(x => x.searchDetails !== null);
            this.deliveryData = res.data.filter(x => x.searchDetails === null);
            if (this.ItemData.length > 0) {
                for (let i = 0; i < this.ItemData.length; i++) {
                    // const arr1 = this.ItemData[i].searchDetails.preview.split(',').filter(function (el) {
                    //     return el !== '';
                    //   });
                    // this.ItemData[i].searchDetails.tempPreview = arr1;
                    // this.ItemData[i].searchDetails.firstImgPreview = arr1[0];
                    if (this.ItemData[i].searchDetails.leaseNo) {
                        this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.leaseNo;
                        this.ItemData[i].searchDetails.filterName = 'Lease Number';
                    } else if (this.ItemData[i].searchDetails.surveyRecordNo) {
                        this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.surveyRecordNo;
                        this.ItemData[i].searchDetails.filterName = 'Survey Record Number';
                    } else if (this.ItemData[i].searchDetails.deedNo) {
                        this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.deedNo;
                        this.ItemData[i].searchDetails.filterName = 'Deed Number';
                    } else if (this.ItemData[i].searchDetails.compilationNo) {
                        this.ItemData[i].searchDetails.searchNumber = this.ItemData[i].searchDetails.compilationNo;
                        this.ItemData[i].searchDetails.filterName = 'Compilation Number';
                    }
                    this.getDocument(this.ItemData[i].searchDetails.recordId, i);
                }
                // this.selectedImageSource = this.ItemData[0].searchDetails.preview.split(',')[0];
            }
            if (this.deliveryData !== undefined && this.deliveryData.length === 0) {
                if (this.selectedMode !== undefined) {
                    const tempInvData = {
                        'dataTypeListItemId': 0,
                        'formatListItemId': this.selectedMode.itemId,
                        'paperSizeListItemId': 0,
                        'searchDataTypeId': -100,
                        'subTypeListItemId': 0
                    };
                    this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                        const tempInvoiceData = {
                            'comment': '',
                            'details': '',
                            'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'format': '',
                            'item': this.selectedMode.caption,
                            'lpiCode': -1111111111,
                            'srNo': '',
                            'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                                'PER HOUR' : response.data.type
                        };
                        this.deliveryMethodPrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                            Number(response.data.fee);
                        this.ItemData.deliveryMethod = tempInvoiceData;
                        this.calculate();
                    });
                }

                if (this.deliveryMedia !== undefined) {
                    const tempInvData = {
                        'dataTypeListItemId': 0,
                        'formatListItemId': this.deliveryMedia.itemId,
                        'paperSizeListItemId': 0,
                        'searchDataTypeId': -100,
                        'subTypeListItemId': 0
                    };
                    this.restService.getInvoiceItemCosting(tempInvData).subscribe(response => {
                        const tempInvoiceData = {
                            'comment': this.notes,
                            'details': '',
                            'finalCost': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'format': this.noOfCD,
                            'item': this.deliveryMedia.caption,
                            'lpiCode': -1111111111,
                            'srNo': '',
                            'systemEstimate': response.data == null ? 0 : response.data.fee == null ? 0 :
                                Number(response.data.fee),
                            'timeRequiredInHrs': response.data == null ? 'PER HOUR' : response.data.type == null ?
                                'PER HOUR' : response.data.type
                        };
                        this.deliveryModePrice = response.data == null ? 0 : response.data.fee == null ? 0 :
                            Number(response.data.fee);
                        this.tempDeliveryModePrice = this.deliveryModePrice;
                        this.ItemData.deliveryMedium = tempInvoiceData;
                        this.calculate();
                    });
                }
            } else if (this.deliveryData !== undefined && this.deliveryData.length > 0) {
                if (this.selectedModes !== undefined && this.deliveryMedias !== undefined) {
                    this.ItemData.deliveryMethod = this.deliveryData[0].cartInvoiceItems
                    .filter(x => x.details === 'Delivery Method')[0];
                    this.ItemData.deliveryMedium = this.deliveryData[0].cartInvoiceItems
                    .filter(x => x.details === 'Delivery Mode')[0];
                    this.deliveryMethodPrice = this.deliveryData[0].cartInvoiceItems
                    .filter(x => x.details === 'Delivery Method')[0].finalCost;
                    const selectedMode = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Method')[0].item;
                    this.selectedMode = this.selectedModes.filter(x => x.caption === selectedMode)[0];

                    const deliveryMedia = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].item;
                    this.deliveryMedia = this.deliveryMediasdata.filter(x => x.caption === deliveryMedia)[0];
                    this.noOfCD = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].type;
                    this.deliveryModePrice = this.deliveryData[0].cartInvoiceItems
                    .filter(x => x.details === 'Delivery Mode')[0].finalCost / this.noOfCD;
                    this.tempDeliveryModePrice = this.deliveryModePrice;
                    this.notes = this.deliveryData[0].cartInvoiceItems.filter(x => x.details === 'Delivery Mode')[0].comments;
                    this.calculate();
                } else {
                    this.calculate();
                }
            }
        }
        this.loaderService.display(false);
    }, error => {
        this.loaderService.display(false);
    });
}

calculate() {
  this.total = 0;
  for (let i = 0; i < this.ItemData.length; i++) {
      for (let j = 0; j < this.ItemData[i].cartInvoiceItems.length; j++) {
          this.total = this.total + (
              (this.ItemData[i].cartInvoiceItems[j].finalCost !== '' ? this.ItemData[i].cartInvoiceItems[j].finalCost : 0));
      }
  }
  this.total = this.total + (this.deliveryMethodPrice !== undefined ? this.deliveryMethodPrice : 0);
  this.noOfCD = this.noOfCD !== undefined ? this.noOfCD : 1;
  this.deliveryModePrice = ((this.noOfCD !== undefined ? this.noOfCD : 0) *
      (this.tempDeliveryModePrice !== undefined ? this.tempDeliveryModePrice : 0));
  this.total = this.total + this.deliveryModePrice;
}
getDocument(id, i) {
    this.restService.getDcoumentForRecord(id).subscribe(payload => {
        if (this.ItemData !== undefined) {
            this.ItemData[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
            this.ItemData[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
            this.ItemData[i].searchDetails.tempPreview = payload.body.data[0];
            this.ItemData[i].searchDetails.imageArray = [];
            for (let j = 0; j < payload.body.data.length; j++) {
                const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
                this.ItemData[i].searchDetails.imageArray.push(
                    {
                        small: payload.body.data[j].thumbnail,
                        medium: payload.body.data[j].preview,
                        big: payload.body.data[j].preview,
                        description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                        url: payload.body.data[j].url
                    });
                }
            this.galleryImages = this.ItemData[i].searchDetails.imageArray;
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
        }
    }, error => {
    });
}

}
