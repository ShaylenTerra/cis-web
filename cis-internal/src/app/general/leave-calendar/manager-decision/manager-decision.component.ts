import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';


@Component({
    selector: 'app-manager-decision',
    templateUrl: './manager-decision.component.html',
    styleUrls: ['./manager-decision.component.css']
})
export class ManagerDecisionComponent implements OnInit {

    form: FormGroup;
    isSpinnerVisible = false;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    notes: any;
    decisions = [];
    status = 'PENDING';

    constructor(public dialogRef: MatDialogRef<ManagerDecisionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            notes: [data.managerComment, Validators.required],
            decision: [data.status, Validators.required],
            userId: this.userId,
            leaveId: data.leaveId
        });


    }

    ngOnInit(): void {

        this.decisions = [{id: 'APPROVED', desc: 'Approve'}, {id: 'REJECTED', desc: 'Reject'}];
        this.status = this.form.value.decision;
    }

    submit() {
        this.isSpinnerVisible = true;
        this.restService.reviewUserLeaves(this.form.value.leaveId, this.form.value.decision,
            this.form.value.notes, this.userId).subscribe(data => {
            this.isSpinnerVisible = false;
            this.dialogRef.close();
            this.snackbar.openSnackBar('Leave successfully ' + this.form.value.decision, 'Success');
        }, error => {
            this.snackbar.openSnackBar('Unable to change ' + this.form.value.decision, 'Error');
            this.isSpinnerVisible = false;
        });
    }


}


