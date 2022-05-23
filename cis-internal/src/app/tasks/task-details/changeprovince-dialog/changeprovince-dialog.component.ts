import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';
import {map} from 'rxjs/operators';
import {IProvince} from '../../../interface/province.interface';
import {LoaderService} from '../../../services/loader.service';

@Component({
    selector: 'app-changeprovince-dialog',
    templateUrl: './changeprovince-dialog.component.html',
    styleUrls: ['./changeprovince-dialog.component.css']
})
export class ChangeprovinceDialogComponent implements OnInit {
    provinces: IProvince[];
    isSpinnerVisible = false;
    assignedFilteredProvinces;
    assignProvince;
    form: FormGroup;

    constructor(public dialogRef: MatDialogRef<ChangeprovinceDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService) {

        this.form = this.fb.group({
            province: ['', Validators.required],
            provinceShortName: '',
            toBeChangedProvinceId: '',
            workflowId: this.data.value.workflowId
        });
    }

    get getAssignProvince() {
        return this.form.get('province');
    }

    ngOnInit() {
        // this.isSpinnerVisible = true;
        this.initialise();
    }

    initialise() {
        this.assignProvince = '';
        this.loaderService.display(true);
        this.restService.getProvinces().subscribe(response => {
            this.provinces = response.data;
            this.assignedFilteredProvinces = response.data;
            // this.isSpinnerVisible = false;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error retrieving data', 'Error');
        });


        this.getAssignProvince.valueChanges
            .pipe(
                map(value => typeof value === 'string' ? value : (value.provinceName)),
                map(name => name ? this.filterProvince(name) : this.provinces.slice())
            ).subscribe(response => {
            this.assignedFilteredProvinces = response;
        });
    }

    filterProvince(value: string) {
        const filterValue = value.toLowerCase();
        return this.provinces.filter(province => (province.provinceName).toLowerCase().includes(filterValue));
    }

    assignedProvinceSelected(event) {
        this.assignProvince = event.option.value;
        this.form.patchValue({
            provinceShortName: this.assignProvince.provinceShortName,
            toBeChangedProvinceId: this.assignProvince.provinceId,
        });
    }

    displayFn(province) {
        return province ? (province.provinceName) : '';
    }

    submit() {
        if (this.form.invalid) {
            this.form.get('province').markAsTouched();
            return;
        } else {
            const obj = {
                'provinceShortName': this.form.value.provinceShortName,
                'toBeChangedProvinceId': this.form.value.toBeChangedProvinceId,
                'workflowId': this.form.value.workflowId
            };
            this.loaderService.display(true);
            this.restService.changeWorkflowProvince(obj).subscribe((res: any) => {
                this.loaderService.display(false);
                this.dialogRef.close();
            }, error => {
                this.loaderService.display(false);
                this.dialogRef.close();
            });

        }
    }
}
