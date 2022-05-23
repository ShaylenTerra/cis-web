import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-expeditetask-dialog',
    templateUrl: './expeditetask-dialog.component.html',
    styleUrls: ['./expeditetask-dialog.component.css']
})
export class ExpeditetaskDialogComponent implements OnInit {
    priorities: any[] = [];
    selectProvince: number;
    form: FormGroup;
    selected = -1;
    isSpinnerVisible = false;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    notes: any;

    constructor(public dialogRef: MatDialogRef<ExpeditetaskDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            notes: ['', Validators.required],
            priorityFlag: ['', Validators.required],
            userId: this.userId,
            workflowId: this.data.value
        });
    }

    ngOnInit() {
        this.getPriority();
    }

    getPriority() {
        this.restService.getPriorityFlag().subscribe((res: any) => {
            this.priorities = res.data;
        });
    }

    submit() {
        this.loaderService.display(true);

        if (this.form.invalid) {
            this.form.get('priorityFlag').markAsTouched();
            this.form.get('notes').markAsTouched();
            this.loaderService.display(false);
            return;
        } else {
            this.restService.expiditeTask(this.form.value).subscribe((res: any) => {
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
                this.loaderService.display(false);
            });
        }

    }

}
