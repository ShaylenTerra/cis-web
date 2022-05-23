import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
    type: string;
    action: string;
}

@Component({
    selector: 'app-action-modal',
    templateUrl: './action-modal.dialog.html',
    styleUrls: ['./action-modal.dialog.css']
})
export class ActionModalDialogComponent implements OnInit {
    response = {
        comments: ''
    };

    constructor(public dialogRef: MatDialogRef<ActionModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
    }

}
