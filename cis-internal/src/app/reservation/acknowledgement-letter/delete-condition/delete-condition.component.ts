import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-delete-condition',
  templateUrl: './delete-condition.component.html',
  styleUrls: ['./delete-condition.component.css']
})
export class DeleteConditionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteConditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private restService: RestcallService, private snackbar: SnackbarService,
    private loaderService: LoaderService) {
  }

  ngOnInit() {
  }

  deleteCondition() {
    this.loaderService.display(true);
    this.restService.deleteResCond(this.data).subscribe((res: any) => {
      this.loaderService.display(false);
      this.dialogRef.close();
    }, error => {
      this.loaderService.display(false);
    });
  }
}
