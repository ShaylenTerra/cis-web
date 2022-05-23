import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {map} from 'rxjs/operators';
import {ConfirmDailogComponent} from '../../search/delivery-page/confirm-dialog';
import {SearchService} from '../../search/search-page/search.service';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-review-process',
  templateUrl: './review-process.component.html',
  styleUrls: ['./review-process.component.css']
})
export class ReviewProcessComponent implements OnInit {
  provinces;
  province;
  filteredProvince;
  provinceForm: FormGroup;
  form: FormGroup;
  assignProvince;
  provincepdata: any[];
  process: any[] = [];
  Attachments: File = null;
  uploadedFileName = 'Upload document';
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  triggerPayload: any;
  requestorData: any;
  constructor (private router: Router, private restService: RestcallService, private searchService: SearchService,
    private loaderService: LoaderService, private dialog: MatDialog, private fb: FormBuilder, private snackbar: SnackbarService) {
      this.form = this.fb.group({
        notes: '',
        processid: '',
      });
      this.provinceForm = this.fb.group({
        assignedProvince: ''
      });
    }

    get getProvince() {
      return this.provinceForm.get('assignedProvince');
    }

  ngOnInit(): void {
    this.getProvinces();
    this.simulateProcess();
  }

  simulateProcess() {
    this.restService.simulateProcess().subscribe((res: any) => {
      this.process = res.data;
    });
  }

  selectAttachments(file: FileList) {
    this.Attachments = file.item(0);
    this.uploadedFileName = file[0]['name'];
  }

  getProvinces() {
    this.restService.getProvinces().subscribe((provinces: any) => {
      this.provinces = provinces.data;
      this.province = provinces.data[0];
      this.provincepdata = provinces.data.filter(x => x.provinceId !== -1);
      this.filteredProvince = provinces.data.filter(x => x.provinceId !== -1);

      this.getProvince.valueChanges
      .pipe(
          map(value => typeof value === 'string' ? value : (value.provinceName)),
          map(province => province ? this.filterProvince(province) :
              this.provincepdata !== undefined ? this.provincepdata.slice() : this.provincepdata)
      ).subscribe(response => {
      this.filteredProvince = response;
      });
    });
  }

  filterProvince(value: string) {
    const filterValue = value.toLowerCase();
    if (this.provincepdata) {
        return this.provincepdata.filter(province => (province.provinceName).toLowerCase().includes(filterValue));
    }
}

assignedProvince(event) {
  this.assignProvince = event.option.value;
}

displayProvince(provincedata) {
    return provincedata ? (provincedata.provinceName) : '';
}

postRequest() {
  // const processData = {
  //   'IssueType': '',
  //   'description': this.form.value.notes,
  //   'name': JSON.parse(sessionStorage.getItem('userInfo')).firstName + ' ' + JSON.parse(sessionStorage.getItem('userInfo')).surname,
  //   'email': JSON.parse(sessionStorage.getItem('userInfo')).email
  // };
  // const data = processData;
  this.loaderService.display(true);
  this.setRequestorData();
    const payload = {
        processid: this.form.value.processid,
        provinceid: this.provinceForm.value.assignedProvince.provinceId,
        loggeduserid: this.userId,
        notes: this.form.value.notes,
        context: 'context',
        type: 1,
        processdata: JSON.stringify(this.requestorData), // queryData: data}),
        parentworkflowid: 0,
        assignedtouserid: 0
    };

    this.restService.triggertask(payload).subscribe(response => {
      this.triggerPayload = {
        'referenceNo': response.ReferenceNumber,
        'templateId': response.TemplateID,
        'transactionId': response.TransactionId,
        'userId': response.userId,
        'workflowId': response.WorkflowID
      };
      this.loaderService.display(false);
      this.openDialog(response.ReferenceNumber, response.WorkflowID);
    });
  }

  openDialog(requestCode, workflowId): void {
        const dialogRef = this.dialog.open(ConfirmDailogComponent, {
            width: '546px',
            data: {
                requestCode: requestCode,
                workflowId: workflowId
            }
        });
        dialogRef.afterClosed().subscribe(() => {
            this.restService.notificationForWorkflowRequest({
                'referenceNo': this.triggerPayload.referenceNo,
                'templateId': this.triggerPayload.templateId,
                'transactionId': this.triggerPayload.transactionId,
                'userId': this.userId,
                'workflowId': this.triggerPayload.workflowId,
            }).subscribe(payload1 => {
                this.snackbar.openSnackBar('Delivery details set.', 'Success');
                this.searchService.trigger();
                this.router.navigate(['./home']);
            });
        });
    }

    setRequestorData() {
      const loggedUserData = JSON.parse(sessionStorage.getItem('userInfo'));
      this.requestorData = {
        'requesterInformation': {
          'userId': this.userId,
          'requestLoggedBy': {
              'firstName': loggedUserData.firstName,
              'surName': loggedUserData.surname,
              'contactNo': loggedUserData.mobileNo,
              'email': loggedUserData.email,
              'fax': '',
              'addressLine1': loggedUserData.userProfile.postalAddressLine1,
              'addressLine2': loggedUserData.userProfile.postalAddressLine2,
              'addressLine3': loggedUserData.userProfile.postalAddressLine3,
              'postalCode': loggedUserData.userProfile.postalCode
          },
          'requesterDetails': {
              'firstName': loggedUserData.firstName,
              'surName': loggedUserData.surname,
              'contactNo': loggedUserData.mobileNo,
              'email': loggedUserData.email,
              'fax': '',
              'addressLine1': loggedUserData.userProfile.postalAddressLine1,
              'addressLine2': loggedUserData.userProfile.postalAddressLine2,
              'addressLine3': loggedUserData.userProfile.postalAddressLine3,
              'postalCode': loggedUserData.userProfile.postalCode
          }
        },
        'notifyManagerData': null,
        'queryData': {
          'issueType': '',
          'description': this.form.value.notes,
          'firstName': JSON.parse(sessionStorage.getItem('userInfo')).firstName,
          'surName': JSON.parse(sessionStorage.getItem('userInfo')).surname,
          'email': JSON.parse(sessionStorage.getItem('userInfo')).email
        }
      };
    }
}
