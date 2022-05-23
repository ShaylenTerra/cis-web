import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AddAcknowledgementComponent } from './add-acknowledgement/add-acknowledgement.component';
import { DeleteConditionComponent } from './delete-condition/delete-condition.component';

@Component({
  selector: 'app-acknowledgement-letter',
  templateUrl: './acknowledgement-letter.component.html',
  styleUrls: ['./acknowledgement-letter.component.css']
})
export class AcknowledgementLetterComponent implements OnInit, OnChanges {
  @Input() draftData;
  @Input() draftId;
  tableColumns: string[] = ['Reason', 'Reference', 'Condition', 'Action'];
  dataSource: any;
  resCondition: any[] = [];
  constructor(private dialog: MatDialog, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.getReservationConditions();
  }

  getReservationConditions() {
    this.loaderService.display(true);
    this.restService.getReservationConditions(this.draftId).subscribe(payload => {
      this.resCondition = payload.data;
      this.dataSource = new MatTableDataSource(this.resCondition);
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  addAcknowledgement() {
    const dialogRef = this.dialog.open(AddAcknowledgementComponent, {
      width: '550px',
      height: 'auto',
      data: { resDraftSteps: this.draftData.reservationDraftSteps, value: null }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== 1) {
        this.getReservationConditions();
      }
    });
  }

  editAcknowledgement(data) {
    const dialogRef = this.dialog.open(AddAcknowledgementComponent, {
      width: '550px',
      height: 'auto',
      data: { resDraftSteps: this.draftData.reservationDraftSteps, value: data }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== 1) {
        this.getReservationConditions();
      }
    });
  }

  deleteAcknowledgement(data) {
    const dialogRef = this.dialog.open(DeleteConditionComponent, {
      width: '50%',
      data: data.conditionId
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res !== 1) {
        this.getReservationConditions();
      }
    });
  }

  ngOnChanges() {
    this.draftData = this.draftData;
  }

  downloadAckLetter() {
    this.loaderService.display(true);
    this.restService.downloadAckLetter(this.draftId).subscribe((res: any) => {
      this.downloadBlob(res, 'acknowledgeLetter.pdf');
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

}
