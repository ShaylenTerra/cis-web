import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

export interface DialogData {
    title: string;
    name: string;
    description: string;
    compareValues: Array<string>;
    listCode: any;
}

@Component({
    selector: 'app-add-new-dialog',
    templateUrl: 'add-new.html',
    styleUrls: ['./add-new.css'],
})
export class AddNewDialogComponent implements OnInit {
    inputForm: FormGroup;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<AddNewDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private loaderService: LoaderService, private restService: RestcallService,
                private snackbar: SnackbarService) {
    }

    ngOnInit() {
        this.inputForm = this.fb.group({
            'name': ['', [Validators.required, (control: AbstractControl) => {
                return this.data.compareValues.indexOf(control.value) === -1 ? null : {'forbiddenValue': true};
            }]],
            'description': ['', Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    submit() {
        this.loaderService.display(true);
        if (this.inputForm.invalid) {
          this.inputForm.get('description').markAsTouched();
          this.inputForm.get('name').markAsTouched();
          this.loaderService.display(false);
        } else {
          const payload = {
            'caption': this.inputForm.value.name,
            'description': this.inputForm.value.description,
            'listCode': this.data.listCode
        };
        this.restService.addListItem(payload)
            .subscribe(data1 => {
                this.snackbar.openSnackBar('New item created', 'Success');
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
                this.snackbar.openSnackBar('Error adding new item', 'Error');
                this.loaderService.display(false);
            });
        }
      }
}
