import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IUser } from '../../interface/user.interface';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AddtodiaryDialogComponent } from '../../tasks/task-details/addtodiary-dialog/addtodiary-dialog.component';
import { CanceltaskDialogComponent } from '../../tasks/task-details/canceltask-dialog/canceltask-dialog.component';
import { ChangeprovinceDialogComponent } from '../../tasks/task-details/changeprovince-dialog/changeprovince-dialog.component';
import { ConfirmDecisionComponent } from '../../tasks/task-details/confirm-decision/confirm-decision.component';
import { EmployeedetailsComponent } from '../../tasks/task-details/employeedetails/employeedetails.component';
import { ExpeditetaskDialogComponent } from '../../tasks/task-details/expeditetask-dialog/expeditetask-dialog.component';
import { MarkAsPendingComponent } from '../../tasks/task-details/mark-as-pending/mark-as-pending.component';
import { SendsectionDialogComponent } from '../../tasks/task-details/sendsection-dialog/sendsection-dialog.component';
import { UserinfoDialogComponent } from '../../tasks/task-details/userinfo-dialog/userinfo-dialog.component';

@Component({
  selector: 'app-reservation-decision',
  templateUrl: './reservation-decision.component.html',
  styleUrls: ['./reservation-decision.component.css']
})
export class ReservationDecisionComponent implements OnInit {
  @Input() draftData;
  @Input() readonly;
  @Input() taskDetail;
  @Input() workflowId;
  @Input() draftId;
  decisionform: FormGroup;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  assignUser: any;
  notes = '';
  protected _onDestroySearchUser = new Subject<void>();
  users: IUser[];
  @ViewChild('searchUserSelect') searchUserSelect: MatSelect;
  public searchUserFilterCtrl: FormControl = new FormControl();
  public assignedFilteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  assignDecisionUser: any;
  tooltipText: any;
  nodeDetails: any;
  outLinks: any[] = [];
  decisionSelected: any = true;
  nodedetailsnext: any;
  nextOutLinks: any[] = [];
  formHeading: string;
    formDescription: string;
  constructor(private router: Router, private dialog: MatDialog,
    private restService: RestcallService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private loaderService: LoaderService) {
      this.decisionform = this.fb.group({
        actionTakenId: '',
        processId: '',
        loggedUserId: '',
        notes: ['', Validators.required],
        context: '',
        type: '',
        processData: '',
        currentNodeId: '',
        actionId: '',
        assignedToUserId: '' // ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.decisionform.patchValue({
      actionTakenId: 241,
      processId: this.taskDetail.processId,
      loggedUserId: this.userId,
      notes: '',
      context: 'This is context',
      type: 1,
      processData: 'largedata',
      currentNodeId: this.taskDetail.nodeId,
      actionId: this.taskDetail.actionId,
      assignedToUserId: this.userId // ['', Validators.required]
    });
    this.getNodeDetails();
  }

