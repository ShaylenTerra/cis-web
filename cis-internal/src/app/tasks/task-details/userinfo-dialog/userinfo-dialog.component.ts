import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {takeUntil} from 'rxjs/operators';
import {IUser} from '../../../interface/user.interface';
import {ConfirmReferralComponent} from '../confirm-referral/confirm-referral.component';
import {Router} from '@angular/router';
import {LoaderService} from '../../../services/loader.service';
import {MatSelect} from '@angular/material/select';
import {ReplaySubject, Subject} from 'rxjs';

@Component({
    selector: 'app-userinfo-dialog',
    templateUrl: './userinfo-dialog.component.html',
    styleUrls: ['./userinfo-dialog.component.css']
})
export class UserinfoDialogComponent implements OnInit {
    users: IUser[];
    isSpinnerVisible = false;
    public assignedFilteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    assignUser;
    notes = '';
    form: FormGroup;
    form2: FormGroup;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    title: string;
    @ViewChild('searchUserSelect') searchUserSelect: MatSelect;
    public searchUserFilterCtrl: FormControl = new FormControl();
    protected _onDestroySearchUser = new Subject<void>();
    tooltipText: any;
    requestorData: any;
    constructor(public dialogRef: MatDialogRef<UserinfoDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private dialog: MatDialog,
                private snackbar: SnackbarService, private router: Router,
                private loaderService: LoaderService) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            // actionId: [0],
            actionIds: this.data.actionId,
            loggedInUser: this.userId,
            notes: ['', Validators.required],
            reassignedToUser: ['', Validators.required]
        });

        if (this.data.value === 'Referral Information') {
            const processData = {
                'name': JSON.parse(sessionStorage.getItem('userInfo')).firstName + ' '
                            + JSON.parse(sessionStorage.getItem('userInfo')).surname,
                'email': JSON.parse(sessionStorage.getItem('userInfo')).email
            };
            this.form2 = this.fb.group({
                processid: 50,
                provinceid: this.data.data.provinceId,
                loggeduserid: this.userId,
                notes: '',
                context: 'This is conext',
                type: 1,
                processdata: JSON.stringify(processData),
                parentworkflowid: this.data.data.workflowId,
                assignedtouserid: ''
            });
        }

    }

    get getAssignUser() {
        return this.form.get('reassignedToUser');
    }

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        this.assignUser = '';
        this.notes = '';
        const intuser = 'INTERNAL';
        this.loaderService.display(true);
        this.restService.getAllUserByUserType(intuser).subscribe(response => {
            this.users = response.data;
            this.assignedFilteredUsers.next(this.users.slice());
            this.isSpinnerVisible = false;
            this.loaderService.display(false);
            this.searchUserFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroySearchUser))
            .subscribe(() => {
                this.filterSeachUser();
            });
        });
    }

    filterUsers(value: string) {
        const filterValue = value.toLowerCase();
        return this.users.filter(user => (user.firstName + ' ' + user.surname).toLowerCase().includes(filterValue));
    }


    displayFn(user) {
        return user ? (user.firstName + ' ' + user.surname) : '';
    }

    submit() {
        this.loaderService.display(true);
        const tmpActionId = [];
        tmpActionId.push(this.data.actionId);
        const obj = this.form.value;
        obj.reassignedToUser = this.assignUser.userId,
        obj.actionIds = tmpActionId;

        if (this.data.value === 'ReAssign') {
            if (this.form.invalid) {
                this.form.get('reassignedToUser').markAsTouched();
                this.form.get('notes').markAsTouched();

                this.loaderService.display(false);
                return;
            } else {
                this.restService.reassignWorkflow(obj).subscribe((res: any) => {
                    this.loaderService.display(false);
                    this.dialogRef.close();
                }, error => {
                    this.loaderService.display(false);
                });
            }

        } else if (this.data.value === 'Referral Information') {

            if (this.form.invalid) {
                this.form.get('reassignedToUser').markAsTouched();
                this.form.get('notes').markAsTouched();

                this.loaderService.display(false);
                return;
            } else {
                this.setRequestorData();
                const referral = this.form2.value;
                referral.assignedtouserid = this.assignUser.userId;
                referral.notes = obj.notes;
                referral.processdata = JSON.stringify(this.requestorData);
                this.restService.triggertask(referral).subscribe((res1: any) => {
                    if (res1) {
                        this.referralDialog(res1);
                    }
                    this.loaderService.display(false);
                }, error => {
                    this.loaderService.display(false);
                });
            }

        } else if (this.data.value === 'Reopen Task') {
            if (this.form.invalid) {
                this.form.get('reassignedToUser').markAsTouched();
                this.form.get('notes').markAsTouched();

                this.loaderService.display(false);
                return;
            } else {
                const openData = {
                    actionId: this.data.actionId,
                    userId: this.assignUser.userId,
                    notes: this.notes,
                    workflowId: this.data.data.workflowId
                };
                this.restService.reopenTask(openData).subscribe((res: any) => {
                    this.loaderService.display(false);
                    if (res.code === 50000) {
                        this.snackbar.openSnackBar('Something went wrong', 'Error');
                    } else {
                        this.snackbar.openSnackBar('Task reopened', 'Success');
                        this.dialogRef.close();
                        this.router.navigate(['tasks/task-list']);
                    }
                }, error => {
                    this.loaderService.display(false);
                });
            }

        } else if (this.data.value === 'Close Task') {
            this.form.patchValue({
                reassignedToUser: 0
            });
            if (this.form.invalid) {
                // this.form.get('reassignedToUser').markAsTouched();
                this.form.get('notes').markAsTouched();
                this.loaderService.display(false);
                return;
            } else {
                const closeData = {
                    actionId: this.data.actionId,
                    userId: 0,
                    notes: this.notes,
                    workflowId: this.data.data.workflowId
                };
                this.restService.closeTask(closeData).subscribe((res: any) => {
                    this.loaderService.display(false);
                    if (res.code === 50000) {
                        this.snackbar.openSnackBar('Something went wrong', 'Error');
                    } else {
                        this.snackbar.openSnackBar('Task closed', 'Success');
                        this.dialogRef.close();
                        this.router.navigate(['tasks/task-list']);
                    }
                }, error => {
                    this.loaderService.display(false);
                });
            }

        }
    }


    referralDialog(data): void {
        const dialogRef = this.dialog.open(ConfirmReferralComponent, {
            width: '546px',
            data: {value: data}
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
            this.router.navigate(['tasks/task-list']);
            this.dialogRef.close();
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
    assignedUserSelected(event) {
        this.assignUser = event.value;
        this.tooltipText = this.assignUser.firstName !== undefined ? 'UserName: ' + this.assignUser.firstName + ' '
            + this.assignUser.surname + '\n' + 'User Type: ' + (this.assignUser.userTypeItemId) : '';

    }

    setRequestorData() {
        const loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
        this.requestorData = {
          'requesterInformation': {
            'userId': this.userId,
            'requestLoggedBy': {
                'firstName': loggedUserData.firstName,
                'surName': loggedUserData.surname,
                'contactNo': loggedUserData.mobileNo,
                'email': loggedUserData.email,
                'fax': '',
                'addressLine1': loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': loggedUserData.userProfile.postalAddressLine3,
                'postalCode': loggedUserData.userProfile.postalCode
            },
            'requesterDetails': {
                'firstName': loggedUserData.firstName,
                'surName': loggedUserData.surname,
                'contactNo': loggedUserData.mobileNo,
                'email': loggedUserData.email,
                'fax': '',
                'addressLine1': loggedUserData.userProfile.postalAddressLine1,
                'addressLine2': loggedUserData.userProfile.postalAddressLine2,
                'addressLine3': loggedUserData.userProfile.postalAddressLine3,
                'postalCode': loggedUserData.userProfile.postalCode
            }
          },
          'notifyManagerData': null,
          'queryData': null
        };
      }
}
