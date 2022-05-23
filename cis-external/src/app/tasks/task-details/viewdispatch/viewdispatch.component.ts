import {DatePipe} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
  selector: 'app-viewdispatch',
  templateUrl: './viewdispatch.component.html',
  styleUrls: ['./viewdispatch.component.css']
})
export class ViewdispatchComponent implements OnInit {
  uploadDocForm: FormGroup;
  listItems: any[];
  fileToUpload: File = null;
  docName: string;
  fileUrl: string;
  doctype: number;
  supportingDocuments: any[];
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  constructor(public dialogRef: MatDialogRef<ViewdispatchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private datePipe: DatePipe, private loaderService: LoaderService) {
    dialogRef.disableClose = true;
    this.uploadDocForm = this.fb.group({
      cartItemId: data.value.cartItemId,
      notes: '',
      documentType: '',
      file: {},
      userId: this.userId,
      workflowId: data.value.workflowId,
    });
  }

  ngOnInit(): void {
    this.listItemsByListCode();
    this.getCartItemDocument();
  }

  getCartItemDocument() {
    this.loaderService.display(true);
    this.restService.getCartItemDocument(this.data.value.cartItemId).subscribe(payload => {
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

  listItemsByListCode() {
    this.restService.listItemsByListCode(28).subscribe((res: any) => {
      this.listItems = res.data.filter(x => x.itemCode === 'DOCT004');
      this.doctype = this.listItems[0].itemId;
    });
  }

  selectFile(file: FileList) {

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
  submit() {
    this.loaderService.display(true);
    if (this.uploadDocForm.invalid || this.uploadDocForm.value.file.name === undefined) {
      this.uploadDocForm.get('file').markAsTouched();
      this.uploadDocForm.get('notes').markAsTouched();
      this.loaderService.display(false);
    } else {
      const obj = this.uploadDocForm.value;
      this.restService.uploaddispatchDocs(obj)
        .subscribe((res) => {
          this.getCartItemDocument();
          this.uploadDocForm.patchValue({
            notes: '',
            file: {},
          });
          this.docName = '';
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
        });
    }
  }

  download(document) {
    this.loaderService.display(true);
    this.restService.downloadCartItemsDoc(document.documentId).subscribe((res: any) => {
      this.downloadBlob(res, document.documentName);
      this.loaderService.display(false);
    }, error => {
        this.loaderService.display(false);
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
