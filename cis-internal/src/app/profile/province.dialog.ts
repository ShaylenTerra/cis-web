import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
    provinces: Array<{
        provinceName: string
        provinceCode: string;
    }>;
}

@Component({
    selector: 'app-province-dialog',
    templateUrl: 'province.dialog.html',
})
export class AddProvinceDialogComponent {
    selectedProvinceCode = '';

    constructor(
        public dialogRef: MatDialogRef<AddProvinceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
