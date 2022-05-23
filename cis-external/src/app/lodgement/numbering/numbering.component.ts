import { Component, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AssignNumberDialogComponent } from './assign-number-dialog/assign-number-dialog.component';

@Component({
  selector: 'app-numbering',
  templateUrl: './numbering.component.html',
  styleUrls: ['./numbering.component.css']
})
export class NumberingComponent implements OnInit, OnChanges {
  @Input() showOutcome;
  @Input() tempData;
  @Input() draftData;
  @Input() preview;
  @Input() draftId;
  @Input() provinceId;
  @Input() readonly;
  lodgeDraftData: any[] = [];
  lodgeDocumentDataSource: any = new MatTableDataSource<any>();
  lodgeDocumentcolumns = ['documentName', 'documentType', 'purposeType', 'dated', 'notes', 'assignNumber', 'documentNumber', 'Action'];
  lodgementDocumentData: any[] = [];

  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  constructor(private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getAllLodgementDraftSteps() {
    this.loaderService.display(true);
    this.restService.getAllLodgementDraftSteps(this.draftId).subscribe(payload => {
      this.lodgeDraftData = payload.data;
      for (let i = 0; i < this.lodgeDraftData.length; i++) {
        this.lodgeDraftData[i].totalDocuments = 0;
        for (let j = 0; j < this.lodgeDraftData[i].lodgementDraftRequests.length; j++) {
          this.lodgeDraftData[i].totalDocuments = this.lodgeDraftData[i].totalDocuments +
            this.lodgeDraftData[i].lodgementDraftRequests[j].lodgementDraftDocuments.length;
        }
      }
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  getLodgementAllDocument() {
    this.loaderService.display(true);
    this.restService.getLodgementAllDocument(this.draftId).subscribe(payload => {
      this.lodgementDocumentData = payload.data;
      this.lodgeDocumentDataSource = new MatTableDataSource(this.lodgementDocumentData);
      this.lodgeDocumentDataSource.sort = this.sort;
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }



  assignNumber() {

    const dialogRef = this.dialog.open(AssignNumberDialogComponent, {
      width: '400px',
      height: 'auto',
      data: { draftId: this.draftId, stepId: 0 }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.getAllLodgementDraftSteps();
      this.getLodgementAllDocument();
    });
  }
  ngOnChanges() {
    this.getAllLodgementDraftSteps();
    this.getLodgementAllDocument();
  }

  setDataSourceAttributes() {
    if (this.sort !== undefined) {
      this.lodgeDocumentDataSource.sort = this.sort;
    }
  }

}
