import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../services/snackbar.service';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-add-modal',
    templateUrl: 'add.modal.html',
    styleUrls: ['./add-modal.css']
})
export class AddModalComponent {
    cardForm: FormGroup;
    inputData: any = {
        name: '',
        description: ''
    };

    constructor(public dialogRef: MatDialogRef<AddModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder, private snackbar: SnackbarService,
                private restService: RestcallService) {
        dialogRef.disableClose = true;
        this.cardForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            isActive: ['']
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    save() {
        if (this.data.sc) {


            const payload = {
                'categoryId': this.data.category.feeCategoryId,
                'description': this.cardForm.value.description,
                'isActive': this.cardForm.value.isActive ? 1 : 0,
                'name': this.cardForm.value.name,
            };
            this.restService.addSubCategory(payload).subscribe((res) => {
                    this.restService.getAllFeeSubCategories(res.data.categoryId).subscribe(data => {
                        this.dialogRef.close(data);
                        this.snackbar.openSnackBar('Added Sub Category Successfully.', 'Success');
                    });
                },
                error => {
                    this.snackbar.openSnackBar('Unknown error while saving information.', 'Error');
                });


        } else {

            const payload = {
                'description': this.cardForm.value.description,
                'isActive': this.cardForm.value.isActive ? 1 : 0,
                'name': this.cardForm.value.name,
            };

            this.restService.addCategory(payload).subscribe(() => {
                    this.restService.getAllFeeCategories().subscribe(response => {
                        this.dialogRef.close();
                        this.snackbar.openSnackBar('Added Category Successfully.', 'Success');
                    });
                },
                error => {

                    this.snackbar.openSnackBar('Unknown error while saving information.', 'Error');
                });
        }


    }
}
