import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {forkJoin} from 'rxjs';
import {DialogData} from '../../../config/list-management/modal/add-new';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';


@Component({
    selector: 'app-architect-add-modal',
    templateUrl: './architect-add-modal.dialog.html',
    styleUrls: ['./architect-add-modal.dialog.css']
})
export class ArchitectAddModalDialogComponent implements OnInit {
    personalInfo: FormGroup;
    contactInfo: FormGroup;
    additionalInfo: FormGroup;
    provinces: any;
    statuses: any;
    selectedIndex: any = 0;
    userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    prefixCode: any = 'PRaRCHT ';
    org: any;
    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    constructor(public dialogRef: MatDialogRef<ArchitectAddModalDialogComponent>, private fb: FormBuilder,
        private restService: RestcallService, private loaderService: LoaderService,
        @Inject(MAT_DIALOG_DATA) public datas: DialogData,
        private snackbar: SnackbarService) {
        dialogRef.disableClose = true;
        this.personalInfo = this.fb.group({
            ppnNo: ['', Validators.required],
            firstName: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            alternateEmail: ['', [Validators.email]],
            initials: ['', Validators.required],


        });
        this.contactInfo = this.fb.group({
            cellPhoneNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
            telephoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10),
                            Validators.minLength(10)]],
            faxNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)]],
            postalAddress1: ['', Validators.required],
            postalAddress2: [''],
            postalAddress3: [''],
            postalAddress4: [''],
            postalCode: ['', Validators.required],
            provinceId: ['', Validators.required]
        });
        this.additionalInfo = this.fb.group({
            courierService: ['', Validators.required],
            businessName: ['', Validators.required],
            generalNotes: ['', Validators.required],
            description: [''],
            restrictedIndicator: ['', Validators.required],
            sectionalPlanInd: ['', Validators.required]
            // sgOfficeId: ['', Validators.required],
            // surveyorId: ['', Validators.required]
        });

    }

    get courierService() {
        return this.additionalInfo.get('courierService');
    }
    get businessName() {
        return this.additionalInfo.get('businessName');
    }
    get generalNotes() {
        return this.additionalInfo.get('generalNotes');
    }
    get description() {
        return this.additionalInfo.get('description');
    }
    get restrictedIndicator() {
        return this.additionalInfo.get('restrictedIndicator');
    }
    get sectionalPlanInd() {
        return this.additionalInfo.get('sectionalPlanInd');
    }
    // get sgOfficeId() {
    //     return this.additionalInfo.get('sgOfficeId');
    // }
    // get surveyorId() {
    //     return this.additionalInfo.get('surveyorId');
    // }

    get initials() {
        return this.personalInfo.get('initials');
    }
    get alternateEmail() {
        return this.personalInfo.get('alternateEmail');
    }
    get email() {
        return this.personalInfo.get('email');
    }
    get surname() {
        return this.personalInfo.get('surname');
    }
    get firstName() {
        return this.personalInfo.get('firstName');
    }
    get ppnNo() {
        return this.personalInfo.get('ppnNo');
    }

    get provinceId() {
        return this.contactInfo.get('provinceId');
    }
    get postalCode() {
        return this.contactInfo.get('postalCode');
    }
    get postalAddress4() {
        return this.contactInfo.get('postalAddress4');
    }
    get postalAddress3() {
        return this.contactInfo.get('postalAddress3');
    }
    get postalAddress2() {
        return this.contactInfo.get('postalAddress2');
    }
    get postalAddress1() {
        return this.contactInfo.get('postalAddress1');
    }
    get faxNo() {
        return this.contactInfo.get('faxNo');
    }
    get cellPhoneNo() {
        return this.contactInfo.get('cellPhoneNo');
    }
    get telephoneNumber() {
        return this.contactInfo.get('telephoneNumber');
    }

    ngOnInit() {
        this.loaderService.display(true);
        forkJoin([
        this.restService.getListItems(20),
        this.restService.getProvinces(),
        this.restService.getListItems(221)]).subscribe(([status, province, org]) => {
            this.statuses = status.data;
            this.provinces = province.data;
            this.org = org.data;
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
            this.snackbar.openSnackBar('Error retrieving data', 'Error');
        });
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.selectedIndex = tabChangeEvent.index;
    }
    public nextStep(value) {
        if (value === 1) {
            if (!this.personalInfo.valid) {
                this.personalInfo.get('firstName').markAsTouched();
                this.personalInfo.get('initials').markAsTouched();
                this.personalInfo.get('ppnNo').markAsTouched();
                this.personalInfo.get('surname').markAsTouched();
                this.personalInfo.get('email').markAsTouched();
                this.personalInfo.get('statusItemId').markAsTouched();
            } else {
                this.selectedIndex += 1;
            }
        } else {
            if (!this.contactInfo.valid) {
                this.contactInfo.get('cellPhoneNo').markAsTouched();
                this.contactInfo.get('telephoneNumber').markAsTouched();
                this.contactInfo.get('faxNo').markAsTouched();
                this.contactInfo.get('postalAddress1').markAsTouched();
                this.contactInfo.get('postalCode').markAsTouched();
                this.contactInfo.get('provinceId').markAsTouched();

            } else {
                this.selectedIndex += 1;
            }
        }
    }
    public previousStep() {
        this.selectedIndex -= 1;
    }

    register() {
        if (!this.additionalInfo.valid) {
            this.courierService.markAsTouched();
            this.businessName.markAsTouched();
            this.generalNotes.markAsTouched();
            this.restrictedIndicator.markAsTouched();
            this.sectionalPlanInd.markAsTouched();
            // this.sgOfficeId.markAsTouched();
            // this.surveyorId.markAsTouched();
        } else {

            this.restService.addPLSUser(this.getNewPLSPayloads()).subscribe(data => {
                if (data.code === 50000) {
                    this.snackbar.openSnackBar(data.msg, 'Error');
                } else {
                    this.snackbar.openSnackBar('User created', 'Success');
                    this.dialogRef.close(true);
                }
                this.loaderService.display(false);
            }, error => {
                this.snackbar.openSnackBar(error.message, 'Error');
                this.loaderService.display(false);
            });
        }
    }

    getNewPLSPayloads() {
        return {
            ppnNo: this.prefixCode + this.ppnNo.value,
            surname: this.surname.value,
            initials: this.initials.value,
            postalAddress1: this.postalAddress1.value,
            postalAddress2: this.postalAddress2.value,
            postalAddress3: this.postalAddress3.value,
            postalAddress4: this.postalAddress4.value,
            postalCode: this.postalCode.value,
            telephoneNumber: this.telephoneNumber.value,
            cellPhoneNo: this.cellPhoneNo.value,
            faxNo: this.faxNo.value,
            courierService: this.courierService.value,
            generalNotes: this.generalNotes.value,
            email: this.email.value,
            description: this.description.value,
            userProfessionalId: 0,
            firstName: this.firstName.value,
            restrictedIndicator: this.restrictedIndicator.value,
            sectionalPlanInd: this.sectionalPlanInd.value,
            provinceId: this.provinceId.value,
            isValid: 1,
            statusItemId: 108,
            // surveyorId: this.surveyorId.value,
            // sgOfficeId: this.sgOfficeId.value,
            professionTypeItemId: 5066,
            userid: null,
            createdByUserid: this.userId,
            modifiedByUserid: this.userId,
            businessName: this.businessName.value,
            alternateEmail: this.alternateEmail.value
        };
    }
}
