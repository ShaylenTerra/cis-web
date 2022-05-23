import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {map, takeUntil} from 'rxjs/operators';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';

interface User {
    countryCode: any;
    createdDate: number;
    email: string;
    firstName: string;
    lastUpdatedDate: number;
    mobileNo: string;
    status: string;
    surname: string;
    telephoneNo: string;
    titleItemId: string;
    userCode: string;
    userId: number;
    userName: string;
    userTypeItemId: string;
}

@Component({
    selector: 'app-reassign',
    templateUrl: './reassign.component.html',
    styleUrls: ['./reassign.component.css']
})
export class ReassignComponent implements OnInit, OnDestroy {
    isSpinnerVisible = false;
    columns: string[] = ['taskType', 'refCode', 'dateCreated', 'initiatedUser', 'Stage', 'priority', 'status', 'sla', 'action'];
    dataSource;
    dataLength;
    users: User[];
    actionIds: number[] = [];
    public fromFilteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public toFilteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    fromUser;
    toUser: User[];
    notes = '';
    form: FormGroup;
    assignUser: any;
    reassignUser: any;
    selectuser: any;
    selectTouser: any;
    public searchUserFilterCtrl: FormControl = new FormControl();
    public searchToUserFilterCtrl: FormControl = new FormControl();
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    @ViewChild('searchUserSelect') searchUserSelect: MatSelect;
    @ViewChild('searchToUserSelect') searchToUserSelect: MatSelect;
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    protected _onDestroySearchUser = new Subject<void>();
    protected _onDestroyToSearchUser = new Subject<void>();
    constructor(private fb: FormBuilder, private restService: RestcallService,
                private snackbar: SnackbarService) {
        this.form = this.fb.group({
            fromUser: ['', Validators.required],
            toUser: ['', Validators.required],
            notes: ['', Validators.required]
        });
    }

    get getFromUser() {
        return this.form.get('fromUser');
    }

    get getToUser() {
        return this.form.get('toUser');
    }

    ngOnInit() {
        this.isSpinnerVisible = true;
        this.initialise();
    }

    initialise() {
        this.actionIds = [];
        this.fromUser = '';
        // this.toUser = '';
        this.notes = '';
        this.restService.getAllInternalUsers().subscribe(response => {
            this.users = response.data;
            this.fromFilteredUsers.next(this.users.slice());
            this.selectuser = this.users[0].userId;
            this.assignedUserSelected(this.selectuser);
            this.form.patchValue({
                fromUser: this.selectuser
            });
            this.searchUserFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroySearchUser))
            .subscribe(() => {
                this.filterSeachUser();
            });

            this.toUser = response.data;
            this.toFilteredUsers.next(this.toUser.slice());
            this.selectTouser = this.toUser[0].userId;
            this.assignedToUserSelected(this.selectTouser);
            this.form.patchValue({
                toUser: this.selectTouser
            });
            this.searchToUserFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroyToSearchUser))
            .subscribe(() => {
                this.filterSeachToUser();
            });

            this.isSpinnerVisible = false;
            this.getAllWorkflowToReassign( this.selectuser);
        });
    }

    ngOnDestroy() {
        this._onDestroySearchUser.next();
        this._onDestroySearchUser.complete();
        this._onDestroyToSearchUser.next();
        this._onDestroyToSearchUser.complete();
    }

    protected filterSeachUser() {
        if (!this.users) {
            return;
        }
        let search = this.searchUserFilterCtrl.value;
        if (!search) {
            this.fromFilteredUsers.next(this.users.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.fromFilteredUsers.next(
            this.users.filter(value => (value.firstName + ' ' + value.surname).toLowerCase().indexOf(search) > -1)
        );
    }

    filterUsers(value: string) {
        const filterValue = value.toLowerCase();
        return this.users.filter(user => (user.firstName + ' ' + user.surname).toLowerCase().includes(filterValue));
    }

    assignedUserSelected(event) {
        this.assignUser = this.users.filter(x => x.userId === event)[0];
        this.getAllWorkflowToReassign( this.assignUser.userId);
    }

    protected filterSeachToUser() {
        if (!this.toUser) {
            return;
        }
        let search = this.searchToUserFilterCtrl.value;
        if (!search) {
            this.toFilteredUsers.next(this.toUser.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.toFilteredUsers.next(
            this.toUser.filter(value => (value.firstName + ' ' + value.surname).toLowerCase().indexOf(search) > -1)
        );
    }

    filteToUsers(value: string) {
        const filterValue = value.toLowerCase();
        return this.toUser.filter(user => (user.firstName + ' ' + user.surname).toLowerCase().includes(filterValue));
    }

    assignedToUserSelected(event) {
        this.reassignUser = this.toUser.filter(x => x.userId === event)[0];
        this.form.patchValue({
            toUser: this.selectTouser
        });
    }

    displayFn(user) {
        return user ? (user.firstName + ' ' + user.surname) : '';
    }

    actionSelected(event, element) {
        if (event.checked) {
            this.actionIds.push(element.actionId);
        } else {
            const index = this.actionIds.indexOf(element.actionId);
            this.actionIds.splice(index, 1);
        }
    }

    getAllWorkflowToReassign(userId) {
        this.restService.getAllWorkflowToReassign(userId).subscribe(response => {
            this.dataSource = new MatTableDataSource(response.data);
            this.dataLength = response.data.length;
            this.dataSource.paginator = this.paginator;
        });
    }

    submit() {
        this.isSpinnerVisible = true;
        const payload = {
            actionIds: this.actionIds,
            loggedInUser: this.userId,
            notes: this.notes,
            reassignedToUser: this.form.value.toUser
        };
        this.restService.reassignWorkflow(payload).subscribe(response => {
            if (response.data.update === true) {
                this.snackbar.openSnackBar('Process Re-Assigned', 'Success');
                this.initialise();
            }
        });
    }
}
