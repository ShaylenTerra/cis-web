import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-office-config-dialog',
  templateUrl: './office-config-dialog.component.html',
  styleUrls: ['./office-config-dialog.component.css']
})
export class OfficeConfigDialogComponent implements OnInit {

  todayDate = new Date();
    minDate = new Date();
    fg: FormGroup;
    date;
    isSpinnerVisible = false;
    system;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    @ViewChild('townshipSelect', { static: false }) townshipSelect: MatSelect;
    public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    townshipdata: any[];
    protected _onDestroyTownship = new Subject<void>();
    public townshipFilterCtrl: FormControl = new FormControl();
    TownshipModel;
    systemArr = [
      {'name': 'Transvaal'},
      {'name': 'Cape'}
    ];
    constructor(public dialogRef: MatDialogRef<OfficeConfigDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private datePipe: DatePipe, private loaderService: LoaderService) {
        this.minDate.setDate(this.minDate.getDate());
        dialogRef.disableClose = true;
        this.fg = this.fb.group({
          assignedTownship: ['', Validators.required],
          assignedsystem: ['', Validators.required]
        });
        this.systemArr = this.systemArr.filter(x => x.name !== this.data.province.reservationSystem);
    }

    ngOnInit() {
      this.getAllTownship();
    }

    getAllTownship() {
      this.loaderService.display(true);
      this.restService.getReservationTownshipAllotment(this.data.province.boundaryId).subscribe(response => {
          this.townshipdata = response.data;
          this.filteredTownship.next(this.townshipdata.slice());
          this.townshipFilterCtrl.valueChanges
              .pipe(takeUntil(this._onDestroyTownship))
              .subscribe(() => {
                  this.filterTownships();
              });
          this.setInitialTownshipValue();
          this.loaderService.display(false);
      }, () => {
          this.loaderService.display(false);
      });
    }

    protected filterTownships() {
      if (!this.townshipdata) {
          return;
      }
      let search = this.townshipFilterCtrl.value;
      if (!search) {
          this.filteredTownship.next(this.townshipdata.slice());
          return;
      } else {
          search = search.toLowerCase();
      }
      this.filteredTownship.next(
          this.townshipdata.filter(bank => bank.majorRegionOrAdminDistrict.toLowerCase().indexOf(search) > -1)
      );
    }

    protected setInitialTownshipValue() {
      this.filteredTownship
      .pipe(take(1), takeUntil(this._onDestroyTownship))
      .subscribe(() => {
          this.townshipSelect.compareWith = (a: any, b: any) => a && b && a.boundaryId === b.boundaryId;
      });
    }

    submit() {
      if (this.fg.invalid) {
        this.fg.get('assignedTownship').markAsTouched();
        this.fg.get('assignedsystem').markAsTouched();
        return;
      } else {
        const data = this.townshipdata.filter(x => x.boundaryId === this.TownshipModel)[0];
        const obj = {
          'caption': data.majorRegionOrAdminDistrict,
          'boundaryId': this.TownshipModel,
          'reservationSystem': this.fg.value.assignedsystem
        };
        this.loaderService.display(true);
        this.restService.saveLocationReservationSystem(obj).subscribe(() => {
          this.snackbar.openSnackBar('Office location system added Successfully', 'Success');
          this.loaderService.display(false);
          this.dialogRef.close();
        }, () => {
          this.loaderService.display(false);
        });
      }
    }
}
