import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {CustomValidators} from 'ng2-validation';
import { LoaderService } from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {RaiseQueryModalDialogComponent} from './raise-query-modal.dialog';

@Component({
  selector: 'app-raise-query',
  templateUrl: './raise-query.component.html',
  styleUrls: ['./raise-query.component.css']
})
export class RaiseQueryComponent implements OnInit {
  // isSpinnerVisible = false;
  form: FormGroup;
  issueTypes;
  name;
  surname;
  email;
  issue;
  description;
  requestorData: any;
  constructor(private fb: FormBuilder, private dialog: MatDialog,
    private restService: RestcallService, private loaderService: LoaderService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      issue: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.restService.getListItems(9).subscribe(response => {
      this.issueTypes = response.data;
    });
  }

  submit() {
    this.loaderService.display(true);
    // const data = {
    //   name: this.name,
    //   email: this.email,
    //   IssueType: this.issue.caption,
    //   description: this.description
    // };
    this.setRequestorData();
    const payload = {
      processid: 11,
      provinceid: -1,
      loggeduserid: -1,
      notes: 'notes',
      context: 'context',
      type: 1,
      processdata: JSON.stringify(this.requestorData), // queryData: data}),
      parentworkflowid: 0,
      assignedtouserid: 0
    };

    this.restService.triggertask(payload).subscribe(response => {
      const tempData = {
        'email': this.email,
        'fullName': this.name + ' ' + this.surname,
        'referenceNo': response.ReferenceNumber,
        'templateId': Number(response.TemplateID),
        'transactionId': response.TransactionId,
        'workflowId': response.WorkflowID,
        'userId': 0
      };
      this.loaderService.display(false);
      const dialogRef = this.dialog.open(RaiseQueryModalDialogComponent, {
        width: '50%',
        data: {
          refNo: response.ReferenceNumber,
          tempData: tempData
        }
      });
      dialogRef.afterClosed().subscribe(async (resultCode) => {
        this.form = this.fb.group({
          name: ['', Validators.required],
          surname: ['', Validators.required],
          email: ['', Validators.compose([Validators.required, CustomValidators.email])],
          issue: ['', Validators.required],
          description: ['', Validators.required]
        });
      });
    });
  }
  setRequestorData() {
    this.requestorData = {
      'requesterInformation': {
        'userId': '',
        'requestLoggedBy': {
            'firstName': this.name,
            'surName': this.surname,
            'contactNo': '',
            'email': this.email,
            'fax': '',
            'addressLine1': '',
            'addressLine2': '',
            'addressLine3': '',
            'postalCode': ''
        },
          'requesterDetails': {
            'firstName': this.name,
            'surName': this.surname,
            'contactNo': '',
            'email': this.email,
            'fax': '',
            'addressLine1': '',
            'addressLine2': '',
            'addressLine3': '',
            'postalCode': ''
        }
      },
      'notifyManagerData': null,
      'queryData': {
        'issueType': this.issue.caption,
        'description': this.form.value.description,
        'firstName': this.name,
        'surName': this.surname,
        'email': this.email
      }
    };
  }
}
