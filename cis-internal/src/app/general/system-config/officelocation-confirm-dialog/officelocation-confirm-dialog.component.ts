import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LoaderService } from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-officelocation-confirm-dialog',
    templateUrl: './officelocation-confirm-dialog.component.html',
    styleUrls: ['./officelocation-confirm-dialog.component.css']
})
export class OfficeLocationDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<OfficeLocationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
    }

    ngOnInit() {
    }

    deleteOfficeLocation() {
          const obj = {
            'caption': this.data.caption,
            'boundaryId': this.data.boundaryId,
            'reservationSystem': null
          };
          this.loaderService.display(true);
          this.restService.saveLocationReservationSystem(obj).subscribe(() => {
            this.snackbar.openSnackBar('Office location system deleted', 'Success');
            this.loaderService.display(false);
            this.dialogRef.close();
          }, () => {
            this.loaderService.display(false);
          });
      }

}
