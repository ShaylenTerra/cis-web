import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {forkJoin} from 'rxjs';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import {AddModalComponent} from './add.modal';
import {NewFeeModalComponent} from './new-fee/new-fee-modal';

@Component({
    selector: 'app-fee-config',
    templateUrl: './fee-config.component.html',
    styleUrls: ['./fee-config.component.css']
})
export class FeeConfigComponent implements OnInit {
    catogories: Array<DataModel>;
    selectedCategory: DataModel;
    subCategories: Array<SubCategory> = [];
    feeRand: number;
    feeType: FeeType;
    catDes = '';
    subCatDes = '';
    isCatActive = true;
    isDisabled = true;
    feeTypes: Array<FeeType>;
    isSpinnerVisible = false;
    feeScales: Array<FeeScaleModel> = [];
    selectedScale: FeeScaleModel;
    rawFeeMaster: FeeMasterModel;
    rawSubCategories: any[];
    isActive = false;
    scaleId: number;
    subcatid: number;
    cat;
    subcat;
    categoryId;

    constructor(private snackbar: SnackbarService, private dialog: MatDialog,
                private restService: RestcallService) {
    }

    async ngOnInit() {
        await this.loadInitials();
    }

    scaleChange() {
        this.scaleId = this.selectedScale.feeScaleId;
    }

    async loadInitials() {
        this.isSpinnerVisible = true;
        forkJoin([this.restService.getAllFeeCategories(),
            this.restService.getAllFeeScales(),
            this.restService.getAllFeeType(),
        ])
            .subscribe(([categories, scales, feeTypes]) => {
                    this.catogories = categories && categories.data;
                    this.feeScales = scales && scales.data;
                    this.feeTypes = feeTypes && feeTypes.data;
                    this.selectedScale = this.feeScales[0];
                    this.scaleId = this.feeScales[0].feeScaleId;
                    this.isSpinnerVisible = false;
                },
                error => {
                    this.isSpinnerVisible = false;
                    this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
                });
    }

    getAllFeeCategories() {

    }

    addNewFeeScale() {
        const dialogRef = this.dialog.open(NewFeeModalComponent, {
            width: '600px',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            this.loadInitials();
        });
    }

    categorySelected(item: DataModel) {
        this.rawFeeMaster = null;
        this.subcatid = null;
        this.feeRand = null;
        this.feeType = null;
        this.isActive = false;
        this.categoryId = item.feeCategoryId;
        this.getAllFeeSubCategories(this.categoryId);
        this.selectedCategory = item;

    }

    getAllFeeSubCategories(categoryId) {
        this.restService.getAllFeeSubCategories(categoryId).subscribe(data => {
            this.rawSubCategories = data.data;
            const categorySelected = this.catogories.filter((c) => c.feeCategoryId === categoryId)[0];
            this.subCategories = this.rawSubCategories.filter((sc: any) => {
                return sc.categoryId === categoryId;
            });

            this.catDes = categorySelected.description || '';
            this.subCatDes = '';
            this.isDisabled = false;
            this.isCatActive = true;
        });
    }

    onChange(e) {
        this.isActive = e.checked;
    }

    subCategoryChange(subCategory: SubCategory) {
        this.isSpinnerVisible = true;
        this.feeRand = null;
        this.feeType = null;
        this.isActive = false;
        const subCatSelected: SubCategory = this.subCategories.filter((sc: SubCategory) => {
            return sc.feeSubCategoryId === subCategory.feeSubCategoryId;
        })[0];
        this.subcatid = subCategory.feeSubCategoryId;
        this.restService.getFeeMaster(this.scaleId, this.subcatid).subscribe((details: any) => {
                this.rawFeeMaster = details && details.data;
                if (this.rawFeeMaster != null) {
                    this.isActive = this.rawFeeMaster.isActive === 1 ? true : false;
                    this.feeRand = this.rawFeeMaster.fee;
                    this.feeType = this.feeTypes.filter((f) => f.id === this.rawFeeMaster.feeTypeId)[0];
                }
                this.isSpinnerVisible = false;
            },
            error => {
                this.isSpinnerVisible = false;
                this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
            });
        this.subCatDes = subCatSelected.description || '';
        if (this.rawFeeMaster != null) {
            const feeMasterSelected = this.rawFeeMaster.feeMaster
                .filter((d: FeeMaster) => d.subCategoryId === subCatSelected.feeSubCategoryId)[0];
            this.feeType = feeMasterSelected && this.feeTypes
                .filter((f: FeeType) => f.id === feeMasterSelected.feeTypeId)[0];
            // this.feeRand = feeMasterSelected && feeMasterSelected.fee || "0";
        }
        this.isSpinnerVisible = false;
    }

    update() {
        this.isSpinnerVisible = true;
        const payload = {
            'fee': Number(this.feeRand),
            'feeId': this.rawFeeMaster != null ? this.rawFeeMaster.feeId : null,
            'feeScaledId': this.scaleId,
            'feeSubCategoryId': this.subcatid,
            'feeTypeId': this.feeType.id,
            'isActive': this.isActive ? 1 : 0
        };
        this.restService.saveFeeMaster(payload).subscribe((res) => {
                this.isSpinnerVisible = false;
                if (res.code !== 50000) {
                    this.snackbar.openSnackBar('Fee Updated successfully', 'Success');
                } else {
                    this.snackbar.openSnackBar('Fee not Updated', 'Error');
                }
                this.isSpinnerVisible = false;
            },
            error => {
                this.isSpinnerVisible = false;
                this.snackbar.openSnackBar('Unknown error while saving information.', 'Error');
            });

    }


    getScaleDoc() {
        if (this.scaleId !== undefined) {
            this.restService.getScaleDoc(this.scaleId, this.selectedScale.fileName).subscribe((res: any) => {
                this.downloadBlob(res, this.selectedScale.fileName);
            });
        } else {
            this.snackbar.openSnackBar('Please select fee scale', 'Error');
        }
    }

    downloadBlob(blob, name) {
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
    }

    AddCategoryModalDialog() {
        const dialogRef = this.dialog.open(AddModalComponent, {
            width: '600px',
            data: {
                title: 'Category',
            }
        });

        dialogRef.afterClosed().subscribe((input) => {
        });
    }

    AddSubCategoryModalDialog() {
        const catSelected: any = this.selectedCategory;
        const dialogRef = this.dialog.open(AddModalComponent, {
            width: '600px',
            data: {
                title: 'Sub-Category',
                sc: true,
                category: catSelected
            }
        });

        dialogRef.afterClosed().subscribe((input) => {
            this.rawSubCategories = input;
        });
    }
}

interface FeeMasterModel {
    'fee': number;
    'isActive': number;
    'feeTypeId': number;
    'feeId': number;
    'feeScaleId': number;
    'feeScaleName': string;
    'feeMaster': Array<FeeMaster>;
}

interface FeeMaster {
    'subCategoryId': number;
    'feeTypeName': string;
    'feeTypeId': number;
    'feeMasterIsActive': number;
    'feeMasterId': number;
    'fee': string;
}

interface FeeScaleModel {
    'fileName': string;
    'feeScaleId': number;
    'feeScaleName': string;
    'effectiveDate': Date;
    'description': string;
}

interface DataModel {
    'feeCategoryId': number;
    'name': string;
    'description': string;
    'isActive': number;
}

interface SubCategory {
    'feeSubCategoryId': number;
    'categoryId': number;
    'name': string;
    'description': string;
    'isActive': number;
}

interface FeeType {
    'id': number;
    'feeType': string;
    'description': string;
    'isActive': number;
}
