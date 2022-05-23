import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

const WORKFLOW_STUDIO_URL = environment.workflowStudioUrl + '/Processes.html';

@Component({
    selector: 'app-wf-studio',
    templateUrl: './wf-studio.component.html',
    styleUrls: ['./wf-studio.component.css']
})
export class WfStudioComponent implements OnInit {

    workflowUrl;
    constructor(private dom: DomSanitizer) {
        this.workflowUrl = this.dom.bypassSecurityTrustResourceUrl(WORKFLOW_STUDIO_URL);
    }

    ngOnInit() {
    }

}
