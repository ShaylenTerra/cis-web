import {Component, Input, OnInit} from '@angular/core';
import {StorageConstants} from '../../../constants/localstorage-keys';
import * as enums from '../../../constants/enums';
import {RestcallService} from '../../../services/restcall.service';

@Component({
    selector: 'app-supporting-docs',
    templateUrl: './supporting-docs.component.html',
    styleUrls: ['./supporting-docs.component.css']
})
export class SupportingDocsComponent implements OnInit {

    documentsArr: any[] = [];
    selectedDocument: string;
    fileToUpload: File = null;
    comment: string;
    uploadedFileName = 'Upload document';
    @Input() workflowId;
    @Input() changeDecision: Function;

    constructor(private restService: RestcallService) {
    }

    ngOnInit() {
        this.getDocumentsList();
    }

    getDocumentsList() {
        this.restService.getListItems(enums.List_Master.DOCUMENTFORMAT).subscribe(payload => {
            this.documentsArr = payload.data;
        });
    }

    selectFile(event) {
        this.fileToUpload = event.target.files;
        this.uploadedFileName = event.target.files[0]['name'];
    }

    uploadDocument() {
        const uid = JSON.parse(sessionStorage.getItem(StorageConstants.USERINFO)).userId;
        const formData: FormData = new FormData();
        formData.append('file', this.fileToUpload[0]);
        formData.append('documentType', this.selectedDocument);
        formData.append('comment', this.comment);
        formData.append('userId', uid);
        formData.append('workflowId', this.workflowId);
        this.restService.uploadSupportingDocument(formData).subscribe(payload => {
            this.changeDecision('no');
        });
    }
}
