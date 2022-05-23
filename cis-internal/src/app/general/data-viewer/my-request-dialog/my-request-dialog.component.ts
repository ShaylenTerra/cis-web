import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-my-request-dialog',
  templateUrl: './my-request-dialog.component.html',
  styleUrls: ['./my-request-dialog.component.css']
})
export class MyRequestDialogComponent implements OnInit {
  requestsData: any = [];
  requestsColumns: string[] = ['objectName', 'query', 'requestStatus', 'requestDate', 'action'];
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  constructor(public dialogRef: MatDialogRef<MyRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.getDataViewerRequest();
  }

  getDataViewerRequest() {
    this.loaderService.display(true);
    this.restService.getDataViewerRequest(this.userId).subscribe(response => {
        this.requestsData = response.data;
        this.loaderService.display(false);
    }, () => {
        this.loaderService.display(false);
    });
  }

  reexecuteQuery(element) {
    this.dialogRef.close(element);
  }
}
