import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-upload-lodge-doc-dialog',
  templateUrl: './upload-lodge-doc-dialog.component.html',
  styleUrls: ['./upload-lodge-doc-dialog.component.scss']
})
export class UploadLodgeDocDialogComponent implements OnInit {
  uploadDocForm: FormGroup;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  documentType: any[] = [];
  documentSubType: any[] = [];
  fileToUpload: File = null;
  docName: string;
  fileUrl: string;
  uploadedFileName1 = 'Upload document';
  totalPages: any;
  @ViewChild('gallery', { static: false }) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  showImageLoader: any = false;
  form: FormGroup;
  columns = ['documentName', 'documentType', 'purposeType', 'dated', 'notes', 'Action'];
  dataSource;
  dataLength;
  tableCols: Array<string>;
  dayTimingsCols: Array<string>;
  timings;
  provinces: [];
  startDate;
  startTime;
  endDate;
  endTime;
  occasion;
  province;
  type = 'office';
  table = false;
  otherDocType: any[] = [];
  supportingDocuments: any[] = [
    { 'documentName': "test2" },
    { 'documentName': "test3" },
  ];
  documents: any[] = [];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  imageArray = [];
  selectedImageSource;
  selectedImageID = 'image1';
  downloadStat: any = false;
  totalFileSize: any;
  imgConfig: any;
  dataSourceList: any;
  constructor(public dialogRef: MatDialogRef<UploadLodgeDocDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder, public datePipe: DatePipe,
    private loaderService: LoaderService, private snackbar: SnackbarService, private changeDetectorRefs: ChangeDetectorRef) {
    this.uploadDocForm = this.fb.group({
      notes: '',
      lodgementDocument: '',
      lodgementPurpose: '',
      uploadedFileName: ['', Validators.required],
    });

    this.galleryOptions = [
      {
        width: '300px',
        height: '400px',
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
    this.listItemsByListCodes()
    this.getImageDownloadValue();
    // this.getDocument()
    this.showImageLoader = true;
  }

  getImageDownloadValue() {
    this.restService.getConfigByTag('FILE_UPLOAD_SIZE_MB_LODGEMENT').subscribe(payload => {
      this.imgConfig = payload.data.tagValue;
    }, error => {
    });
  }
  listItemsByListCodes() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.listItemsByListCode(901),
      this.restService.listItemsByListCode(387),
      this.restService.getALlDocumentForRequest(this.data.requestId)
    ]).subscribe(([docTypeData, docSubTypeData, documents]) => {
      this.documentType = docTypeData.data;
      this.documentSubType = docSubTypeData.data;
      this.uploadDocForm.patchValue({
        lodgementDocument: this.data.documentItemId,
        lodgementPurpose: this.data.reasonItemId,
      });
      this.documents = documents.data;
      this.refreshTable();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  selectFile2(file: FileList) {
    const size = Math.round(file[0].size / 1024);
    if (size > this.imgConfig * 1024) {
      this.snackbar.openSnackBar('Upload not possible as file size is greater than  ' + this.imgConfig + 'MB', 'Warning');
    } else {
      this.fileToUpload = file.item(0);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.fileUrl = event.target.value;
      };
      this.uploadedFileName1 = this.fileToUpload.name;
      this.uploadDocForm.patchValue({
        uploadedFileName: this.uploadedFileName1
      });
    }
  }

  getDocument() {
    var recordId = "798"
    this.restService.getDcoumentForRecord(recordId).subscribe(payload => {
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
          this.snackbar.openSnackBar('Download not possible as image size is greater than  ' + this.imgConfig + 'MB', 'Warning');
        }
      }
    }, error => {
    });
  }


  uploadDoc() {
    if (this.uploadDocForm.invalid) {
      this.uploadDocForm.get('uploadedFileName').markAsTouched();
    } else {

      let obj = this.uploadDocForm.value;
      let currentDate = new Date();
      const formData: FormData = new FormData();

      formData.append('draftId', this.data.draftId);
      formData.append('documentItemId', obj.lodgementDocument);
      formData.append('notes', obj.notes);
      formData.append('purposeItemId', obj.lodgementPurpose);
      formData.append('requestId', this.data.requestId);
      formData.append('document', this.fileToUpload);
      formData.append('stepId', this.data.stepId);
      formData.append('dated', this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.sss'));
      formData.append('documentName', obj.uploadedFileName);
      formData.append('userId', this.userId);
      this.loaderService.display(true);
      this.restService.uploadLodgementDocument(formData).subscribe((res: any) => {
        this.loaderService.display(false);
        this.listItemsByListCodes();
        this.uploadDocForm.patchValue({
          notes: '',
          lodgementDocument: '',
          lodgementPurpose: '',
          uploadedFileName: '',
        });
        this.uploadedFileName1 = 'Upload document';
      }, error => {
        this.loaderService.display(false);
      });
    }
  }

  downloadImage(event, index) {
    this.loaderService.display(true);
    const imageUrl = this.imageArray[index].url;
    const image: any[] = [];
    image.push(imageUrl);
    const fileName = imageUrl.split('/').pop();
    const obj = {
      'dataKeyName': 'sgdata',
      'documentName': fileName,
      'documentUrl': image,
      'provinceId': 9,
      'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
    };
    this.restService.downloadSgDataImage(obj).subscribe(payload => {
      this.downloadBlob(payload, fileName);
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  downloadDoc(document) {
    this.loaderService.display(true);
    this.restService.getLdgResDetailDoc(document.documentId).subscribe((res) => {
      this.loaderService.display(false);
      this.downloadBlob(res, document.name);
    }, error => {
      this.loaderService.display(false);
    })
  }

  deleteDoc(document) {
    this.loaderService.display(true);
    this.restService.deleteLdgResDocument(document.documentId).subscribe((res) => {
      this.loaderService.display(false);
      this.listItemsByListCodes();
    }, error => {
      this.loaderService.display(false);
    })
  }

  downloadBlob(blob, name) {
    this.loaderService.display(true);
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    // link.download = name;

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
    this.loaderService.display(false);
  }

  refreshTable() {
    this.dataSourceList = new MatTableDataSource(this.documents);
    // this.dataSourceList.paginator = this.paginator;;
    this.dataSourceList.sort = this.sort;
    // this.dataLength = this.supportingDocuments.length || 0;
  }
}
