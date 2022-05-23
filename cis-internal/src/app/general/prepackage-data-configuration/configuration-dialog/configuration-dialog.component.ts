import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoaderService} from '../../../services/loader.service';
import {RestcallService} from '../../../services/restcall.service';
import {SnackbarService} from '../../../services/snackbar.service';

@Component({
    selector: 'app-configuration-dialog',
    templateUrl: './configuration-dialog.component.html',
    styleUrls: ['./configuration-dialog.component.css']
})
export class ConfigurationDialogComponent implements OnInit {
    configform: FormGroup;
    dataSource = [];
    columns = ['subscription', 'daily', 'weekly', 'monthly', 'yearly'];
    fileToUpload: File = null;
    docName: string;
    fileUrl: string;
    configdata: any;
    buttonstate = 'Submit';
    listitems: any[] = [];
    butDisabled = false;
    locationArr: any[];
    active: any;

    constructor(public dialogRef: MatDialogRef<ConfigurationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
                private restService: RestcallService, private snackbar: SnackbarService,
                private loaderService: LoaderService) {
        this.configdata = this.data.value;
        this.dataSource = this.data.location;
        dialogRef.disableClose = true;
        this.configform = this.fb.group({
            prePackageId: '',
            active: 1,
            configurationData: '',
            cost: 0,
            description: '',
            folder: '',
            name: '',
            prePackageDataType: '',
            sampleFileName: '',
            transactionId: 0,
            sampleImageFile: {}
        });


    }

  ngOnInit() {
    if (this.data.value != null) {
      this.butDisabled = true;
      this.buttonstate = 'Update';
      this.docName = this.configdata.sampleFileName;
      const file = new File([], this.configdata.sampleFileName);
      this.configform = this.fb.group({
        active: this.configdata.active,
        prePackageId: this.configdata.prePackageId,
        configurationData: this.configdata.configurationData,
        cost: this.configdata.cost,
        description: this.configdata.description,
        folder: this.configdata.folder,
        name: this.configdata.name,
        prePackageDataType: Number(this.configdata.prepackageDataTypeId),
        sampleFileName: this.configdata.sampleFileName,
        transactionId: 0,
        sampleImageFile: file
      });


            this.dataSource = this.configdata.configurationData;

            this.configform.patchValue({
                configurationData: JSON.stringify(this.dataSource)
            });
        }
        this.listItemsByListCode();

    }

    listItemsByListCodes() {
        this.restService.listItemsByListCode(30).subscribe((res: any) => {
            this.locationArr = res.data;
            for (let i = 0; i < res.data.length; i++) {
                this.dataSource.push({subscription: res.data[i].caption, daily: 0, weekly: 0, monthly: 0, yearly: 0});
            }
        });
    }

    listItemsByListCode() {
        this.restService.listItemsByListCode(29).subscribe((res: any) => {
            this.listitems = res.data;
        });
    }

    selectFile(file: FileList) {
        this.fileToUpload = file.item(0);
        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.fileUrl = event.target.value;
        };
        this.docName = this.fileToUpload.name;
        this.configform.patchValue({
            sampleFileName: this.docName,
            sampleImageFile: this.fileToUpload
        });
    }


    onClick(e, data, subtype) {
        const d = this.dataSource.filter(x => x.subscription === data.subscription)[0];
        const index: number = this.dataSource.findIndex(x => x.subscription === data.subscription);
        if (subtype === 'daily') {
            if (index !== -1) {
                d.daily = e.checked ? 1 : 0;
                this.dataSource[index] = d;
            }
        } else if (subtype === 'weekly') {
            if (index !== -1) {
                d.weekly = e.checked ? 1 : 0;
                this.dataSource[index] = d;
            }
        } else if (subtype === 'monthly') {
            if (index !== -1) {
                d.monthly = e.checked ? 1 : 0;
                this.dataSource[index] = d;
            }
        } else if (subtype === 'yearly') {
            if (index !== -1) {
                d.yearly = e.checked ? 1 : 0;
                this.dataSource[index] = d;
            }
        }
        this.configform.patchValue({
            configurationData: JSON.stringify(this.dataSource)
        });

    }

    submit() {
        this.loaderService.display(true);
        this.configform.patchValue({
            active: (this.configform.value.active === false || this.configform.value.active === 0) ? 0 : 1
        });
        this.restService.addPrePackageConfig(this.configform.value).subscribe((res) => {
            if (res.code === 50000) {
                this.snackbar.openSnackBar('Error occured', 'Error');
            } else {
                this.snackbar.openSnackBar('Prepackaged configuration '
                + this.buttonstate === 'Update' ? 'Updated' : 'Added', 'Success');
            }
            this.dialogRef.close();
            this.loaderService.display(false);
        }, error => {
            this.loaderService.display(false);
        });
    }


}