  MarkAsPending(): void {
    const dialogRef = this.dialog.open(MarkAsPendingComponent, {
        width: '750px',
        data: { value: this.taskDetail },
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
      if (resultCode !== 1) {
        this.router.navigate(['/tasks/task-list']);
      }
    });
}

userdailogReassign(): void {
  const dialogRef = this.dialog.open(UserinfoDialogComponent, {
      width: '750px',
      data: { value: 'ReAssign', actionId: this.taskDetail.actionId },
      autoFocus: false
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

changeProvince(): void {
  const dialogRef = this.dialog.open(ChangeprovinceDialogComponent, {
      width: '750px',
      autoFocus: false,
      data: { value: this.taskDetail },
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

userdailogReferralinfo(): void {
  const dialogRef = this.dialog.open(UserinfoDialogComponent, {
      width: '750px',
      data: { value: 'Referral Information', data: this.taskDetail, actionId: this.taskDetail.actionId },
      autoFocus: false
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
      if (resultCode !== 1) {
        this.router.navigate(['/tasks/task-list']);
      }
  });
}

cancelTask(): void {
  const dialogRef = this.dialog.open(CanceltaskDialogComponent, {
      width: '750px',
      data: { value: this.taskDetail },
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

addToDiary(): void {
  const dialogRef = this.dialog.open(AddtodiaryDialogComponent, {
      width: '750px',
      data: { value: this.taskDetail.workflowId, actionId: this.taskDetail.actionId },
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

expediteTask(): void {
  const dialogRef = this.dialog.open(ExpeditetaskDialogComponent, {
      width: '750px',
      data: { value: this.taskDetail.workflowId },
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

reopenTask(): void {
  const dialogRef = this.dialog.open(UserinfoDialogComponent, {
      width: '750px',
      data: { value: 'Reopen Task', data: this.taskDetail, actionId: this.taskDetail.actionId },
      autoFocus: false
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

closeTask(): void {
  const dialogRef = this.dialog.open(UserinfoDialogComponent, {
      width: '750px',
      data: { value: 'Close Task', data: this.taskDetail, actionId: this.taskDetail.actionId },
      autoFocus: false
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

sendtosection(): void {
  const dialogRef = this.dialog.open(SendsectionDialogComponent, {
      width: '750px',
      data: { value: 'SendSection', actionId: this.taskDetail.actionId, provinceId: this.taskDetail.provinceId },
      autoFocus: false
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
    if (resultCode !== 1) {
      this.router.navigate(['/tasks/task-list']);
    }
  });
}

employeedetails(): void {
  if (this.assignUser === '') {
      this.decisionform.get('assignedToUserId').markAsTouched();
  } else {
      const dialogRef = this.dialog.open(EmployeedetailsComponent, {
          width: '750px',
          data: this.assignUser.userId,
          panelClass: 'custom-modalbox'
      });
      dialogRef.afterClosed().subscribe(async (resultCode) => {
        if (resultCode !== 1) {
          this.router.navigate(['/tasks/task-list']);
        }
      });
  }
}

submitDecision() {
  this.loaderService.display(true);
  if (this.decisionform.invalid) {
      this.decisionform.get('assignedToUserId').markAsTouched();
      this.decisionform.get('notes').markAsTouched();
      this.loaderService.display(false);
      return;
  } else {
      const decision = this.decisionform.value;
      decision.assignedToUserId = this.assignUser.userId,

          this.restService.processtask(decision).subscribe((res: any) => {
              this.decisionDialog(res);
              this.loaderService.display(false);
              this.addUserNotification();
          }, error => {
              this.loaderService.display(false);
          });
  }
}

decisionDialog(data): void {
  const dialogRef = this.dialog.open(ConfirmDecisionComponent, {
      width: '546px',
      data: { value: data }
  });
  dialogRef.afterClosed().subscribe(async (resultCode) => {
      this.router.navigate(['tasks/task-list']);
  });
}

addUserNotification() {
  const decision = this.decisionform.value;

  const notification = {
      'loggedInUserId': this.userId,
      'notifyUserId': this.assignUser.userId,
      'subject': this.taskDetail.processName + ': ' + this.taskDetail.actionRequiredDescription + ' ' + this.taskDetail.referenceNo,
      'description': decision.notes,
      'contextTypeId': 5055,
      'contextId': this.taskDetail.workflowId

  };

  this.restService.addUserNotification(notification).subscribe(async (result) => { });

}

get getAssignUser() {
  return this.decisionform.get('assignedToUserId');
}

getAllUserByUserType(roleid) {
  this.assignUser = '';
  this.notes = '';
  this.loaderService.display(true);
  this.restService.getUserByRoleIdProvinceId(this.taskDetail.provinceId, roleid).subscribe(response => {
      this.users = response.data;
      this.assignedFilteredUsers.next(this.users.slice());
      this.loaderService.display(false);
      this.assignDecisionUser = this.users[0].userId;
      this.assignedUserSelected(this.assignDecisionUser);
      this.decisionform.patchValue({
          assignedToUserId: this.assignDecisionUser
      });
      this.searchUserFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroySearchUser))
          .subscribe(() => {
              this.filterSeachUser();
          });
  });
}

protected filterSeachUser() {
  if (!this.users) {
      return;
  }
  let search = this.searchUserFilterCtrl.value;
  if (!search) {
      this.assignedFilteredUsers.next(this.users.slice());
      return;
  } else {
      search = search.toLowerCase();
  }
  this.assignedFilteredUsers.next(
      this.users.filter(value => (value.firstName + ' ' + value.surname).toLowerCase().indexOf(search) > -1)
  );
}

filterUsers(value: string) {
  const filterValue = value.toLowerCase();
  return this.users.filter(user => (user.firstName + ' ' + user.surname).toLowerCase().includes(filterValue));
}

assignedUserSelected(event) {
  this.assignUser = this.users.filter(x => x.userId === event)[0];
  this.tooltipText = this.assignUser.firstName !== undefined ? 'UserName: ' + this.assignUser.firstName + ' '
      + this.assignUser.surname + '\n' + 'User Type: ' + (this.assignUser.userType) : '';
}

displayFn(user) {
  return user ? (user.firstName + ' ' + user.surname) : '';
}

getNodeDetails() {
  this.restService.getNodeDetails(this.taskDetail.processId, this.taskDetail.nodeId)
      .subscribe((res: any) => {
          this.nodeDetails = res;
          // this.menuItems[1].title = res.formName;
          // this.menuItems[1].description = res.Description;
          this.outLinks = this.nodeDetails.OutLink.filter(x => x.actionCaption !== '' && x.actionCaption !== 'ReSubmitt' && x.actionCaption !== 'Remove');
          if (this.outLinks.length > 0) {
              for (let i = 0; i < this.outLinks.length; i++) {
                  this.outLinks[i].checked = false;
              }
          }

      });
}

onProcessChange(event) {
  this.decisionform.patchValue({
      actionTakenId: Number(event.value.Action)
  });
  this.decisionSelected = false;
  this.restService.getNodeDetails(this.taskDetail.processId, event.value.NextNodeID)
      .subscribe((res: any) => {
          this.nodedetailsnext = res;
          this.formHeading = this.nodedetailsnext.formName;
          this.formDescription = this.nodedetailsnext.Description;
          this.getAllUserByUserType(event.value.nextNodeRoleId);
          this.nextOutLinks = this.nodedetailsnext.OutLink.filter(x => x.actionCaption !== '');
          if (this.nextOutLinks.length > 0) {
              for (let i = 0; i < this.nextOutLinks.length; i++) {
                  this.nextOutLinks[i].checked = false;
              }
          }
      });
}

}
