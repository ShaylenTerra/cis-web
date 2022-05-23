import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

interface DialogData {
    cellPhoneNo: string;
    courierService: string;
    createdUser: string;
    description: string;
    email: string;
    faxNo: string;
    generalNotes: string;
    initials: string;
    modifiedUser: string;
    plsCode: string;
    postalAddress1: string;
    postalAddress2: string;
    postalAddress3: string;
    postalAddress4: string;
    postalCode: string;
    provCode: string;
    restrictedInd: string;
    sectionalPlanInd: string;
    sgOfficeId: string;
    surname: string;
    surveyorId: string;
    telephoneNo: string;
}

@Component({
    selector: 'app-pls-modal',
    templateUrl: './pls-modal.dialog.html',
    styleUrls: ['./pls-modal.dialog.css']
})
export class PLSModalDialogComponent implements OnInit {
    form: FormGroup;
    data;

    constructor(public dialogRef: MatDialogRef<PLSModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) private datas: DialogData, private fb: FormBuilder) {
        this.form = this.fb.group({
            plsCode: ['', Validators.required],
            initials: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', Validators.required],
            cellPhoneNo: ['', Validators.required],
            telephoneNo: ['', Validators.required],
            faxNo: ['', Validators.required],
            courierService: ['', Validators.required],
            postalAddress1: ['', Validators.required],
            postalAddress2: ['', Validators.required],
            postalAddress3: [''],
            postalCode: ['', Validators.required],
            createdUser: ['', Validators.required],
            modifiedUser: ['', Validators.required],
            surveyorId: ['', Validators.required],
            sgOfficeId: ['', Validators.required],
            provCode: ['', Validators.required],
            restrictedInd: ['', Validators.required],
            sectionalPlanInd: ['', Validators.required],
            generalNotes: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.data = datas;
    }

    ngOnInit() {
    }
}
