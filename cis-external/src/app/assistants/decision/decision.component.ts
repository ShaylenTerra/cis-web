import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.css']
})
export class DecisionComponent implements OnInit {

    form: FormGroup;
    isSpinnerVisible = false;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    notes: any;
    decisions = [];
    status: any;

    constructor(public dialogRef: MatDialogRef<DecisionComponent>
                , @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService) {

        this.form = this.fb.group({
            notes: [data.comment, Validators.required],
            decision: [data.assistantStatusId, Validators.required],
            userId: this.userId,
            assistantUserId: data.userId,
            assistantId : data.assistantId
        });
    }

    ngOnInit(): void {
        this.decisions = [{id: 106, desc: 'Approve'}, {id: 115, desc: 'Reject'}];
        this.status = this.form.value.decision;

    }

    submit() {
       const payload = {
           id: this.form.value.assistantId,
           userId: this.form.value.userId,
           assistantId: this.form.value.assistantUserId,
           statusId: this.status === 107 ? this.form.value.decision : 428,
           comment: this.form.value.notes
       };

       if (payload.statusId === 106) {
           this.restService.changeAssistantStatus(payload).subscribe(res => {
               this.isSpinnerVisible = false;
               this.dialogRef.close();
               this.snackbar.openSnackBar('Assistant successfully updated', 'Success');
           }, error => {
               this.snackbar.openSnackBar('Unable to change update', 'Error');
               this.isSpinnerVisible = false;
           });
       } else {
           // remove in case of unlink and reject
           this.restService.removePlsAssistant(payload).subscribe(() => {
               this.isSpinnerVisible = false;
               this.dialogRef.close();
               this.snackbar.openSnackBar('Assistant successfully updated' , 'Success');
           }, error => {
               this.snackbar.openSnackBar('Unable to change update' , 'Error');
               this.isSpinnerVisible = false;
           });
       }
    }
}
