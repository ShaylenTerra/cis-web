import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-related-data',
  templateUrl: './related-data.component.html',
  styleUrls: ['./related-data.component.scss'],
  providers: [DatePipe]
})
export class RelatedDataComponent implements OnInit {

  @ViewChild('gallery', {static: false}) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  showImageLoader: any = false;
  selectedImageSource: any;
  selectedImageID = 'image1';
  lpiObject: any;
  parcelDescription: string;
  tooltip: string;
  recordId: any;
  imgData: any = {
    totalFileSize: '',
    totalPages: '',
    tempPreview: '',
    imageArray: [],
    provinceId: ''
  };

  constructor(private restService: RestcallService, private snackbar: SnackbarService
      , @Inject(MAT_DIALOG_DATA) public data: any, private changeDetectorRefs: ChangeDetectorRef,
      private datePipe: DatePipe) {
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

  ngOnInit(): void {
    const description = this.data.description === null ? '' : ' - ' + this.data.description;
    const tooltipDescription = description === '' ? description : ' - Description';
    this.parcelDescription = this.data.sgCode + description;
    this.tooltip = 'SG Code' + tooltipDescription;
    this.recordId = this.data.recordId;
    this.showImageLoader = true;
    this.getDocument();
  }

  getDocument() {
    this.restService.getDcoumentForRecord(this.recordId).subscribe(payload => {
        this.imgData.totalFileSize = payload.headers.get('X-Total-File-Size');
        this.imgData.totalPages = payload.headers.get('X-Total-Count');
        this.imgData.tempPreview = payload.body.data[0];
        this.imgData.imageArray = [];
        for (let j = 0; j < payload.body.data.length; j++) {
            const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
            this.imgData.imageArray.push(
                {
                    small: payload.body.data[j].thumbnail,
                    medium: payload.body.data[j].preview,
                    big: payload.body.data[j].preview,
                    description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                    url: payload.body.data[j].url
                }
            );
        }
        this.galleryImages = this.imgData.imageArray;
        this.changeDetectorRefs.detectChanges();
        this.showImageLoader = false;
    }, error => {
    });
  }
  downloadImage(event, index) {
    const imageUrl = this.imgData.imageArray[index].url;
    const image: any[] = [];
    image.push(imageUrl);
    const fileName = imageUrl.split('/').pop();
    const obj = {
        'dataKeyName': 'sgdata',
        'documentName': fileName,
        'documentUrl': image,
        'provinceId': this.imgData.provinceId,
        'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
    };
    this.restService.downloadSgDataImage(obj).subscribe(payload => {
        this.downloadBlob(payload, fileName);
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
}
