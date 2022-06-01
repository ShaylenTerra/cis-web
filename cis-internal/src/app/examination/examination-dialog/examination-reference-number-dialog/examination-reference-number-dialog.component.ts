import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-examination-reference-number-dialog',
  templateUrl: './examination-reference-number-dialog.component.html',
  styleUrls: ['./examination-reference-number-dialog.component.css']
})
export class ExaminationReferenceNumberDialogComponent implements OnInit {
  requestCode = '';
  workflowId;
  decision = 'pending';
  constructor(public dialogRef: MatDialogRef<ExaminationReferenceNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.requestCode = this.data.requestCode;
        this.workflowId = this.data.workflowId;
     }

  ngOnInit(): void {
  }

  get invokeChangeDecision() {
    return this.changeDecision.bind(this);
}

changeDecision(value) {
    this.decision = value;
}

}
