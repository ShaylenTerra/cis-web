import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
    province: string;
    day: string;
    from: string;
    to: string;
    isHoliday: boolean;
}

@Component({
    selector: 'app-office-timing-edit-modal',
    templateUrl: 'office-timing-edit.modal.html',
    styleUrls: ['office-timing-edit.modal.css']
})

export class OfficeTimingsEditDialogComponent implements OnInit {
    inputForm: FormGroup;
    isHoliday = false;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<OfficeTimingsEditDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        this.inputForm = new FormGroup({
            firstName: new FormControl()
        });
    }

    chanageSelection() {
        this.isHoliday = !this.isHoliday;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
