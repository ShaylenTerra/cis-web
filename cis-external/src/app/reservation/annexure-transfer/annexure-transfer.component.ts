import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { ReservationTransferPreviewComponent } from '../reservation-draft/reservation-transfer-preview/reservation-transfer-preview.component';

@Component({
  selector: 'app-annexure-transfer',
  templateUrl: './annexure-transfer.component.html',
  styleUrls: ['./annexure-transfer.component.css']
})
export class AnnexureTransferComponent implements OnInit {
  @Input() draftId;
  @Input() readonly;
  @Input() supportingDoc;
  @Input() draftData: any;
  @Input() workflowId;
  @Input() resubmitData;
  @Input() processId;
  annexure;
  layoutDoc: any[] = [];
  consentDoc: any[] = [];
  additionalDoc: any[] = [];
  fileToUpload1: File = null;
  uploadedFileName1 = 'Upload document';
  supportingDocuments: any[];
  fileToUpload: File = null;
  docName: string;
  fileUrl: string;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  uploadDocForm: FormGroup;
  listItems: any[];
  constructor(private restService: RestcallService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private dialog: MatDialog) {
    this.uploadDocForm = this.fb.group({
      comment: '',
      documentType: '',
      file: {},
      userId: this.userId,
      workflowId: ''
    });
  }

  ngOnInit(): void {
    this.getAnnexurebyDraftId();
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
  }

  getAnnexurebyDraftId() {
    this.listItemsByListCode();
    this.restService.getAnnexurebyDraftId(this.draftId).subscribe(payload => {
      this.annexure = payload.data;
      if (this.annexure !== null) {
        this.layoutDoc = this.annexure.filter(x => x.typeId === 746);
        this.consentDoc = this.annexure.filter(x => x.typeId === 747);
        this.additionalDoc = this.annexure.filter(x => x.typeId === 748);
      }
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  selectFile(event, typeId) {
    this.loaderService.display(true);
    this.fileToUpload1 = event.target.files[0];
    const obj = {
      'document': this.fileToUpload1,
      'typeId': typeId,
      'draftId': this.draftId
    };
    this.restService.uploadAddAnnexure(obj)
      .subscribe((res) => {
        this.getAnnexurebyDraftId();
      }, error => {
        this.loaderService.display(false);
      });
  }

  deleteDoc(doc) {
    this.loaderService.display(true);
    const docId = doc.documentId;
    this.restService.deleteAnnexure(docId).subscribe((res) => {
      this.getAnnexurebyDraftId();
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  downloaddoc(doc) {
    this.loaderService.display(true);
    const docId = doc.documentId;
    this.restService.downloadWorkAnnexureFile(docId).subscribe((res) => {
      this.downloadBlob(res, doc.documentName);
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

  previewDraft() {
    // if()
    const dialogRef = this.dialog.open(ReservationTransferPreviewComponent, {
      width: '100%',
      height: 'auto',
      data: { draftData: this.draftData, resubmitData: this.resubmitData }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  ngOnChanges() {
  }


  listItemsByListCode() {
    this.restService.listItemsByListCode(28).subscribe((res: any) => {
      this.listItems = res.data;
    });
  }

  getSupportingDocuments() {
    this.loaderService.display(true);
    this.restService.getSupportingDocuments(this.workflowId).subscribe(payload => {
      this.supportingDocuments = payload.data;

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

  selectFile2(file: FileList) {

    this.fileToUpload = file.item(0);


    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.fileUrl = event.target.value;
    };
    this.docName = this.fileToUpload.name;
    this.uploadDocForm.patchValue({
      file: this.fileToUpload
    });
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
}
