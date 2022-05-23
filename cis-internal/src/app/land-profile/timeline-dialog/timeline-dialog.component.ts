import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-timeline-dialog',
  templateUrl: './timeline-dialog.component.html',
  styleUrls: ['./timeline-dialog.component.css']
})
export class TimelineDialogComponent implements OnInit {
  notesData: any;
  result: any;
  constructor(public dialogRef: MatDialogRef<TimelineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.notesData = this.data;
    for (let i = 0; i < this.notesData.length; i++) {
      this.notesData[i].convertedDate = this.notesData[i].dated.substring(0, 10);
      this.notesData[i].convertedTime = this.notesData[i].dated.substring(11, 16);
    }
    this.result = _(_.orderBy(this.data, ['dated'], ['desc']))
      .groupBy((x) => x.convertedDate)
      .map((value, key) => ({date: key, timeline: value}))
      .value();
  }

}
