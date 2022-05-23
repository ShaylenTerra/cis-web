import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IProvince } from '../../../interface/province.interface';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { map, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
    selector: 'app-reservation-draft-dialog',
    templateUrl: './reservation-draft-dialog.component.html',
    styleUrls: ['./reservation-draft-dialog.component.css']
})
export class ReservationDraftDialogComponent implements OnInit {

    provinces: IProvince[];
    assignedFilteredProvinces;
    form: FormGroup;

    public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public ProvinceFilterCtrl: FormControl = new FormControl();
    protected _onDestroyProvince = new Subject<void>();
    provinceModel;
    constructor(public dialogRef: MatDialogRef<ReservationDraftDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
        private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService) {

        this.form = this.fb.group({
            province: ['', Validators.required],
            provinceShortName: '',
            name: '',
            description: '',
            workflowId: this.data?.value?.workflowId
        });
    }

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        this.loaderService.display(true);
        this.restService.getProvinces().subscribe(response => {
            this.provinces = response.data;
            this.filteredProvince.next(this.provinces.slice());
            this.ProvinceFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroyProvince))
                .subscribe(() => {
                    this.filterProvince();
                });
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error retrieving data', 'Error');
        });
    }

    protected filterProvince() {
        if (!this.provinces) {
            return;
        }
        let search = this.ProvinceFilterCtrl.value;
        if (!search) {
            this.filteredProvince.next(this.provinces.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredProvince.next(
            this.provinces.filter(bank => bank.provinceName.toLowerCase().indexOf(search) > -1)
        );
    }

    CreateReservation() {
        if (this.form.invalid) {
            this.form.get('name').markAsTouched();
            this.form.get('description').markAsTouched();
            this.form.get('province').markAsTouched();
            this.loaderService.display(false);
            return;
        } else {
            this.loaderService.display(true);
            const payload = {
                'name': this.form.value.name,
                'purpose': this.form.value.description,
                'processId': this.data.processId,
                'provinceId': this.form.value.province.provinceId,
                'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
            };
            this.restService.saveReservationDraft(payload).subscribe((res: any) => {
                if (res.code === 50000) {
                    this.snackbar.openSnackBar(`Reservation draft not created`, 'Warning');
                    this.loaderService.display(false);
                } else {
                    this.snackbar.openSnackBar('Reservation draft added sucessfully', 'Success');
                    this.loaderService.display(false);
                    this.dialogRef.close(res);
                }
            });
        }
    }

    close() {
        this.dialogRef.close();
    }
}
