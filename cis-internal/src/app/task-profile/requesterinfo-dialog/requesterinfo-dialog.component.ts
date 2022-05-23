import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-requesterinfo-dialog',
  templateUrl: './requesterinfo-dialog.component.html',
  styleUrls: ['./requesterinfo-dialog.component.css']
})
export class RequesterinfoDialogComponent implements OnInit {
  RequestersInfo: FormGroup;
  notifyRequestorInformation: any;
  requestorInformation: any;
  queryDescription;
  issueType;
  requesterForm: FormGroup;
  datasearchInformation: any;
  requestor: any = 'Yes';
  ownMedia;
  requestorClient = 'ANONYMOUS';
  constructor(public dialogRef: MatDialogRef<RequesterinfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private loaderService: LoaderService) {

      this.RequestersInfo = this.fb.group({
      email: '',
      firstName: '',
      lastName: '',
      requestType: '',
      formatType: '',
      deliveryMethod: '',
      add1: '',
      add2: '',
      add3: '',
      collectionAddress: '',
      zipcode: '',
      phone: ''
  });

  this.requesterForm = this.fb.group({
    requesterName: ['', Validators.required],
    requesterSurame: ['', Validators.required],
    Email: ['', Validators.required],
    Fax: ['', Validators.required],
    Address1: ['', Validators.required],
    Address2: ['', Validators.required],
    Address3: ['', Validators.required],
    PostalCode: ['', Validators.required],
    contactNumber: ['', Validators.required]
  });

  }

  ngOnInit(): void {
    // this.getWorkflowBasedItem();
    this.getRequestorInformation();
  }


