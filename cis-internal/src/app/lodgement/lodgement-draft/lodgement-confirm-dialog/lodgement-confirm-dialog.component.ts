import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-lodgement-confirm-dialog',
  templateUrl: './lodgement-confirm-dialog.component.html',
  styleUrls: ['./lodgement-confirm-dialog.component.css']
})
export class LodgementConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LodgementConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
  }

  deleteDraft() {
    this.loaderService.display(true);
    this.restService.deleteLodgementDraftByDraftId(this.data.draftId).subscribe(res => {
      this.snackbar.openSnackBar('Draft deleted', 'Success');
      this.loaderService.display(false);
      this.dialogRef.close(res);
    }, () => {
      this.loaderService.display(false);
    });
  }

}
