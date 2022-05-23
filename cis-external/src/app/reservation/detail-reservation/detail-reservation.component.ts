import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-detail-reservation',
  templateUrl: './detail-reservation.component.html',
  styleUrls: ['./detail-reservation.component.css']
})
export class DetailReservationComponent implements OnInit, OnChanges {
  @Input() draftId;
  @Input() draftData;
  @Input() provinceId;
  @Input() workflowId;
  @Output() outputFromChild: EventEmitter<any> = new EventEmitter();
  showdetails = false;
  constructor(private loaderService: LoaderService, private snackbar: SnackbarService,
    private restService: RestcallService) { }

  ngOnInit(): void {
    this.checkOutcomeData();
  }

  checkOutcomeData() {
    let resD = this.draftData.reservationDraftSteps.filter(x => x.reservationOutcome.length > 0);
    if (resD.length > 0) {
      this.showdetails = true;      
    }
  }

  issueReservationDetail() {
    this.restService.generateNumberingForLandParcel(this.draftId).subscribe(payload => {
      // this.draftData = payload.data;
      // this.draftId = this.draftData?.draftId;
      this.getDatabyWorkflowId();
      this.loaderService.display(false);

  }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
  });
  }

  getDatabyWorkflowId() {
    this.restService.getReservationDraftByWorkFlowId(this.workflowId).subscribe(payload => {
        this.draftData = payload.data;
        this.draftId = this.draftData?.draftId;
        this.checkOutcomeData();
        this.loaderService.display(false);

    }, error => {
        this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
        this.loaderService.display(false);
    });
}

  ngOnChanges() {
    this.draftData = this.draftData;
    this.checkOutcomeData();
  }

}
