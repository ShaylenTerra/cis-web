import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { RestcallService } from '../../services/restcall.service';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-add-new-holiday-dialog',
    templateUrl: 'add-new.html',
    styleUrls: ['./add-new.css']
})
export class AddNewHolidayDialogComponent implements OnInit {
    inputForm: FormGroup;
    data: HolidayData = {
        date: new Date(),
        occasion: ''
    };

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddNewHolidayDialogComponent>,
                private snackbar: SnackbarService,
                private restService: RestcallService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.inputForm = this.fb.group({
            'date': ['', Validators.required],
            'occasion': ['', Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onSubmit() {
        this.loaderService.display(true);
        if (this.inputForm.invalid) {
            this.inputForm.get('date').markAsTouched();
            this.inputForm.get('occasion').markAsTouched();
            this.loaderService.display(false);
        } else {
            const payload = {
                holidayDate: [this.inputForm.value.date.getDate(), this.inputForm.value.data.date.getMonth() + 1,
                            this.inputForm.value.data.date.getFullYear()].join('/'),
                description: this.inputForm.value.occasion
            };
            this.restService.addHoliday(payload).subscribe(async () => {
                this.snackbar.openSnackBar('Added Holiday Successfully', 'Success');
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
                this.snackbar.openSnackBar(`Error in adding holiday`, 'Error');
                this.loaderService.display(false);
            });
        }
    }
}

export class HolidayData {
    date: Date;
    occasion: string;
}
