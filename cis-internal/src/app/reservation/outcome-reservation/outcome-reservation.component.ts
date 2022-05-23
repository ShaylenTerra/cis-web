import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-outcome-reservation',
  templateUrl: './outcome-reservation.component.html',
  styleUrls: ['./outcome-reservation.component.css']
})
export class OutcomeReservationComponent implements OnInit, OnChanges {
  @Input() draftId;
  @Input() draftData;
  @Input() provinceId;
  @Input() workflowId;
  @Output() outputFromChild: EventEmitter<any> = new EventEmitter();
  showdetails = false;
  constructor() { }

  ngOnInit(): void {
  }

  checkOutcomeData() {
    let resD = this.draftData.reservationDraftSteps.filter(x => x.reservationOutcome.length > 0);
    if (resD.length > 0) {
      this.showdetails = true;
    }
  }

  ngOnChanges() {
    this.draftData = this.draftData;
    this.checkOutcomeData();
  }

}
