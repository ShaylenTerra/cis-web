import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-delete-property-dialog',
    templateUrl: './delete-property-dialog.component.html',
    styleUrls: ['./delete-property-dialog.component.css']
})
export class DeletePropertyDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DeletePropertyDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
    }

    deleteDraft() {
        this.loaderService.display(true);
        this.restService.deleteDraftRequestById(this.data).subscribe((res: any) => {
            this.loaderService.display(false);
            this.dialogRef.close();
        }, error => {
            this.loaderService.display(false);
        });
    }

}
