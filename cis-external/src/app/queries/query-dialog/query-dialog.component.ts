import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-query-dialog',
    templateUrl: './query-dialog.component.html',
    styleUrls: ['./query-dialog.component.css']
})
export class QueryDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<QueryDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  ngOnInit() {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
