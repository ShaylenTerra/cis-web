import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-pre-sub-modal',
    templateUrl: './pre-sub-modal.dialog.html',
    styleUrls: ['pre-sub-modal.dialog.css']
})
export class PreSubModalDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<PreSubModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService) {
    }

  ngOnInit() {
  }

  notify() {
    const payload = {
      'referenceNo': this.data.refNo,
      'userId': JSON.parse(sessionStorage.getItem('userInfo')).userId
    };
    this.restService.getSubscriptionNotify(payload).subscribe((res: any) => {
  });
  }
}
