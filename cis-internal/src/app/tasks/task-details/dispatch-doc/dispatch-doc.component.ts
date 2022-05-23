import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-dispatch-doc',
  templateUrl: './dispatch-doc.component.html',
  styleUrls: ['./dispatch-doc.component.css']
})
export class DispatchDocComponent implements OnInit {

    dispatchDetails: any;
    form: FormGroup;
    isSpinnerVisible = false;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<DispatchDocComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private datePipe: DatePipe, private loaderService: LoaderService) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
      this.getDispatchDocs();
    }

    getDispatchDocs() {
      this.loaderService.display(true);
      this.restService.getDispatchDocs(this.data.workflowId).subscribe((res: any) => {
        this.dispatchDetails = res.data;
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });
    }


    downloadZip() {
      this.loaderService.display(true);
      this.restService.downloadZippedDocs(this.data.workflowId).subscribe((payload: any) => {
        this.downloadBlob(payload, 'dispatchdoc.zip');
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });
    }


    processFTP() {
    this.restService.uploadDispatchDocsToFtp(this.data.workflowId).subscribe((res: any) => {
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

  sendDispatchEmail() {
    this.loaderService.display(true);
      this.restService.sendDispatchEmail(this.data.workflowId).subscribe((payload: any) => {
        this.snackbar.openSnackBar('Dispatch email sent', 'Success');
        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });
  }

}
