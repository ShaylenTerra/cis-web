import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {forkJoin} from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {TemplateModalDialogComponent} from '../modals/template-modal/template-modal.dialog';
import * as enums from './../../constants/enums';
import {EditAddressComponent} from './edit-address/edit-address.component';
import { TempdialogComponent } from './tempdialog/tempdialog.component';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
    groupedMasterTemplates: Array<any> = [];
    isSpinnerVisible = false;
    modules;
    currentBind: TemplatesBind;
    selectedModule;
    showAdd = true;
    selectedTemplate;
    tempTypes;
    selectedTempType;
    tempTypeShow;
    dataBind: { subject: string; mailBody: string, smsBody: string, pdfBody: string };
    fileToUpload: File = null;
    selectedProvince = '';
    provinces: any;
    fileData: any;
    localUrl = '';
    contacts = [];

    constructor(private snackbar: SnackbarService, private dialog: MatDialog,
                private restService: RestcallService, private loaderService: LoaderService) {
    }

    ngOnInit() {
        this.listItemsByListCodes();
        this.loadProvinces();
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
            this.getAllTemplates(this.selectedModule);
        });
    }

    onFileChange(ev: any) {
        if (ev.target.value.length !== 0) {
            const fileList: FileList = ev.target.files;
            if (fileList.length > 0) {
                this.fileData = fileList[0];
            }
        }
    }

    getPdf() {
        if (this.fileData && this.fileData.name === null) {
            this.snackbar.openSnackBar('upload file', 'Error');
            return;
        }
        this.loaderService.display(true);
        const formData = new FormData();
        formData.append('file', this.fileData, this.fileData.name);
        this.restService.getPdf(formData).subscribe((response) => {
                const binaryString = window.atob(response);
                const binaryLen = binaryString.length;
                const bytes = new Uint8Array(binaryLen);
                for (let i = 0; i < binaryLen; i++) {
                    const ascii = binaryString.charCodeAt(i);
                    bytes[i] = ascii;
                }
                const blob = new Blob([bytes], {type: 'application/pdf'});
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'somefile.pdf';
                link.click();
                this.snackbar.openSnackBar('Generated PDF', 'success');
                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
                this.snackbar.openSnackBar('Unknown error while converting to PDF.', 'Error');
            });
    }

    async getAllTemplates(selectedValue) {
        this.loaderService.display(true);
        this.restService.getAllTemplates(selectedValue.itemId).subscribe((response) => {
                const allTemplates = response.data;
                this.groupedMasterTemplates = allTemplates;
                this.currentBind = {
                    module: this.selectedModule,
                    templates: this.groupedMasterTemplates
                };
                this.selectedTemplate = this.currentBind.templates[0];
                const mailObj = this.selectedTemplate.emailDetails,
                smsObj = this.selectedTemplate.smsDetails,
                pdfObj = this.selectedTemplate.pdfDetails;
                this.dataBind = {
                    subject: mailObj && mailObj.subject || '',
                    mailBody: mailObj && mailObj.body || '',
                    smsBody: smsObj && smsObj.body || '',
                    pdfBody: pdfObj || ''
                };
                this.tempTypeShow = this.selectedTempType.itemId;
                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
                this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            });
    }

    moduleChange() {
        this.getAllTemplates(this.selectedModule);
    }

    updateTemplate() {
        const payload = {
            'emailDetails': JSON.stringify({subject: this.dataBind.subject, body: this.dataBind.mailBody}),
            'isActive': 1,
            'itemIdModule': this.selectedModule.itemId,
            'pdfDetails': this.dataBind.pdfBody,
            'smsDetails': JSON.stringify({body: this.dataBind.smsBody}),
            'templateId': this.selectedTemplate.templateId,
            'templateName': this.selectedTemplate.templateName
        };
        this.loaderService.display(true);
        this.restService.updateTemplate(payload).subscribe((result) => {
                this.loaderService.display(false);
                if (result) {
                    this.snackbar.openSnackBar('Updated Template Successfully', 'Success');
                }
            },
            error => {
                this.loaderService.display(false);
                this.snackbar.openSnackBar('Unknown error while updating information.', 'Error');
            });
    }

    templateChange() {
        this.selectedTempType = this.tempTypes[0];
        const mailObj = this.selectedTemplate.emailDetails,
            smsObj = this.selectedTemplate.smsDetails,
            pdfObj = this.selectedTemplate.pdfDetails;
        this.dataBind = {
            subject: mailObj && mailObj.subject || '',
            mailBody: mailObj && mailObj.body || '',
            smsBody: smsObj && smsObj.body || '',
            pdfBody: pdfObj || ''
        };
        this.tempTypeShow = this.selectedTempType.itemId;
    }

    templateTypeChange() {
        this.tempTypeShow = this.selectedTempType.itemId;
    }

    addTemplate() {
        const dialogRef = this.dialog.open(TemplateModalDialogComponent, {
            width: '800'
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data !== 1) {
                this.loaderService.display(true);
                this.restService.addTemplate(data).subscribe(async () => {
                        await this.getAllTemplates(this.selectedModule);
                        this.loaderService.display(false);
                        this.snackbar.openSnackBar('Added Template Successfully', 'Success');
                    },
                    error => {
                        this.loaderService.display(false);
                        this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
                    });
            }
        });
    }

    groupByProperty(inputArray: Array<any>, prop: string) {
        return inputArray.reduce(function (groups, item) {
            const val = item[prop];
            groups[val] = groups[val] || [];
            groups[val].push(item);
            return groups;
        }, {});
    }

    EditProvinceAddressTemplate(selectedProvince) {
        const dialogRef = this.dialog.open(EditAddressComponent, {
            width: '800px',
            data: {
                province: selectedProvince
            }
        });

        dialogRef.afterClosed().subscribe(data => {

        });
    }

    loadProvinces() {
        this.loaderService.display(true);
        this.restService.getAllProviceAddress().subscribe((response) => {
                this.contacts = response.data.filter(p => p.provinceId > 0);
                this.loaderService.display(false);
            },
            error => {
                this.loaderService.display(false);
                this.snackbar.openSnackBar('Unknown error while retreiving information- province.', 'Error');
            });
    }


    tempdialog() {
        const dialogRef = this.dialog.open(TempdialogComponent, {
            width: '800',
            data: this.selectedTemplate,
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                const mailObj = data.emailDetails,
                smsObj = data.smsDetails,
                pdfObj = data.pdfDetails;
                this.dataBind = {
                    subject: mailObj && mailObj.subject || '',
                    mailBody: mailObj && mailObj.body || '',
                    smsBody: smsObj && smsObj.body || '',
                    pdfBody: pdfObj || ''
                };
                this.tempTypeShow = this.selectedTempType.itemId;
            }
        });
    }

}

export class TemplatesBind {
    module: enums.ValuePair;
    templates: Array<Template> = [];
}

export class Template {
    'templateName': string;
    'pdfDetails': string;
    'emailDetails': string;
    'smsDetails': string;
    'templateId': number;
}


