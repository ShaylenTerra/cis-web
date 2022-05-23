import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RestcallService} from '../../services/restcall.service';
import * as constants from '../../constants/storage-keys';

export interface DialogData {
    details;
    type: string;
}

@Component({
    selector: 'app-add-assistant-modal',
    templateUrl: './add-assistant-modal.dialog.html',
    styleUrls: ['./add-assistant-modal.dialog.css']
})
export class AddAssistantModalDialogComponent implements OnInit {
    searchData;
    email: string;

    constructor(public dialogRef: MatDialogRef<AddAssistantModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private restService: RestcallService) {
    }

    ngOnInit() {
    }

    searchUser() {
        this.restService.searchAssistant(this.email, 15).subscribe(res => {
                if (res.data !== undefined) {
                    this.searchData = res.data;
                }
            },
            error => {
                this.onClose(false);
            });
    }

    addUser() {
        const parentUserId = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO)).userId;
        const payload = this.getNewAssistantPayload(parentUserId, this.searchData.userId);
        this.restService.addAssistant(payload).subscribe(data => {
                if (data.data) {
                    this.onClose(true);
                }
            },
            error => {
                this.onClose(false);
            });
    }

    onClose(status): void {
        this.dialogRef.close(status);
    }
    getNewAssistantPayload(parentUserId, assistantId) {
      return {
          id: null,
          userId: parentUserId,
          assistantId: assistantId,
          statusId: 106
      };
    }
}
