import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {forkJoin} from 'rxjs';
import {AppDateAdapter, APP_DATE_FORMATS} from '../../format-datepicket';
import {LoaderService} from '../../services/loader.service';
import {RestcallService} from '../../services/restcall.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
    providers: [
        {provide: DateAdapter, useClass: AppDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
    ]
})
export class ReportsComponent implements OnInit {
    reportForm: FormGroup;
    module: any;
    RID: any;
    fromDate: any;
    toDate: any;
    userType: string;
    province: any;
    provinces: any;
    modules: any;
    reportModules: any;
    constructor(private restService: RestcallService, private fb: FormBuilder, private loaderService: LoaderService) {
    }

    ngOnInit() {
        const provinceArr = [];
        const userTypeArr = ['INTERNAL', 'EXTERNAL'];
        this.reportForm = this.fb.group({
            reportId: ['', Validators.required],
            module: [''],
            fromDate: [''],
            toDate: [''],
            userType: [userTypeArr],
            provinces: [provinceArr]
        });
        const dat = new Date();
        const d = this.formatDate(dat);
        const backDt = dat.setMonth(dat.getMonth() - 3);
        const backDate = this.formatDate(backDt);
        this.fromDate = backDate;
        this.toDate = d;
        this.loadInitials();
    }

    loadInitials() {
        this.loaderService.display(true);
        forkJoin([
            this.restService.getProvinces(),
            this.restService.getListItems(225)
        ]).subscribe(([provinces, mod]) => {
            this.provinces = provinces.data;
            this.modules = mod.data;
            this.module = this.modules[0];
            this.changeModule();
            const provinceArr = [];
            for (let i = 0; i < this.provinces.length; i++) {
                provinceArr.push(this.provinces[i].provinceId);
            }
            this.reportForm.patchValue({
                provinces: provinceArr
            });
            this.loaderService.display(false);
        });
    }

    changeModule() {
        this.loaderService.display(true);
        this.restService.getAllRoleBasedReportsByModuleId(this.module.itemId).subscribe((res) => {
            this.reportModules = res.data;
            this.RID = this.reportModules[0];
            this.loaderService.display(false);
        });
    }

    getReport(inp) {
        const ext = inp;
        const payload = {
            'fromDate': this.formatDate(this.reportForm.value.fromDate),
            'provinces': this.reportForm.value.provinces,
            'reportId': this.reportForm.value.reportId.reportId,
            'toDate': this.formatDate(this.reportForm.value.toDate),
            'userType': this.reportForm.value.userType,
            'reportFormat': inp
          };
          this.loaderService.display(true);
            this.restService.getUserSummaryReport(payload).subscribe((res) => {
            this.downloadBlob(res, this.reportForm.value.reportId.reportName + '.' + ext);
            this.loaderService.display(false);
        });
    }

    formatDate(date) {
        const d = new Date(date), year = d.getFullYear();
        let month = '' + (d.getMonth() + 1), day = '' + d.getDate();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
      }

      downloadBlob(blob, name) {
        this.loaderService.display(true);
        // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');

        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name;

        // Append link to the body
        document.body.appendChild(link);

        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        // Remove link from body
        document.body.removeChild(link);
        this.loaderService.display(false);
    }
}

