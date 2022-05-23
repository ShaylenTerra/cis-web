import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-delegation',
    templateUrl: './delegation.component.html',
    styleUrls: ['./delegation.component.css']
})
export class DelegationComponent implements OnInit {
    form: FormGroup;
    dataLength = 100;
    dataSource;
    pageSize = 10;
    page = 0;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    internalUser;
    internalUsers;
    startDate;
    endDate;
    description = '';
    columns = ['sno', 'delegated', 'start', 'end', 'desc', 'status', 'action'];

    constructor(private restService: RestcallService, private fb: FormBuilder, private loaderService: LoaderService) {
        this.form = this.fb.group({
            delegateTo: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            description: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.getDelegations();
        this.restService.getAllInternalUsers().subscribe(response => {
            this.internalUsers = response.data;
        });
    }

    getDelegations() {
        this.loaderService.display(true);
        this.restService.getAllUserDelegations(this.page, this.pageSize, this.userId).subscribe(response => {
            this.dataLength = response.data.totalElements;
            this.dataSource = response.data.content;
            this.loaderService.display(false);
        });
    }

    submitDelegation() {
        this.loaderService.display(true);
        if (this.form.invalid) {
            this.form.get('delegateTo').markAsTouched();
            this.form.get('startDate').markAsTouched();
            this.form.get('description').markAsTouched();
            this.form.get('endDate').markAsTouched();
            this.loaderService.display(false);
        } else {
            const payload = {
                'delegateUserId': this.internalUser.userId,
                'description': this.description,
                'fromDate': this.startDate,
                'statusItemId': '108',
                'toDate': this.endDate,
                'userId': this.userId
            };
            this.restService.addUserDelegations(payload).subscribe(response => {
                if (response.code === 10000) {
                    this.getDelegations();
                    this.form.reset();
                }
                this.loaderService.display(false);
            });
        }
    }

    changeStatus(element, status) {
        this.loaderService.display(true);
        this.restService.updateUserDelegations(element.id, status).subscribe(response => {
            this.getDelegations();
            this.loaderService.display(false);
        });
    }

    pageChange(event) {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getDelegations();
    }

    getInternalUserName(userId) {
        if (this.internalUsers !== undefined) {
            const user = this.internalUsers.filter(x => x.userId === userId)[0];
            return (user.firstName + ' ' + user.surname);
        } else {
            return '';
        }
    }

    getDate(data) {
        const date = new Date(data);
        return (date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
    }
}
