import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxGalleryAnimation, NgxGalleryComponent, NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-annexure-lodgement',
  templateUrl: './annexure-lodgement.component.html',
  styleUrls: ['./annexure-lodgement.component.scss'],
  // encapsulation: ViewEncapsulation.None,

})
export class AnnexureLodgementComponent implements OnInit, OnChanges {
  @Input() draftData;
  @Input() draftId;
  @Input() readonly;
  @Input() processId;
  @Input() processName;
  @Input() preview;
  @Input() supportingDoc;
  @Input() workflowId;
  @Input() hideData;
  totalPages: any;
  url;
  @ViewChild('gallery', { static: false }) gallery: NgxGalleryComponent;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];
  showImageLoader: any = false;
  form: FormGroup;
  columns = ['name', 'type', 'notes', 'dated', 'Action'];
  data;
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
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  uploadDocForm: FormGroup;
  documentType: any[] = [];
  documentSubType: any[] = [];
  otherDocType: any[] = [];
  fileToUpload: File = null;
  docName: string;
  fileUrl: string;
  uploadedFileName1 = 'Upload document';
  supportingDocuments: any[] = [];
  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  // @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  imageArray = [];
  selectedImageSource;
  selectedImageID = 'image1';
  downloadStat: any = false;
  totalFileSize: any;
  imgConfig: any;
  dataSourceList: any;
  additionalDocuments: any[] = [];
  constructor(public dialog: MatDialog, private snackbar: SnackbarService,
    private restService: RestcallService, private fb: FormBuilder, public datePipe: DatePipe,
    private loaderService: LoaderService, private changeDetectorRefs: ChangeDetectorRef) {
    this.tableCols = ['province', 'timings', 'edit'];
    this.dayTimingsCols = ['day', 'from', 'to'];
    this.uploadDocForm = this.fb.group({
      notes: '',
      documentType: '',
      documentSubType: '',
      pages: '',
      file: {},
      uploadedFileName: '',
      userId: this.userId,
      workflowId: '',
      comment: ''
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
  }
  getImageDownloadValue() {
    this.restService.imageConfig().subscribe(payload => {
      this.imgConfig = payload.data.tagValue;
    }, error => {
    });
  }

  loadInitials() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.listItemsByListCode(28),
      this.restService.getLodgementAnnexure(this.draftId)
    ]).subscribe(([otherDocType, lodgementAnnexure]) => {
      this.otherDocType = otherDocType.data;
      if (lodgementAnnexure.data !== null) {
        if (this.preview === true) {
          this.columns = ['name', 'type', 'notes', 'dated'];
        }
        this.supportingDocuments = lodgementAnnexure.data;
      }
      this.refreshTable();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  selectFile2(file: FileList) {

    this.fileToUpload = file.item(0);
    this.uploadedFileName1 = this.fileToUpload.name;
    this.uploadDocForm.patchValue({
      uploadedFileName: this.fileToUpload.name
    })
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.fileUrl = event.target.value;
    };
    this.docName = this.fileToUpload.name;
    this.uploadDocForm.patchValue({
      file: this.fileToUpload
    });
  }


  getDocument() {
    this.restService.getLodgementAnnexure(this.draftId).subscribe(payload => {

      // this.totalFileSize = payload.headers.get('X-Total-File-Size');
      // this.totalPages = payload.headers.get('X-Total-Count');
      // for (let j = 0; j < payload.data.length; j++) {
      // const scanDate = this.datePipe.transform(payload.body.data[j].scandate, 'dd/MMMM/y HH:mm:ss');

      // let document = payload.data[j].document;
      // let fileName = document.split('/').pop().split('#')[0].split('?')[0];
      // let extension = fileName.split('.').pop()
      // if (extension == 'PDF') {
      //   preview = "assets/images/logos/PDF_file_icon.png"
      // }

      // switch (extension) {
      //   case 'PDF':
      //   case 'pdf':
      //     preview = "assets/images/logos/PDF_file_icon.png"
      //     break;
      //   case 3:
      //     this.searchNumber = data.compilationNo;
      //     break;

      // }
      // this.imageArray.push(
      //   {
      //     small: document,
      //     medium: document,
      //     big: document,
      //     description: '<p>Title: ' + payload.body.data[j].title + '</p><p>Scan Date: ' + scanDate + '</p>',
      //     url: payload.body.data[j].url

      //   }
      // );
      // }
      //   this.galleryImages = this.imageArray;
      //   this.changeDetectorRefs.detectChanges();
      //   this.showImageLoader = false;
      //   this.selectedImageSource = this.imageArray[0];
      //   this.selectedImageID = this.imageArray[0].preview;
      //   if (this.totalFileSize.includes('MB')) {
      //     if (this.totalFileSize.split(' ')[0] < Number(this.imgConfig)) {
      //       this.downloadStat = false;
      //     } else {
      //       this.downloadStat = true;
      //       this.snackbar.openSnackBar('Download not possible as image size is greater than  ' + this.imgConfig + 'MB', 'Warning');
      //     }
      //   }
      // }, error => {
    });
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


  addDocument() {
    if (this.uploadDocForm.invalid) {
      this.uploadDocForm.get('documentType').markAsTouched();
      this.uploadDocForm.get('uploadedFileName').markAsTouched();
    } else {
      let data = this.uploadDocForm.value;
      let name = this.otherDocType.filter(x => x.itemId === data.documentType)[0].caption;
      const formData: FormData = new FormData();
      formData.append('draftId', this.draftId);
      formData.append('name', name);
      formData.append('notes', data.notes,);
      formData.append('typeItemId', data.documentType);
      formData.append('userId', this.userId);
      formData.append('document', this.fileToUpload);
      this.loaderService.display(true);
      this.restService.addLodgementAnnexure(formData).subscribe((res: any) => {
        this.uploadDocForm.reset();
        this.uploadedFileName1 = 'Upload document';
        this.loaderService.display(false);
        this.loadInitials();
      }, error => {
        this.loaderService.display(false);
      });
    }
  }

  ngOnChanges() {
    if (this.workflowId !== undefined) {
      this.uploadDocForm.patchValue({
        comment: '',
        documentType: '',
        file: {},
        userId: this.userId,
        workflowId: this.workflowId
      });
      this.getSupportingDocuments();
    }
    this.loadInitials();
    this.getImageDownloadValue();
    // this.getDocument()
    this.showImageLoader = true;

    if (this.preview === true) {
      this.columns = ['name', 'type', 'notes', 'dated'];
    }
  }

  downloadsupportingDoc(document) {
    this.restService.getAnnexureDocument(document.annexureId).subscribe((res) => {
      this.downloadBlob(res, document.name);
    })
  }

  deleteSupportingDoc(document) {
    this.loaderService.display(true);
    this.restService.removeAnnexure(document.annexureId).subscribe((res) => {

      if (res.code === 50000) {
        this.snackbar.openSnackBar(`Error occured`, 'Error');
        this.loaderService.display(false);
      } else {
        this.snackbar.openSnackBar(`Annexure document deleted`, 'Success');
        this.loadInitials();
        this.loaderService.display(false);
      }
    })
  }

  refreshTable() {
    this.dataSourceList = new MatTableDataSource(this.supportingDocuments);
    this.dataSourceList.paginator = this.paginator;;
    this.dataSourceList.sort = this.sort;
    this.dataLength = this.supportingDocuments.length || 0;
  }

  submitDoc() {
    this.loaderService.display(true);
    const obj = this.uploadDocForm.value;
    this.restService.uploadSupportingDocs(obj)
      .subscribe((res) => {
        this.getSupportingDocuments();
        this.uploadDocForm.patchValue({
          comment: '',
          documentType: '',
          file: {},
        });
        this.docName = '';
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });
  }
  getSupportingDocuments() {
    this.loaderService.display(true);
    this.restService.getSupportingDocuments(this.workflowId).subscribe(payload => {
      this.additionalDocuments = payload.data;

      this.loaderService.display(false);
    },
      error => {
        this.loaderService.display(false);
        if (error.message === 'No tasks found.') {
          this.snackbar.openSnackBar('No tasks found.', 'Message');
        } else {
          this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
        }
      });
  }

  deleteDoc2(doc) {
    this.loaderService.display(true);
    const docId = doc.documentId;
    const workflowI = doc.workflowId;
    this.restService.deleteWorkflowDocs(docId, workflowI).subscribe((res) => {
      this.getSupportingDocuments();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  downloaddoc2(doc) {
    this.loaderService.display(true);
    const docId = doc.documentId;
    this.restService.downloadWorkflowSupportingDocs(docId).subscribe((res) => {
      this.downloadBlob(res, doc.documentName);
      this.getSupportingDocuments();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  setDataSourceAttributes() {
    if (this.sort !== undefined) {
      this.dataSourceList.sort = this.sort;
    }
  }
}
