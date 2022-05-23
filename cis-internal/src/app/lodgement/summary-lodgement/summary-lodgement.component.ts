import { Component, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ViewLandMapDialogComponent } from '../../reservation/land-parcel/view-land-map-dialog/view-land-map-dialog.component';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UploadLodgeDocDialogComponent } from '../lodgement-document/upload-lodge-doc-dialog/upload-lodge-doc-dialog.component';
import { LodgementPreviewDialogComponent } from '../lodgement-draft/lodgement-preview-dialog/lodgement-preview-dialog.component';
import { PaymentViewDetailsDialogComponent } from '../payment-details/payment-view-details-dialog/payment-view-details-dialog.component';

@Component({
  selector: 'app-summary-lodgement',
  templateUrl: './summary-lodgement.component.html',
  styleUrls: ['./summary-lodgement.component.css']
})
export class SummaryLodgementComponent implements OnInit, OnChanges {
  @Input() showOutcome;
  @Input() tempData;
  @Input() draftData;
  @Input() preview;
  @Input() draftId;
  @Input() provinceId;
  @Input() readonly;
  lodgeDraftData: any[] = [];
  dataSource;
  dataLength;
  columns = ['documentType', 'purposeType', 'count', 'totalCost'];
  lodgeDocumentDataSource: any;
  lodgeDocumentcolumns = ['documentName', 'documentType', 'purposeType', 'dated', 'notes', 'Action'];
  paymentDetailsData: any[] = [];
  lodgementDocumentData: any[] = [];
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  totalAmount = 0;
  totalDoc = 0;
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  constructor(private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService,
    private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
  }

  // getAllLodgementDraftSteps() {
  //   this.loaderService.display(true);
  //   this.restService.getAllLodgementDraftSteps(this.draftId).subscribe(payload => {
  //     this.lodgeDraftData = payload.data;
  //     if (this.lodgeDraftData !== null) {
  //       for (let i = 0; i < this.lodgeDraftData.length; i++) {
  //         this.lodgeDraftData[i].totalDocuments = 0;
  //         for (let j = 0; j < this.lodgeDraftData[i].lodgementDraftRequests.length; j++) {
  //           this.lodgeDraftData[i].totalDocuments = this.lodgeDraftData[i].totalDocuments +
  //             this.lodgeDraftData[i].lodgementDraftRequests[j].lodgementDraftDocuments.length;
  //         }
  //       }
  //     }
  //     this.loaderService.display(false);

  //   }, error => {
  //     this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
  //     this.loaderService.display(false);
  //   });
  // }

  // getLodgementAllDocument() {
  //   this.loaderService.display(true);
  //   this.restService.getLodgementAllDocument(this.draftId).subscribe(payload => {
  //     this.lodgementDocumentData = payload.data;
  //     this.lodgeDocumentDataSource = new MatTableDataSource(this.lodgementDocumentData);
  //     this.loaderService.display(false);

  //   }, error => {
  //     this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
  //     this.loaderService.display(false);
  //   });
  // }

  refreshtable() {
    this.dataSource = new MatTableDataSource(this.paymentDetailsData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort.toArray()[0];
    this.dataLength = this.dataSource.data.length || 0;
    setTimeout(() => this.dataSource.sort = this.sort.toArray()[0]);
  }

  previewDraft() {
    const dialogRef = this.dialog.open(LodgementPreviewDialogComponent, {
      width: '100%',
      height: 'auto',
      data: {
        value: this.draftData, tempData: this.tempData
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  viewDetails(stepId) {

    const dialogRef = this.dialog.open(PaymentViewDetailsDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { draftId: this.draftId, stepId: stepId }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  // documentCost() {
  //   this.loaderService.display(true);
  //   this.restService.getDocumentSummary(this.draftId, 0).subscribe((res) => {
  //     this.loaderService.display(false);
  //     this.totalAmount = 0;
  //     this.totalDoc = 0;
  //     if (res.data.length > 0) {
  //       for (let i = 0; i < res.data.length; i++) {
  //         this.totalDoc = this.totalDoc + res.data[i].count;
  //         this.totalAmount = this.totalAmount + res.data[i].totalCost;
  //       }
  //       this.paymentDetailsData = res.data;
  //       this.refreshtable();
  //     }

  //   }, error => {
  //     this.loaderService.display(false);
  //   });
  // }

  navigateTaskProfile(workflowId) {
    if (workflowId !== null) {
      this.restService.getWorkFlow(workflowId).subscribe((res) => {
        this.loaderService.display(false);
        this.router.navigate(['/task-profile'], { state: { taskDetail: res.data } });
      });
    } else {
      this.snackbar.openSnackBar('WorkflowId is not available', 'Warning');
    }

  }

  UploadLodgeDoc(stepId, requestId, values, designation) {
    let data = {
      'stepId': stepId,
      'requestId': requestId,
      'draftId': this.draftId,
      'documentItemId': values.documentItemId,
      'reasonItemId': values.reasonItemId,
      'designation': designation
    }
    const dialogRef = this.dialog.open(UploadLodgeDocDialogComponent, {
      width: '70%',
      height: 'auto',
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.loadInitialize();
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

  loadInitialize() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.getAllLodgementDraftSteps(this.draftId),
      this.restService.getDocumentSummary(this.draftId, 0),
      this.restService.getLodgementAllDocument(this.draftId)
    ]).subscribe(([ldgStep, docCost, allDoc]) => {
      this.lodgeDraftData = ldgStep.data;
      if (this.lodgeDraftData !== null) {
        for (let i = 0; i < this.lodgeDraftData.length; i++) {
          this.lodgeDraftData[i].totalDocuments = 0;
          for (let j = 0; j < this.lodgeDraftData[i].lodgementDraftRequests.length; j++) {
            this.lodgeDraftData[i].totalDocuments = this.lodgeDraftData[i].totalDocuments +
              this.lodgeDraftData[i].lodgementDraftRequests[j].lodgementDraftDocuments.length;
          }
        }
      }

      this.totalAmount = 0;
      this.totalDoc = 0;
      if (docCost.data.length > 0) {
        for (let i = 0; i < docCost.data.length; i++) {
          this.totalDoc = this.totalDoc + docCost.data[i].count;
          this.totalAmount = this.totalAmount + docCost.data[i].totalCost;
        }
        this.paymentDetailsData = docCost.data;
        this.refreshtable();
      }

      this.lodgementDocumentData = allDoc.data;
      this.lodgeDocumentDataSource = new MatTableDataSource(this.lodgementDocumentData);
      this.lodgeDocumentDataSource.sort = this.sort.toArray()[1];
      setTimeout(() => this.lodgeDocumentDataSource.sort = this.sort.toArray()[1]);
      this.loaderService.display(false);
    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }
  viewOnMap(stepId, draftId) {
    const dialogRef = this.dialog.open(ViewLandMapDialogComponent, {
      width: '100%',
      height: '99%',
      data: { stepId: stepId, draftId: this.draftId, val: '&from=LDG' }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  ngOnChanges() {
    this.draftData = this.draftData;
    // this.getAllLodgementDraftSteps();
    // this.documentCost();
    // this.getLodgementAllDocument();
    this.loadInitialize();
  }



}
