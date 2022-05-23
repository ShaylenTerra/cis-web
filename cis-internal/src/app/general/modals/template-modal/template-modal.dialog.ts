import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {forkJoin} from 'rxjs';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import * as enums from './../../../constants/enums';

export interface DialogData {
    type: string;
    action: string;
}

@Component({
    selector: 'app-template-action-modal',
    templateUrl: './template-modal.dialog.html',
    styleUrls: ['./template-modal.dialog.css']
})
export class TemplateModalDialogComponent implements OnInit {
    tempTypes;
    selectedTempType;
    modules;
    selectedModule;
    emailSubj = '';
    emailBody = '';
    smsBody = '';
    pdfBody = '';
    templateName = '';
    tempTypeShow;

    constructor(public dialogRef: MatDialogRef<TemplateModalDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData, private restService: RestcallService,
                private loaderService: LoaderService) {
                    dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.listItemsByListCodes();
    }

    listItemsByListCodes() {
        this.loaderService.display(true);
        forkJoin([
            this.restService.getListItems(1),
            this.restService.getListItems(81)
        ]).subscribe(([module, templateType]) => {
            this.modules = module.data;
            this.selectedModule = module.data[0];
            this.tempTypes = templateType.data;
            this.selectedTempType = this.tempTypes[0];
            this.tempTypeShow = this.selectedTempType.itemId;
            this.loaderService.display(false);
        });
    }

    sendData() {
        const response: any = {
            templateName: this.templateName,
            itemIdModule: this.selectedModule.itemId,
            isActive: 1,
            templateId: 0,
            pdfDetails: this.pdfBody,
            emailDetails: JSON.stringify({subject: this.emailSubj, body: this.emailBody}),
            smsDetails: JSON.stringify({body: this.smsBody})
        };
        this.dialogRef.close(response);
    }

    templateTypeChange() {
        this.tempTypeShow = this.selectedTempType.itemId;
    }
}

export class NewTemplateModal {
    'templateName' = '';
    'itemIdModule' = '2';
    'isActive' = '1';
    'pdfDetails' = '';
    'emailDetails' = '';
    'smsDetails' = '';
}
