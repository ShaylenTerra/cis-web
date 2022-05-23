import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SearchDetailsDialogComponent } from '../search/search-details/search-details.dialog';
import { ViewMapDialogComponent } from '../search/search-details/view-map/view-map.modal';
import { RestcallService } from '../services/restcall.service';
import { LandprofilenoteDialogComponent } from './landprofilenote-dialog/landprofilenote-dialog.component';
import { TimelineDialogComponent } from './timeline-dialog/timeline-dialog.component';
import { forkJoin } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { RelatedDataComponent } from './related-data/related-data.component';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

export interface TaskHistory {
    date: string;
    user: string;
    action: string;
    duration: string;
}

export interface TitleDeed {
    number: string;
    regDate: string;
    saleDate: string;
    price: string;
}

export interface Notes {
    date: string;
    user: string;
    notes: string;
}

export interface TimelineData {
    dated: string;
    process: string;
    summary: string;
    ref: string;
    action: string;
}

const ELEMENT_DATA: TaskHistory[] = [];

const ELEMENT_DATA_1: TitleDeed[] = [];

const ELEMENT_DATA_2: Notes[] = [];
const timelineData: Array<TimelineData> = [];

const VIEW_MAP_URL = environment.gisServerUrl + '/infomap.aspx?lpi=';
@Component({
    selector: 'app-land-profile',
    templateUrl: './land-profile.component.html',
    styleUrls: ['./land-profile.component.scss'],
    providers: [DatePipe]
})
export class LandProfileComponent implements OnInit {
    @ViewChild('gallery', { static: false }) gallery: NgxGalleryComponent;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[] = [];
    showImageLoader: any = false;
    displayedColumns: string[] = ['date', 'user', 'action', 'duration'];
    dataSource = ELEMENT_DATA;

    displayedColumns1: string[] = ['number', 'regDate', 'saleDate', 'price'];
    dataSource1 = ELEMENT_DATA_1;

    displayedColumns2: string[] = ['noteType', 'userName', 'notes'];
    dataSource2 = ELEMENT_DATA_2;

    timelineCols: Array<string> = ['dated', 'process', 'summary', 'ref', 'action'];
    timelineData = timelineData;
    lpidata;
    lpi: any;
    mapsrc: any;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    selectedImageID = 'image1';
    selectedImageSource: any;
    relatedData: any;
    recordId: any;

    relatedDataColumns: string[] = ['documentType', 'sgno', 'documentNumber', 'documentSubtype', 'description', 'view'];



    constructor(private router: Router, private dom: DomSanitizer,
        private restService: RestcallService, private dialog: MatDialog,
        private snackbar: SnackbarService, private changeDetectorRefs: ChangeDetectorRef,
        private datePipe: DatePipe) {
        if (this.router.getCurrentNavigation().extras.state === undefined) {
            this.router.navigate(['/home']);
        }

        this.lpi = this.router.getCurrentNavigation().extras.state.lpi;
        this.recordId = this.router.getCurrentNavigation().extras.state.recordId;
        this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL + this.lpi);

        this.galleryOptions = [
            {
                width: '330px',
                height: '170px',
                thumbnailsColumns: 3,
                arrowPrevIcon: 'fa fa-chevron-left',
                arrowNextIcon: 'fa fa-chevron-right',
                imageAnimation: NgxGalleryAnimation.Slide,
                imageSize: NgxGalleryImageSize.Contain,
                image: false,
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
        this.showImageLoader = true;
        this.getRelatedDataForLpiCode();
        this.lpiSearch();
    }

    getLpiNotes() {
        this.restService.getLpiNotes(this.lpi.lpi).subscribe((res: any) => {
            if (res.code !== 50000) {
                this.dataSource2 = res.data;
            }
        });
    }

    getRelatedDataForLpiCode() {
        this.restService.getRelatedDateForLpicode(this.lpi, 0).subscribe((res: any) => {
            this.relatedData = res.data;
        });
    }

    lpiSearch() {
        forkJoin([
            this.restService.getDataProfileFromLpiCode(this.recordId)
            // this.restService.getRelatedDateForLpicode(this.lpi, 0)
        ]
        ).subscribe(([profileData]) => {

            this.lpi = profileData.data[0];
            // const arr1 = this.lpi.preview.split(',').filter(function (el) {
            //     return el !== '';
            // });
            // if (arr1.length > 0) {
            //     this.lpi.tempPreview = arr1;
            //     this.lpi.firstImgPreview = arr1[0];
            //     this.selectedImageSource = this.lpi.tempPreview[0];
            // }
            this.getDocument(this.lpi.recordId);
            // set related data
            // this.relatedData = relatedData.body.data;
            this.getLpiNotes();

        }, error => {
            this.snackbar.openSnackBar('Error getting lpi data', 'Error');
        }
        );
    }

    openViewMapDialog(): void {
        this.dialog.open(ViewMapDialogComponent, {
            width: '90%',
            height: '90%',
            data: {
                url: VIEW_MAP_URL + this.lpi
            }
        });
    }

    selectImage(event) {
        this.selectedImageSource = event;
        this.selectedImageID = event.preview;
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(SearchDetailsDialogComponent, {
            width: '750px',
            data: {
                images: this.lpi.imageArray,
                filesize: this.lpi.totalFileSize
            }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    timelineDialog(): void {
        const dialogRef = this.dialog.open(TimelineDialogComponent, {
            width: '750px',
            data: this.dataSource2,
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    addNotes(): void {
        const dialogRef = this.dialog.open(LandprofilenoteDialogComponent, {
            width: '550px',
            autoFocus: false,
            data: this.lpi.lpi
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.getLpiNotes();
        });
    }

    tabClick(event) {
        if (event.index === 1) {

        } else if (event.index === 2) {

        }
    }

    showRelatedDataDetails(sgcode, description, recordId): void {

        const dialogRef = this.dialog.open(RelatedDataComponent, {
            width: '40%',
            height: '90%',
            data: {
                lpi: this.lpi.lpi,
                sgCode: sgcode,
                description: description,
                recordId: recordId
            }
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }

    getDocument(id) {
        this.restService.getDcoumentForRecord(id).subscribe(payload => {
            this.lpi.totalFileSize = payload.headers.get('X-Total-File-Size');
            this.lpi.totalPages = payload.headers.get('X-Total-Count');
            this.lpi.tempPreview = payload.body.data[0];
            this.lpi.imageArray = [];
            for (let j = 0; j < payload.body.data.length; j++) {
                const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');
                this.lpi.imageArray.push(
                    {
                        small: payload.body.data[j].thumbnail,
                        medium: payload.body.data[j].preview,
                        big: payload.body.data[j].preview,
                        description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
                        url: payload.body.data[j].url
                    }
                );
            }
            this.galleryImages = this.lpi.imageArray;
            this.changeDetectorRefs.detectChanges();
            this.showImageLoader = false;
        }, error => {
        });
    }

    downloadImage(event, index) {
        const imageUrl = this.lpi.imageArray[index].url;
        const image: any[] = [];
        image.push(imageUrl);
        const fileName = imageUrl.split('/').pop();
        const obj = {
            'dataKeyName': 'sgdata',
            'documentName': fileName,
            'documentUrl': image,
            'provinceId': this.lpi.provinceId,
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
