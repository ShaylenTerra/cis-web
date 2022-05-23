import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import {NgxGalleryComponent, NgxGalleryImageSize, NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-inforequestitem-dialog',
  templateUrl: './inforequestitem-dialog.component.html',
  styleUrls: ['./inforequestitem-dialog.component.scss'],
  providers: [DatePipe]
})
export class InforequestitemDialogComponent implements OnInit {
  @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  infoReview: any;
  selectedImageSource: any;
  columnType1 = ['sno', 'format', 'type'];
  columnType2 = ['sno', 'certType', 'format', 'type'];
  diagramColumns = ['sno', 'format', 'type'];
  columnType3 = ['sno', 'type'];
  selectedImageID = 'image1';
  showImageLoader: any = false;
  formatType;
  constructor(public dialogRef: MatDialogRef<InforequestitemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService,
    private datePipe: DatePipe, private changeDetectorRefs: ChangeDetectorRef) {
      this.galleryOptions = [
        {
          width: '335px',
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
    this.getInformationRequestItem();
    this.getFormatList();
  }

  getInformationRequestItem() {
    this.loaderService.display(true);
    this.restService.getInformationRequestItem(this.data.workflowId).subscribe(response => {
        this.infoReview = response.data.json;
        if (this.infoReview.length > 0) {
            for (let i = 0; i < this.infoReview.length; i++) {
                // const arr1 = this.infoReview[i].searchDetails.preview.split(',').filter(function (el) {
                //     return el !== '';
                //   });
                // this.infoReview[i].searchDetails.tempPreview = arr1;
                // this.infoReview[i].searchDetails.firstImgPreview = arr1[0];
                if (this.infoReview[i].searchDetails.leaseNo) {
                  this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.leaseNo;
                  this.infoReview[i].searchDetails.filterName = 'Lease Number';
              } else if (this.infoReview[i].searchDetails.surveyRecordNo) {
                  this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.surveyRecordNo;
                  this.infoReview[i].searchDetails.filterName = 'Survey Record Number';
              } else if (this.infoReview[i].searchDetails.deedNo) {
                  this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.deedNo;
                  this.infoReview[i].searchDetails.filterName = 'Deed Number';
              } else if (this.infoReview[i].searchDetails.compilationNo) {
                  this.infoReview[i].searchDetails.searchNumber = this.infoReview[i].searchDetails.compilationNo;
                  this.infoReview[i].searchDetails.filterName = 'Compilation Number';
              }
              this.getDocument(this.infoReview[i].searchDetails.recordId, i);
            }
            // this.selectedImageSource = this.infoReview[0].searchDetails.preview.split(',')[0];
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
        if (this.infoReview !== undefined) {
            this.infoReview[i].searchDetails.totalFileSize = payload.headers.get('X-Total-File-Size');
            this.infoReview[i].searchDetails.totalPages = payload.headers.get('X-Total-Count');
            this.infoReview[i].searchDetails.tempPreview = payload.body.data[0];
            this.infoReview[i].searchDetails.imageArray = [];
            for (let j = 0; j < payload.body.data.length; j++) {
              const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
              this.infoReview[i].searchDetails.imageArray.push(
                  {
                      small: payload.body.data[j].thumbnail,
                      medium: payload.body.data[j].preview,
                      big: payload.body.data[j].preview,
                      description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                      url: payload.body.data[j].url
                  });
              }
            this.galleryImages = this.infoReview[i].searchDetails.imageArray;
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
        }
    }, error => {
    });
}

getFormatList() {
  this.loaderService.display(true);
  this.restService.getListItems(226).subscribe(response => {
      this.formatType = response.data;
      this.loaderService.display(false);
  }, error => {
      this.loaderService.display(false);
  });
}

}
