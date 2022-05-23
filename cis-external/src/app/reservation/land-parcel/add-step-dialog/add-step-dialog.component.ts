import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReservationReason } from '../../../constants/enums';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-add-step-dialog',
  templateUrl: './add-step-dialog.component.html',
  styleUrls: ['./add-step-dialog.component.css']
})
export class AddStepDialogComponent implements OnInit {
  ReservationReason = ReservationReason
  form: FormGroup;
  public filteredReservationReason: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('searchTypeSelect') searchTypeSelect: MatSelect;
  public ReservationReasonFilterCtrl: FormControl = new FormControl();
  protected _onDestroyReservationReason = new Subject<void>();
  searchType;
  ReservationReasondata: any[];
  reservationTypeFilters;
  reservationTypeFilter;
  parcelNo;
  disableParcel = false;
  Description = "";
  TownshipModel;
  province;
  townshipdata: any[];
  public filteredTownship: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public townshipFilterCtrl: FormControl = new FormControl();
  protected _onDestroyTownship = new Subject<void>();
  constructor(public dialogRef: MatDialogRef<AddStepDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService) {
    this.form = this.fb.group({
      reservationType: ['', Validators.required],
      parcelNo: [''],
      assignedTownship: ['']
    });
  }

  ngOnInit(): void {
    this.initialise();
    this.getAllTownship();
  }


  initialise() {
    this.loaderService.display(true);
    this.restService.getListItems(268).subscribe(response => {
      this.ReservationReasondata = response.data;
      this.filteredReservationReason.next(this.ReservationReasondata.slice());
      this.ReservationReasonFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyReservationReason))
        .subscribe(() => {
          this.filterReservationReason();
        });
    });
    this.loaderService.display(false);
  }

  onChangeReasonType(event) {
    this.loaderService.display(true);
    this.restService.getReservationType(306, event.itemId).subscribe(response => {
      this.reservationTypeFilters = response.data;
      this.reservationTypeFilter = this.reservationTypeFilters.filter(x => x.isDefault === 1)[0];
      if (this.searchType.itemId === this.ReservationReason.SUBDIVISION || this.searchType.itemId === this.ReservationReason.LEASE) {
        this.parcelNo = 1;
        this.form.patchValue({
          parcelNo: 1
        });
      }
      // this.onChangeReasonSubType(this.searchType);
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  setParcel() {
    this.Description = this.searchType?.description;
    if (this.searchType.itemId === this.ReservationReason.SUBDIVISION || this.searchType.itemId === this.ReservationReason.LEASE
      || this.searchType.itemId === this.ReservationReason.EXTENSIONOFTOWNSHIPS) {
      this.disableParcel = false;
    } else if (this.searchType.itemId === this.ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
      this.disableParcel = false;
      this.parcelNo = 2;
      this.form.patchValue({
        parcelNo: 2
      });
    } else {
      this.disableParcel = true;
      this.parcelNo = 1;
      this.form.patchValue({
        parcelNo: 1
      });
    }
  }

  protected filterReservationReason() {
    if (!this.ReservationReasondata) {
      return;
    }
    let search = this.ReservationReasonFilterCtrl.value;
    if (!search) {
      this.filteredReservationReason.next(this.ReservationReasondata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredReservationReason.next(
      this.ReservationReasondata.filter(bank => bank.caption.toLowerCase().indexOf(search) > -1)
    );
  }

  addStep() {
    this.loaderService.display(true);
    if (this.form.invalid) {
      this.form.get('reservationType').markAsTouched();
      this.form.get('parcelNo').markAsTouched();
      this.loaderService.display(false);
      return;
    } else {
      if (this.searchType.itemId === this.ReservationReason.CONSOLIDATION) {
        this.form.patchValue({
          parcelNo: 1
        });
      }
      let otherdata = '';
      if (this.searchType?.itemId === this.ReservationReason.REDESIGNATION) {
        otherdata = JSON.stringify({ 'toLocationId': '', 'toLocationName': '' })
      }

      if (this.searchType?.itemId === this.ReservationReason.CREATIONOFTOWNALLOTMENTAREASTOWNSHIPS) {
        otherdata = JSON.stringify({ 'toLocationId': 0, 'toLocationName': '' })
      }
      const obj = {
        'draftId': this.data.draftId,
        'otherData': otherdata,
        'parcelRequested': this.form.value.parcelNo,
        'reasonItemId': this.form.value.reservationType.itemId,
        'stepNo': this.data.stepNo
      };
      this.restService.addDraftSteps(obj).subscribe((res: any) => {
        this.loaderService.display(false);
        this.dialogRef.close();
      }, error => {
        this.loaderService.display(false);
      });
    }
  }

  getAllTownship() {
    this.loaderService.display(true);
    this.form.get('assignedTownship').reset();
    this.restService.getReservationTownshipAllotment(this.data.provinceId).subscribe(response => {
      this.townshipdata = response.data;
      this.filteredTownship.next(this.townshipdata.slice());
      this.townshipFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyTownship))
        .subscribe(() => {
          this.filterTownships();
        });
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

  close() {
    this.dialogRef.close();
  }
}
