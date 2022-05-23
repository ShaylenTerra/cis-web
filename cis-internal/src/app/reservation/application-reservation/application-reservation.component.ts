import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-application-reservation',
  templateUrl: './application-reservation.component.html',
  styleUrls: ['./application-reservation.component.css']
})
export class ApplicationReservationComponent implements OnInit, OnChanges {
  @Input() draftData;
  @Input() readonly;
  @Input() processId;
  selectedModes;
  selectedMode;
  public formApplication: FormGroup;
  electronicEmail;
  disableEmail = false;
  surveyDate;
  purpose;
  surveyname;
  isPrimary;
  name = '';
  emailDelivery = '';
  phone = '';
  add1 = '';
  add2 = '';
  add3 = '';
  postalCode = '';
  collectionAddress;
  deliveryEmailElec;
  maxDate = new Date();
  @ViewChild('quill') quill: QuillEditorComponent;
  @Output() outputFromChild: EventEmitter<any> = new EventEmitter();
  constructor(private restService: RestcallService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private loaderService: LoaderService) {
    this.formApplication = this.fb.group({
      name: [{ value: '', disabled: '' }, Validators.required],
      purpose: [{ value: '', disabled: '' }, Validators.required],
      fileRef: [{ value: '', disabled: '' }],
      surveyDate: [{ value: '', disabled: '' }],
      isPrimaryEmail: [{ value: '', disabled: '' }],
      deliveryMethod: [{ value: '', disabled: '' }],
      deliveryMethodItemId: [{ value: '', disabled: '' }],
    });
  }

  ngOnInit(): void {

    this.readonly ? this.formApplication.disable() : this.formApplication.enable();
    this.bindData();
    this.getAddressBasedOnProvinceId();
  }

  getAddressBasedOnProvinceId() {
    this.restService.getAddressBasedOnProvinceId(this.draftData?.provinceId).subscribe(payload => {
      this.collectionAddress = payload.data.provinceAddress;
    });
  }

  updateDraft(val) {
    const objData = this.draftData;
    if (val === 'Application') {
      if (this.formApplication.invalid) {
        this.formApplication.get('name').markAsTouched();
        this.formApplication.get('purpose').markAsTouched();
        return;
      } else {
        objData.name = this.formApplication.value.name;
        objData.purpose = this.formApplication.value.purpose;
        objData.fileRef = this.formApplication.value.fileRef;
        objData.surveyDate = this.formApplication.value.surveyDate;
        objData.isPrimaryEmail = this.formApplication.value.isPrimaryEmail;
        objData.email = this.electronicEmail;
        objData.deliveryMethodItemId = this.formApplication.value.deliveryMethodItemId;
        objData.deliveryMethod = this.formApplication.value.deliveryMethodItemId !== null ?
          this.selectedModes.filter(x => x.itemId === this.formApplication.value.deliveryMethodItemId)[0].caption
          : null;

        for (let i = 0; i < objData.reservationDraftSteps.length; i++) {
          if (objData.reservationDraftSteps[i] !== null) {
            objData.reservationDraftSteps[i].otherData = JSON.stringify(objData.reservationDraftSteps[i].otherData);
          }
        }
      }
    }
    this.loaderService.display(true);
    this.restService.updateDraft(objData).subscribe(() => {
      this.getDatabyDraftId();
      this.snackbar.openSnackBar(val + ' details updated Successfully', 'Success');
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
  }

  bindDeliveryData() {
    forkJoin([
      this.restService.getListItems(16)
    ]).subscribe(([method]) => {
      this.selectedModes = method.data;
      this.selectedMode = this.draftData.deliveryMethodItemId === null ?
        method.data.filter(x => x.caption === 'ELECTRONIC')[0].itemId :
        Number(this.draftData.deliveryMethodItemId);
      this.formApplication.patchValue({
        deliveryMethodItemId: this.selectedMode
      });
    });
  }

  bindData() {
    // this.quill.setDisabledState(this.readonly);
    if (this.draftData !== null) {
      this.surveyDate = this.draftData.surveyDate;
      this.purpose = this.draftData.purpose;
      this.surveyname = this.draftData.name;
      this.isPrimary = this.draftData.isPrimaryEmail;
      this.formApplication.patchValue({
        name: this.draftData.name,
        purpose: this.draftData.purpose,
        surveyDate: this.draftData.surveyDate,
        fileRef: this.draftData.fileRef,
        isPrimaryEmail: this.draftData.isPrimaryEmail,
        deliveryMethodItemId: Number(this.draftData.deliveryMethodItemId)
      });
      this.disableEmail = this.formApplication.value.isPrimaryEmail === 1 || this.formApplication.value.isPrimaryEmail === undefined
        || this.formApplication.value.isPrimaryEmail === null ? true : false;
      if (this.draftData.applicant === 0) {
        this.restService.getUserByUserID(this.draftData.applicantUserId).subscribe(res => {
          this.electronicEmail = this.draftData.applicant === 0 ? res.data.email : this.draftData.email;
          this.name = res.data.title + ' ' + res.data.firstName + ' ' + res.data.surname;
          this.emailDelivery = res.data.email;
          this.phone = res.data.mobileNo;
          this.add1 = res.data.userProfile.postalAddressLine1;
          this.add2 = res.data.userProfile.postalAddressLine2;
          this.add3 = res.data.userProfile.postalAddressLine3;
          this.postalCode = res.data.userProfile.postalCode;
        });
      } else if (this.draftData.applicant === 1) {
        let userData = JSON.parse(sessionStorage.userInfo);
        this.electronicEmail = (this.draftData.email === 1 || this.draftData.email === null) ? userData.email : this.draftData.email;
        this.name = userData.title + ' ' + userData.firstName + ' ' + userData.surname;
        this.emailDelivery = userData.email;
        this.phone = userData.mobileNo;
        this.add1 = userData.userProfile.postalAddressLine1;
        this.add2 = userData.userProfile.postalAddressLine2;
        this.add3 = userData.userProfile.postalAddressLine3;
        this.postalCode = userData.userProfile.postalCode;
      }
      this.bindDeliveryData();
    }
  }

  getDatabyDraftId() {
    this.restService.getReservationDraftById(this.draftData.draftId).subscribe(payload => {
      this.draftData = payload.data;
      this.outputFromChild.emit(this.draftData);
      this.bindData();
      this.loaderService.display(false);

    }, error => {
      this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
      this.loaderService.display(false);
    });
  }

  setPrimaryEmail(val) {
    this.disableEmail = val.value === 1 ? true : false;
  }

  ngOnChanges() {
    this.readonly ? this.formApplication.disable() : this.formApplication.enable();
    this.draftData = this.draftData;
    this.bindData();
  }

}
