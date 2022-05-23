import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-delete-draft-step-dialog',
  templateUrl: './delete-draft-step-dialog.component.html',
  styleUrls: ['./delete-draft-step-dialog.component.css']
})
export class DeleteDraftStepDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDraftStepDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  deleteDraftSteps() {
    this.loaderService.display(true);
    this.restService.deleteDraftSteps(this.data).subscribe((res: any) => {
      this.loaderService.display(false);
      this.dialogRef.close();
    }, error => {
      this.loaderService.display(false);
    });
  }
}