  getWorkflowBasedItem() {
    this.loaderService.display(true);

    this.restService.getWorkflowBasedItem(this.data.workflowId).subscribe(res => {
        if (this.data.processName === 'Notify Manager') {
            this.notifyRequestorInformation = res.data;
            this.requesterForm.patchValue({
                requesterName: this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName,
                requesterSurame: this.notifyRequestorInformation.requesterInformation.requesterDetails.surName,
                Email: this.notifyRequestorInformation.requesterInformation.requesterDetails.email,
                Fax: this.notifyRequestorInformation.requesterInformation.requesterDetails.fax,
                Address1: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine1,
                Address2: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine2,
                Address3: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine3,
                PostalCode: this.notifyRequestorInformation.requesterInformation.requesterDetails.postalCode,
                contactNumber: this.notifyRequestorInformation.requesterInformation.requesterDetails.contactNo
            });
            if (this.notifyRequestorInformation != null && this.notifyRequestorInformation !== undefined) {
                this.RequestersInfo.patchValue({
                    email: this.notifyRequestorInformation.requesterInformation.requesterDetails.email,
                    firstName: this.notifyRequestorInformation.requesterInformation.requesterDetails.firstName,
                    lastName: this.notifyRequestorInformation.requesterInformation.requesterDetails.lastName,
                    add1: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine1,
                    add2: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine2,
                    add3: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine3,
                    collectionAddress: this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine1 + ' ' +
                                       this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine2 + ' ' +
                                       this.notifyRequestorInformation.requesterInformation.requesterDetails.addressLine3,
                    zipcode: this.notifyRequestorInformation.requesterInformation.requesterDetails.postalCode,
                    phone: this.notifyRequestorInformation.requesterInformation.requesterDetails.contactNo,
                    requestType: this.data.processName,
                });
            }
        }

        if (this.data.processName === 'Referral Task') {
            this.notifyRequestorInformation = res.data.json != null ? res.data.json[0] : res.data[0];
            this.RequestersInfo.patchValue({
                firstName: this.notifyRequestorInformation ?
                    this.notifyRequestorInformation.name.split(' ')[0] : '',
                lastName: this.notifyRequestorInformation ?
                    this.notifyRequestorInformation.name.split(' ')[1] : '',
                email: this.notifyRequestorInformation ?
                    this.notifyRequestorInformation.email : '',
                requestType: this.data.processName,
            });

        }
        this.ownMedia = undefined;
        this.requestor = undefined;
        if (this.data.processName === 'Query') {
            this.queryDescription = res.data.queryData.description;
            this.issueType = res.data.queryData.issueType;
            this.requestorInformation = res.data.json != null ? res.data.json : res.data;
            this.requesterForm.patchValue({
                requesterName: this.requestorInformation.requesterInformation.requesterDetails.firstName,
                requesterSurame: this.requestorInformation.requesterInformation.requesterDetails.surName,
                Email: this.requestorInformation.requesterInformation.requesterDetails.email,
                Fax: this.requestorInformation.requesterInformation.requesterDetails.fax,
                Address1: this.requestorInformation.requesterInformation.requesterDetails.addressLine1,
                Address2: this.requestorInformation.requesterInformation.requesterDetails.addressLine2,
                Address3: this.requestorInformation.requesterInformation.requesterDetails.addressLine3,
                PostalCode: this.requestorInformation.requesterInformation.requesterDetails.postalCode,
                contactNumber: this.requestorInformation.requesterInformation.requesterDetails.contactNo
            });

        if (this.requestorInformation != null && this.requestorInformation !== undefined) {
            this.RequestersInfo.patchValue({
                email: this.requestorInformation.requesterInformation.requesterDetails.email,
                firstName: this.requestorInformation.requesterInformation.requesterDetails.firstName,
                lastName: this.requestorInformation.requesterInformation.requesterDetails.lastName,
                add1: this.requestorInformation.requesterInformation.requesterDetails.addressLine1,
                add2: this.requestorInformation.requesterInformation.requesterDetails.addressLine2,
                add3: this.requestorInformation.requesterInformation.requesterDetails.addressLine3,
                collectionAddress: this.requestorInformation.requesterInformation.requesterDetails.addressLine1 + ' ' +
                                   this.requestorInformation.requesterInformation.requesterDetails.addressLine2 + ' ' +
                                   this.requestorInformation.requesterInformation.requesterDetails.addressLine3,
                zipcode: this.requestorInformation.requesterInformation.requesterDetails.postalCode,
                phone: this.requestorInformation.requesterInformation.requesterDetails.contactNo,
                requestType: this.data.processName,
            });
        }
        }
        this.loaderService.display(false);
    }, error => {
        this.loaderService.display(false);
    });
}


getRequestorInformation() {
  if (this.data.processName === 'Information Request'  || this.data.processName === 'Single Request') {
      this.loaderService.display(true);
      this.restService.getRequestorInformation(this.data.workflowId).subscribe((res: any) => {
        this.requestorInformation = res.data;
                this.RequestersInfo.patchValue({
                    email: this.requestorInformation.requestLoggedBy.email,
                    firstName: this.requestorInformation.requestLoggedBy.firstName,
                    lastName: this.requestorInformation.requestLoggedBy.surName,
                    requestType: this.requestorInformation.requesterType,
                    formatType: this.requestorInformation.deliveryMedium,
                    deliveryMethod: this.requestorInformation.deliveryMethod
                });
                this.ownMedia = this.requestorInformation.isMediaToDepartment === 1 ? 'Yes' : 'No';
                this.requestorClient = this.requestorInformation.requesterType;
                if (this.requestorClient === 'SELF') {
                    this.requestor = 'Yes';
                } else {
                    this.requestor = 'No';
                }
                    this.requesterForm.patchValue({
                        requesterName: this.requestorInformation.requesterDetails.firstName,
                        requesterSurame: this.requestorInformation.requesterDetails.surName,
                        Email: this.requestorInformation.requesterDetails.email,
                        Fax: this.requestorInformation.requesterDetails.fax,
                        Address1: this.requestorInformation.requesterDetails.addressLine1,
                        Address2: this.requestorInformation.requesterDetails.addressLine2,
                        Address3: this.requestorInformation.requesterDetails.addressLine3,
                        PostalCode: this.requestorInformation.requesterDetails.postalCode,
                        contactNumber: this.requestorInformation.requesterDetails.contactNo
                    });

                if (this.requestorInformation != null && this.requestorInformation !== undefined) {
                    // if (this.requestorInformation.deliveryMedium === 'ELECTRONIC') {
                        this.RequestersInfo.patchValue({
                            add1: this.requestorInformation.requesterDetails.addressLine1,
                            add2: this.requestorInformation.requesterDetails.addressLine2,
                            add3: this.requestorInformation.requesterDetails.addressLine3,
                            collectionAddress: this.requestorInformation.requesterDetails.addressLine1 + ' ' +
                                               this.requestorInformation.requesterDetails.addressLine2 + ' ' +
                                               this.requestorInformation.requesterDetails.addressLine3,
                            zipcode: this.requestorInformation.requesterDetails.postalCode,
                            phone: this.requestorInformation.requesterDetails.contactNo
                        });
                    // }
                }
          this.loaderService.display(false);
      }, error => {
          this.loaderService.display(false);
      });
  } else {
      this.getWorkflowBasedItem();
  }

}
}
