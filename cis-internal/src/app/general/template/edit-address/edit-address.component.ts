import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../../../services/snackbar.service';
import {RestcallService} from '../../../services/restcall.service';

@Component({
    selector: 'app-edit-address',
    templateUrl: './edit-address.component.html',
    styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent {
    cardForm: FormGroup;
    inputData: any = {
        provinceAddress: '',
        email: '',
        contactNumber: ''
    };

    constructor(public dialogRef: MatDialogRef<EditAddressComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder, private snackbar: SnackbarService,
                private restService: RestcallService) {
        dialogRef.disableClose = true;

        this.cardForm = this.fb.group({
            provinceAddress: ['', Validators.required],
            email: [''],
            contactNumber: ['']
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    saveProvinceAddress() {
        this.dialogRef.close();
        this.restService.updateprovinceAddress(this.data.province.provinceAddress).subscribe((res) => {
                this.snackbar.openSnackBar('Added Sub Category Successfully.', 'Success');
            },
            error => {
                this.snackbar.openSnackBar('Unknown error while saving information.', 'Error');
            });
    }

}
