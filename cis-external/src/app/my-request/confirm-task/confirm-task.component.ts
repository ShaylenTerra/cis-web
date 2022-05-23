import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
    selector: 'app-confirm-task',
    templateUrl: './confirm-task.component.html',
    styleUrls: ['./confirm-task.component.css']
})
export class ConfirmTaskComponent implements OnInit {
    form: FormGroup;
    date;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;

    constructor(public dialogRef: MatDialogRef<ConfirmTaskComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private dialog: MatDialog, private loaderService: LoaderService,
                private router: Router) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            actionId: this.data.value.actionId,
            notes: this.data.notes,
            userId: this.userId,
            workflowId: this.data.value.workflowId
        });
    }

    ngOnInit() {
    }

    submit() {
        this.loaderService.display(true);
        this.restService.cancelTask(this.form.value).subscribe((res: any) => {
            this.loaderService.display(false);
            this.dialogRef.close();
            this.router.navigate(['/home']);
        }, error => {
            this.loaderService.display(false);
        });

    }
}
