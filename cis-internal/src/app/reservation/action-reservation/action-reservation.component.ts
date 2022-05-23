import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReservationAction } from '../../constants/enums';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { ConfirmDecisionComponent } from '../../tasks/task-details/confirm-decision/confirm-decision.component';

@Component({
  selector: 'app-action-reservation',
  templateUrl: './action-reservation.component.html',
  styleUrls: ['./action-reservation.component.css']
})
export class ActionReservationComponent implements OnInit {
  form: FormGroup;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  uploadedFileName1 = 'Upload document';
  constructor(public dialogRef: MatDialogRef<ActionReservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private router: Router) {
    dialogRef.disableClose = true;
    this.form = this.fb.group({
      actionTakenId: '',
      processId: data.res.processId,
      loggedUserId: this.userId,
      notes: ['', Validators.required],
      context: 'This is context',
      type: 1,
      processData: 'largedata',
      currentNodeId: data.res.nodeId,
      actionId: data.res.actionId,
      assignedToUserId: this.userId
    });
  }

  ngOnInit(): void {
  }

  submit() {
    // this.loaderService.display(true);
    // const decision = this.form.value;
    // this.restService.processtask(decision).subscribe((res: any) => {
    //   this.loaderService.display(false);
    this.secondProcess();
    // }, error => {
    //   this.loaderService.display(false);
    // });
  }

  secondProcess() {
    this.loaderService.display(true);
    const decision = this.form.value;
    decision.actionTakenId = this.data.actionTakenId;
    this.restService.processtask(decision).subscribe((res: any) => {
      this.decisionDialog(res);
      this.loaderService.display(false);
      this.addUserNotification();
      let notify = {
        context: this.data.value,
        referenceNumber: res.referenceNumber,
        templateId: res.templateId,
        transactionId: res.transactionId,
        workflowId: res.workflowId
      }
      this.notifyReservation(notify);
      this.dialogRef.close(0);
    }, error => {
      this.loaderService.display(false);
    });
  }

  decisionDialog(data): void {
    const dialogRef = this.dialog.open(ConfirmDecisionComponent, {
      width: '546px',
      data: { value: data }
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
      this.router.navigate(['reservation/reservation-list']);
    });
  }

  addUserNotification() {
    const decision = this.form.value;

    const notification = {
      'loggedInUserId': this.userId,
      'notifyUserId': this.userId,
      'subject': this.data.res.processName + ': ' + this.data.res.actionRequiredCaption + ' ' + this.data.res.referenceNumber,
      'description': decision.notes,
      'contextTypeId': 5055,
      'contextId': this.data.res.workflowId

    };

    this.restService.addUserNotification(notification).subscribe(async (result) => { });

  }

  notifyReservation(val) {
    this.loaderService.display(true);
    this.restService.notifyForReservation(val).subscribe((res: any) => {
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
