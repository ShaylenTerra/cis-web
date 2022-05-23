import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import {NgxGalleryComponent, NgxGalleryImageSize, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-dispatch-detail-dialog',
  templateUrl: './dispatch-detail-dialog.component.html',
  styleUrls: ['./dispatch-detail-dialog.component.scss'],
  providers: [DatePipe]
})
export class DispatchDetailDialogComponent implements OnInit {
  @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  DispatchItemData;
  selectedImageID = 'image1';
  dispatchRefNo;
  dispatchDate;
  dispatchData;
  dispatchMethodName;
  DispatchItemDeliveryData: any;
  selectedImageSource: any;
  dispatchMethod: FormGroup;
  dispatchcolumns = ['sno', 'Item', 'type', 'details', 'time', 'comment', 'prepared'];
  showImageLoader: any = false;
  constructor(public dialogRef: MatDialogRef<DispatchDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService,
    private datePipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef) {
      this.dispatchMethod = this.fb.group({
        primaryEmail: '',
        secondaryEmail: '',
        referenceNumber: '',
        dataDispatched: '',
        collectorName: '',
        collectorSurname: '',
        collectorContactNumber: '',
        postaladdressLine1: '',
        postaladdressLine2: '',
        postaladdressLine3: '',
        postalCode: '',
        courierName: '',
        contactPerson: '',
        ftpDetails: '',
    });
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
     }

  ngOnInit(): void {
    this.showImageLoader = true;
    this.getInformationRequestDispatchItem();
  }

  getInformationRequestDispatchItem() {
    this.loaderService.display(true);
    this.restService.getDispatchTemplateData(this.data.workflowId).subscribe(response => {
        if (response.data) {
            this.DispatchItemData = response.data.filter(x => x.searchDetails !== null);
            const temp = response.data.filter(x => x.searchDetails === null)[0];
            if (temp !== null && temp !== undefined) {
                this.dispatchMethodName = temp.cartDispatchItems.filter(x => x.details === 'Delivery Method')[0].item;
                if (temp.cartDispatchItems.filter(x => x.details === 'Delivery Method')[0].item !== 'ELECTRONICS') {
                    this.DispatchItemDeliveryData = temp.cartDispatchItems.filter(x => x.details === 'Delivery Method')[0].item;
                } else {
                    this.DispatchItemDeliveryData = temp.cartDispatchItems.filter(x => x.details === 'Delivery Mode')[0].item;
                }
                const cartDispatchAdditionalInfo = temp.cartDispatchAdditionalInfo;
                this.dispatchMethod.patchValue({
                  primaryEmail: cartDispatchAdditionalInfo.primaryEmail,
                  secondaryEmail: cartDispatchAdditionalInfo.secondaryEmail,
                  referenceNumber: cartDispatchAdditionalInfo.referenceNumber,
                  dataDispatched: cartDispatchAdditionalInfo.dataDispatched,
                  collectorName: cartDispatchAdditionalInfo.collectorName,
                  collectorSurname: cartDispatchAdditionalInfo.collectorSurname,
                  collectorContactNumber: cartDispatchAdditionalInfo.collectorContactNumber,
                  postaladdressLine1: cartDispatchAdditionalInfo.postaladdressLine1,
                  postaladdressLine2: cartDispatchAdditionalInfo.postaladdressLine2,
                  postaladdressLine3: cartDispatchAdditionalInfo.postaladdressLine3,
                  postalCode: cartDispatchAdditionalInfo.postalCode,
                  courierName: cartDispatchAdditionalInfo.courierName,
                  contactPerson: cartDispatchAdditionalInfo.contactPerson,
                  ftpDetails: cartDispatchAdditionalInfo.ftpDetails,
              });
                this.dispatchRefNo = cartDispatchAdditionalInfo.referenceNumber;
                // this.dispatchDate = cartDispatchAdditionalInfo.dataDispatched;
                this.dispatchData = cartDispatchAdditionalInfo.dataDispatched;
            }
            if (this.DispatchItemData !== null || this.DispatchItemData !== undefined) {
                if (this.DispatchItemData.length > 0) {
                    for (let i = 0; i < this.DispatchItemData.length; i++) {
                        // const arr1 = this.DispatchItemData[i].searchDetails.preview.split(',').filter(function (el) {
                        //     return el !== '';
                        //   });
                        // this.DispatchItemData[i].searchDetails.tempPreview = arr1;
                        // this.DispatchItemData[i].searchDetails.firstImgPreview = arr1[0];
                        if (this.DispatchItemData[i].searchDetails.leaseNo) {
                          this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.leaseNo;
                          this.DispatchItemData[i].searchDetails.filterName = 'Lease Number';
                      } else if (this.DispatchItemData[i].searchDetails.surveyRecordNo) {
                          this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.surveyRecordNo;
                          this.DispatchItemData[i].searchDetails.filterName = 'Survey Record Number';
                      } else if (this.DispatchItemData[i].searchDetails.deedNo) {
                          this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.deedNo;
                          this.DispatchItemData[i].searchDetails.filterName = 'Deed Number';
                      } else if (this.DispatchItemData[i].searchDetails.compilationNo) {
                          this.DispatchItemData[i].searchDetails.searchNumber = this.DispatchItemData[i].searchDetails.compilationNo;
                          this.DispatchItemData[i].searchDetails.filterName = 'Compilation Number';
                      }
                      this.getDocument(this.DispatchItemData[i].searchDetails.recordId, i);
                    }
                    // this.selectedImageSource = this.DispatchItemData[0].searchDetails.preview.split(',')[0];
                }
                // this.selectedImageSource = this.DispatchItemData[0].searchDetails.preview.split(',')[0];
            }
        } else {
            this.DispatchItemData = [];
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
      if (this.DispatchItemData !== undefined) {
          this.DispatchItemData[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
          this.DispatchItemData[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
          this.DispatchItemData[i].searchDetails.tempPreview = payload.body.data[0];
          this.DispatchItemData[i].searchDetails.imageArray = [];
          for (let j = 0; j < payload.body.data.length; j++) {
            const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
            this.DispatchItemData[i].searchDetails.imageArray.push(
                {
                    small: payload.body.data[j].thumbnail,
                    medium: payload.body.data[j].preview,
                    big: payload.body.data[j].preview,
                    description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                    url: payload.body.data[j].url
                });
            }
            this.galleryImages = this.DispatchItemData[i].searchDetails.imageArray;
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
      }
  }, error => {
  });
}

}
