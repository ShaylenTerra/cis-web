import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-notify-applicant-dialog',
  templateUrl: './notify-applicant-dialog.component.html',
  styleUrls: ['./notify-applicant-dialog.component.css']
})
export class NotifyApplicantDialogComponent implements OnInit {

  message;
  constructor(public dialogRef: MatDialogRef<NotifyApplicantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
