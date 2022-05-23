import { AfterViewInit, Component, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.css']
})
export class BatchDetailsComponent implements OnInit, OnChanges {
  @Input() showOutcome;
  @Input() tempData;
  @Input() draftData;
  @Input() preview;
  @Input() draftId;
  @Input() provinceId;
  @Input() readonly;
  @Input() workflowId;
  @Input() isTaskDetail;
  @Input() hideData;
  dataSource: any;
  columns = ['documentType', 'purposeType', 'count', 'totalCost'];
  batchcolumns = ['documentType', 'docNumberText'];
  Data: any[] = [];
  paymentDetailsData: any[] = [];
  batchDetailsData: any;
  batchDataSource: any;
  totalAmount = 0;
  totalDoc = 0;
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  constructor(private loaderService: LoaderService, private restService: RestcallService) { }

  ngOnInit(): void {
  }

  issueBatch() {
    const obj = {
      'userId': this.draftData.userId,
      'provinceId': this.draftData.provinceId,
      'draftId': this.draftData.draftId
    };
    this.restService.issueBatchLodgement(obj).subscribe((res) => {
      this.loaderService.display(false);
      this.batchDetailsData = res.data;
      this.batchDataSource = new MatTableDataSource(res.data.lodgementBatchSgDocuments);
    }, error => {
      this.loaderService.display(false);
    });
  }

  downloadAck() {
    this.loaderService.display(true);
    this.restService.getLdgDraftAcknowledement(this.draftId).subscribe((res) => {
      this.downloadBlob(res);
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  downloadBlob(blob) {
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
      this.restService.getDocumentSummary(this.draftId, 0),
      this.restService.getBatchDetails(this.draftId)
    ]).subscribe(([docSummary, batchdetails]) => {
      if (docSummary.data.length > 0) {
        for (let i = 0; i < docSummary.data.length; i++) {
          this.totalDoc = this.totalDoc + docSummary.data[i].count;
          this.totalAmount = this.totalAmount + docSummary.data[i].totalCost;
        }
        this.paymentDetailsData = docSummary.data;
        this.dataSource = new MatTableDataSource(docSummary.data);
        this.dataSource.sort = this.sort.toArray()[0];
        setTimeout(() => this.dataSource.sort = this.sort.toArray()[0]);
      }
      if (batchdetails.data !== null) {
        this.batchDetailsData = batchdetails.data;
        this.batchDataSource = new MatTableDataSource(batchdetails.data.lodgementBatchSgDocuments);
        this.batchDataSource.sort = this.sort.toArray()[1];
        setTimeout(() => this.batchDataSource.sort = this.sort.toArray()[1]);
      }
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  ngOnChanges() {
    this.loadInitialize();
  }
}
