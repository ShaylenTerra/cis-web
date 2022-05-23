import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';

@Component({
    selector: 'app-landprofilenote-dialog',
    templateUrl: './landprofilenote-dialog.component.html',
    styleUrls: ['./landprofilenote-dialog.component.css']
})
export class LandprofilenoteDialogComponent implements OnInit {
    notes = '';
    form: FormGroup;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    contextList: any[] = [];
    constructor(public dialogRef: MatDialogRef<LandprofilenoteDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private dialog: MatDialog,
                private snackbar: SnackbarService, private router: Router,
                private loaderService: LoaderService) {
        dialogRef.disableClose = true;
        this.form = this.fb.group({
            notes: ['', Validators.required],
            noteType: ['', Validators.required],
            userId: this.userId,
            lpi: this.data
        });
    }

    ngOnInit() {
        this.bindList();
     }

     bindList() {
        this.loaderService.display(true);
        this.restService.getListItems(121).subscribe((res: any) => {
            this.contextList = res.data;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
          });
     }

    submit() {
        this.loaderService.display(true);
        if (this.form.invalid) {
            this.form.get('notes').markAsTouched();
            this.form.get('noteType').markAsTouched();
            this.loaderService.display(false);
            return;
        } else {
            this.restService.saveLpiNote(this.form.value).subscribe((res: any) => {
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
            this.loaderService.display(false);
            });
        }
    }
}
