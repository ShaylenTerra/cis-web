import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-lodgement-document-dialog',
  templateUrl: './lodgement-document-dialog.component.html',
  styleUrls: ['./lodgement-document-dialog.component.css']
})
export class LodgementDocumentDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  public filteredLodgementDocument: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredLodgementPurpose: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredRefrenceNumber: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  formPurpose: FormGroup;
  formReservation: FormGroup;
  form: FormGroup;
  LodgementDocumentData: any[] = [];
  LodgementPurposeData: any[] = [];
  LodgementRefrenceNumber: any[] = [];
  lodgementPurpose: any;
  lodgementDocument: any;
  lodgementAction;

  protected _onDestroyLodgementDocument = new Subject<void>();
  protected _onDestroyLodgementPurpose = new Subject<void>();
  protected _onDestroyRefrenceNumber = new Subject<void>();
  public LodgementDocumentFilterCtrl: FormControl = new FormControl();
  public LodgementPurposeFilterCtrl: FormControl = new FormControl();
  public RefrenceNumberFilterCtrl: FormControl = new FormControl();
  @ViewChild('searchLodgementDocument', { static: true }) searchLodgementDocument: MatSelect;
  @ViewChild('searchLodgementPurpose', { static: true }) searchLodgementPurpose: MatSelect;
  @ViewChild('searchReferenceNumber', { static: true }) searchReferenceNumber: MatSelect;
  constructor(public dialogRef: MatDialogRef<LodgementDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService) {
    this.formPurpose = this.fb.group({
      lodgementDocument: ['', Validators.required],
      lodgementPurpose: ['', Validators.required],
    });

    this.form = this.fb.group({
      lodgementAction: ['purpose'],

    });

    this.formReservation = this.fb.group({
      refrenceNumber: [''],
      searchType: ['']
    });
  }

  ngOnInit(): void {
    debugger;
    this.lodgementAction = "purpose";
    this.listItemsByListCodes();
  }


  listItemsByListCodes() {
    debugger;
    this.loaderService.display(true);
    forkJoin([
      this.restService.getListItems(286),
      // this.restService.getListItems(387),
      this.restService.getListItems(388)
    ]).subscribe(([docData, RefrenceNumber]) => {
      debugger;
      this.LodgementDocumentData = docData.data;
      this.filteredLodgementDocument.next(this.LodgementDocumentData.slice());
      // this.LodgementPurposeData = purposeData.data;
      // this.filteredLodgementPurpose.next(this.LodgementPurposeData.slice());
       debugger;
      this.LodgementRefrenceNumber = RefrenceNumber.data;
      this.filteredRefrenceNumber.next(this.LodgementRefrenceNumber.slice());
      this.LodgementDocumentFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyLodgementDocument))
        .subscribe(() => {
          this.filterDocumentData();
        });

      // this.LodgementPurposeFilterCtrl.valueChanges
      //   .pipe(takeUntil(this._onDestroyLodgementPurpose))
      //   .subscribe(() => {
      //     this.filterPurposeData();
      //   });

      this.RefrenceNumberFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyRefrenceNumber))
        .subscribe(() => {
          this.filterRefrenceNumber();
        });
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });
  }

  changeDocument() {
    debugger;
    this.loaderService.display(true);
    this.restService.getReservationSubType(387, this.lodgementDocument.itemId).subscribe(purposeData => {
      this.LodgementPurposeData = purposeData.data;
      this.filteredLodgementPurpose.next(this.LodgementPurposeData.slice());

      this.LodgementPurposeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyLodgementPurpose))
        .subscribe(() => {
          this.filterPurposeData();
        });
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    })
  }

  protected setInitialLodgementDocument() {
    this.filteredLodgementDocument
      .pipe(take(1), takeUntil(this._onDestroyLodgementDocument))
      .subscribe(() => {
        if (this.searchLodgementDocument !== undefined) {
          this.searchLodgementDocument.compareWith = (a: any, b: any) => a && b && a.itemId === b.itemId;
        }
      });
  }

  protected setInitialLodgementPurpose() {
    this.filteredLodgementPurpose
      .pipe(take(1), takeUntil(this._onDestroyLodgementPurpose))
      .subscribe(() => {
        if (this.searchLodgementPurpose !== undefined) { 
          this.searchLodgementPurpose.compareWith = (a: any, b: any) => a && b && a.itemId === b.itemId;
        }
      });
  }

  protected setInitialRefrenceNumber() {
    debugger;
    this.filteredRefrenceNumber
      .pipe(take(1), takeUntil(this._onDestroyRefrenceNumber))
      .subscribe(() => {
        if (this.searchReferenceNumber != undefined) {
          this.searchReferenceNumber.compareWith = (a: any, b: any) => a && b && a.itemId === b.itemId;
        }
      });
  }

  protected filterDocumentData() {
    if (!this.LodgementDocumentData) {
      return;
    }
    let search = this.LodgementDocumentFilterCtrl.value;
    if (!search) {
      this.filteredLodgementDocument.next(this.LodgementDocumentData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredLodgementDocument.next(
      this.LodgementDocumentData.filter(x => x.caption.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterPurposeData() {
    if (!this.LodgementPurposeData) {
      return;
    }
    let search = this.LodgementPurposeFilterCtrl.value;
    if (!search) {
      this.filteredLodgementPurpose.next(this.LodgementPurposeData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredLodgementPurpose.next(
      this.LodgementPurposeData.filter(x => x.caption.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterRefrenceNumber() {
    debugger;
    if (!this.LodgementRefrenceNumber) {
      return;
    }
    let search = this.RefrenceNumberFilterCtrl.value;
    if (!search) {
      this.filteredRefrenceNumber.next(this.LodgementRefrenceNumber.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRefrenceNumber.next(
      this.LodgementRefrenceNumber.filter(x => x.caption.toLowerCase().indexOf(search) > -1)
    );
  }

  ngAfterViewInit() {
    this.setInitialLodgementDocument();
    // this.setInitialLodgementPurpose();
    this.setInitialRefrenceNumber();
  }

  submit() {
    debugger;
    if (this.lodgementAction == "purpose") {
      if (this.formPurpose.invalid) {
        this.formPurpose.get('lodgementDocument').markAsTouched();
        this.formPurpose.get('lodgementPurpose').markAsTouched();
      } else {
        const payload = {
          "draftId": this.data.draftId,
          "documentItemId": this.lodgementDocument.itemId,
          "reasonItemId": this.lodgementPurpose.itemId,
          "requestReason": this.lodgementPurpose.caption,
          "stepNo": this.data.stepNo
        }
        this.loaderService.display(true);
        this.restService.saveLodgementDraftSteps(payload).subscribe((res) => {
          this.dialogRef.close();

          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
        });
      }
    } else if (this.lodgementAction == "reservation") {
      if (this.formReservation.invalid) {
        this.formReservation.get('refrenceNumber').markAsTouched();
        this.formReservation.get('searchType').markAsTouched();
      } else {
        this.loaderService.display(true);
        this.restService.addStepsByReservationRef(this.data.draftId, this.formReservation.value.searchType).subscribe((res) => {
          if (res.data.length > 0) {
            this.dialogRef.close();
          } else {
            this.snackbar.openSnackBar('No data found.', 'Warning');
          }
          this.loaderService.display(false);
        }, error => {
          this.loaderService.display(false);
        });
      }
    }
  }

  ngOnDestroy() {
    this._onDestroyLodgementDocument.next();
    this._onDestroyLodgementDocument.complete();
    // this._onDestroyLodgementPurpose.next();
    // this._onDestroyLodgementPurpose.complete();
    this._onDestroyRefrenceNumber.next();
    this._onDestroyRefrenceNumber.complete();
  }
}
