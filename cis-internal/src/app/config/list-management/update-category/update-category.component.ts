import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {LoaderService} from '../../../services/loader.service';

@Component({
    selector: 'app-update-category',
    templateUrl: './update-category.component.html',
    styleUrls: ['./update-category.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateCategoryComponent implements OnInit {

    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<UpdateCategoryComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService,
                private cdRef: ChangeDetectorRef) {
        this.form = this.fb.group({
          caption: data.data.caption,
          description: data.data.description,
          isActive: data.data.isActive,
          isDefault: data.data.isDefault,
          itemCode: data.data.itemCode,
          itemId: data.data.itemId,
          listCode: data.data.listCode
        });
    }

    ngOnInit() {
    }

    submit() {
        this.loaderService.display(true);
        if (this.form.invalid) {
          this.form.get('description').markAsTouched();
          this.form.get('caption').markAsTouched();
          this.loaderService.display(false);
        } else {
          const obj = this.form.value;
          obj.isActive = (this.form.value.isActive === true || this.form.value.isActive === 1) ? 1 : 0;
          this.restService.updateListItem(obj)
            .subscribe((res) => {
              this.form.patchValue({
                caption: '',
                description: '',
                isActive: 0,
                isDefault: 0,
                itemCode: '',
                itemId: 0,
                listCode: 0
              });
              this.loaderService.display(false);
              this.dialogRef.close();
            }, error => {
              this.loaderService.display(false);
            });
        }
      }
}
