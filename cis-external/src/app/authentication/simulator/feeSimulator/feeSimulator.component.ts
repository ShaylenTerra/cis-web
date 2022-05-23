import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestcallService } from '../../../services/restcall.service';
import * as enums from '../../../constants/enums';
import { LoaderService } from '../../../services/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-feeSimulator',
  templateUrl: './feeSimulator.component.html',
  styleUrls: ['./feeSimulator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FeeSimulatorComponent implements OnInit {
  selectedmenu = 'IRS';
  infoData;
  infoType;
  state;
  categorydata: any[] = [];
  selectedCat;
  AlphaNumeric;
  ItemNumber = 1;
  formatType;
  diagramsData = [];
  generalData = [];
  spatialData = [];
  coordinateData = [];
  certificatesData = [];
  alphaNumericsData = [];
  paperSize = [];
  documentFormat = [];
  certificateType = [];
  spatialType = [];
  alphaType = [];
  coordinateType = [];
  selectedCertificate;
  selectedimg;
  cadastrialImagedata: [];
  selectedModes;
  deliveryMedias;
  deliveryMediasdata;
  selectedMode;
  deliveryMedia;
  calculationData;
  format;
  paper;
  showResult = false;
  statData = [{'name': 'Not Applicable', 'value':'Not Applicable'}];
  supplyData= this.statData[0].value;
  form: FormGroup;
  selectedCatDummy;
  constructor(private restService: RestcallService, private loaderService: LoaderService, private fb: FormBuilder,
    private route:Router) { 
    this.form = this.fb.group({
      infoType: '',
      selectedCat: '',
      selectedCatDummy: '',
      supplyData: '',
      format: '',
      paper: '',
      ItemNumber: 1,
      selectedMode: '',
      deliveryMedia: ''
    });
  }

  ngOnInit(): void {
    this.getListIetms();
    this.loadData();
  }

  loadData() {
    forkJoin([
      this.restService.getListItems(266),
      this.restService.getListItems(enums.list_master.FORMATTYPE),
      this.restService.getListItems(enums.list_master.PAPERSIZE),
      this.restService.getListItems(enums.list_master.DOCUMENTFORMAT),
      this.restService.getListItems(enums.list_master.CERTIFICATES),
      this.restService.getListItems(enums.list_master.SPATIALDOCUMENTFORMAT),
      this.restService.getListItems(enums.list_master.ALPHADOCUMENTFORMAT),
      this.restService.getListItems(201),
      this.restService.getListItems(267),
      this.restService.getListItems(16),
      this.restService.getListItems(18)
    ]).subscribe(([info,formatType, paperSize, documentFormat, certificateType, spatialType, alphaType,
                   coordinateType, cadastrialImage, method, media]) => {
      this.infoData = info.data;
      this.infoType = this.infoData.filter(x=>x.isDefault == 1)[0];
      this.formatType = formatType.data;
      this.paperSize = paperSize.data;
      this.documentFormat = documentFormat.data;
      this.certificateType = certificateType.data;
      this.spatialType = spatialType.data;
      this.alphaType = alphaType.data;
      this.coordinateType = coordinateType.data;
      this.cadastrialImagedata = cadastrialImage.data;
      this.selectedModes = method.data;
      this.selectedMode = method.data[0];
      this.deliveryMedias = media.data;
      if (this.selectedMode.caption === 'ELECTRONIC') {
        this.deliveryMediasdata = [];
        for (let i = 0; i < this.deliveryMedias.length; i++) {
          if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
            this.deliveryMediasdata.push(this.deliveryMedias[i]);
          }
        }
      } else {
        this.deliveryMediasdata = [];
        for (let i = 0; i < this.deliveryMedias.length; i++) {
          if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
          } else {
            this.deliveryMediasdata.push(this.deliveryMedias[i]);
          }
        }
      }
      this.deliveryMedia = media.data[0];
      this.selectedCat = undefined;
      this.categorydata = [];
      this.state = this.infoType.caption;
      let obj: any = {};
      obj = this.infoType
      
      if (this.state === 'Spatial Data' || this.state === 'Alpha Numeric data') {
        this.selectedCatDummy = this.infoType.itemId;
        this.form.patchValue({
          selectedCatDummy: this.infoType.itemId
        });
      } else if (this.infoType.itemId == 587 || this.infoType.itemId == 589 || this.infoType.itemId == 590 || this.infoType.itemId == 591) {
        this.selectedCat = this.infoType.itemId;
      } else if (this.infoType.itemId === 586 || this.infoType.itemId === 588) {
        this.selectedCat = undefined;
      }
      this.categorydata.push(obj);
      this.form.patchValue({
        infoType: this.infoType,
        selectedCatDummy: this.infoType.itemId,
        supplyData: this.supplyData,
        ItemNumber: 1,
        selectedMode: this.selectedMode,
        deliveryMedia: this.deliveryMedia
      });
      // this.isSpinnerVisible = false;
    });
  }

  getListIetms() {
    this.restService.getListItems(266).subscribe((res: any) => {
      this.infoData = res.data;
      this.infoType = this.paperSize.filter(x=>x.isDefault == 1)[0];

    });
  }


  deliveryMediaChange(selectedMode) {
    if (selectedMode.caption === 'ELECTRONIC') {
      this.deliveryMediasdata = [];
      for (let i = 0; i < this.deliveryMedias.length; i++) {
        if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
          this.deliveryMediasdata.push(this.deliveryMedias[i]);
        }
      }
    } else {
      this.deliveryMediasdata = [];
      for (let i = 0; i < this.deliveryMedias.length; i++) {
        if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
        } else {
          this.deliveryMediasdata.push(this.deliveryMedias[i]);
        }
      }
    }
  }

  onInfoTypeChange(event) {
    this.form.patchValue({
      selectedCat: '',
      format: '',
      paper: ''
    });
    this.format = undefined;
    this.paper = undefined;
    this.categorydata = [];
    this.state = event.value.caption;
    let obj: any = {};
    
    obj = event.value;
    
    if (this.state === 'Spatial Data' || this.state === 'Alpha Numeric data') {
      this.selectedCatDummy = this.infoType.itemId;
      this.form.patchValue({
        selectedCatDummy: this.infoType.itemId
      });
    } else if (this.infoType.itemId == 587 || this.infoType.itemId == 589 || this.infoType.itemId == 590 || this.infoType.itemId == 591) {
      this.selectedCat = this.infoType.itemId;
    } else if (this.infoType.itemId === 586 || this.infoType.itemId === 588) {
      this.selectedCat = undefined;
    }
    this.categorydata.push(obj);
    this.form.patchValue({
      selectedCatDummy: this.infoType.itemId,
      supplyData: this.supplyData
    });
    
  }

  changeManu(value) {
    this.selectedmenu = value;
  }

  reset() {
    this.state = undefined;
    this.form.patchValue({
      selectedCat: '',
      format: '',
      paper: ''
    });
    this.format = undefined;
    this.paper = undefined;
    this.infoType = this.infoData.filter(x=>x.isDefault == 1)[0];
    this.selectedMode = this.selectedModes[0];
    this.deliveryMedia = this.deliveryMedias[0];
    // this.ItemNumber = undefined;
    // this.AlphaNumeric = undefined;
    this.showResult = false;
    if (this.selectedMode.caption === 'ELECTRONIC') {
      this.deliveryMediasdata = [];
      for (let i = 0; i < this.deliveryMedias.length; i++) {
        if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
          this.deliveryMediasdata.push(this.deliveryMedias[i]);
        }
      }
    } else {
      this.deliveryMediasdata = [];
      for (let i = 0; i < this.deliveryMedias.length; i++) {
        if (this.deliveryMedias[i].caption === 'EMAIL' || this.deliveryMedias[i].caption === 'FTP') {
        } else {
          this.deliveryMediasdata.push(this.deliveryMedias[i]);
        }
      }
    }
    this.deliveryMedia = this.deliveryMedias[0];
    this.selectedCat = undefined;
    this.categorydata = [];
    this.state = this.infoType.caption;
    let obj: any = {};
    obj = this.infoType
    this.categorydata.push(obj);
    if (this.state === 'Spatial Data' || this.state === 'Alpha Numeric data') {
      this.selectedCatDummy = this.infoType.itemId;
      this.form.patchValue({
        selectedCatDummy: this.infoType.itemId
      });
    } else if (this.infoType.itemId == 587 || this.infoType.itemId == 589 || this.infoType.itemId == 590 || this.infoType.itemId == 591) {
      this.selectedCat = this.infoType.itemId;
    } else if (this.infoType.itemId === 586 || this.infoType.itemId === 588) {
      this.selectedCat = undefined;
    }
    this.form.patchValue({
      infoType: this.infoType,
      selectedCat: '',
      selectedCatDummy: this.infoType.itemId,
      supplyData: this.supplyData,
      ItemNumber: 1,
      selectedMode: this.selectedMode,
      deliveryMedia: this.deliveryMedia
    });
  }

  calculate() {
    this.setValidation();
    if (this.form.invalid) {
      this.form.get('infoType').markAsTouched();
      this.form.get('selectedCat').markAsTouched();
      this.form.get('ItemNumber').markAsTouched();
      this.form.get('format').markAsTouched();
      this.form.get('paper').markAsTouched();
      this.scrollToError();
      this.loaderService.display(false);
    } else {
    let categoryId = 0;
    switch (this.infoType.itemId) {
      case 586:
          categoryId = enums.list_FeeCategoryType.Certificates;
          break;
      case 587:
          categoryId = enums.list_FeeCategoryType.Miscellaneous;
          break;
      case 588:
          categoryId = enums.list_FeeCategoryType.CADASTRAL_IMAGES;
          break;
      case 589:
          categoryId = enums.list_FeeCategoryType.Spatial_Data;
          break;
      case 590:
          categoryId = enums.list_FeeCategoryType.Advisory_Service;
          break;
      case 591:
          categoryId = enums.list_FeeCategoryType.Cordinates;
          break;
      case 592:
          categoryId = enums.list_FeeCategoryType.Alpha_Numerics;
          break;
    }
    const obj = {
      'type': 'INFORMATION_REQUEST',
      'categoryId': categoryId, //this.infoType.itemId,
      'categoryTypeId': (this.state === 'Preparation of Certificates') ?  this.selectedCat : 0,
      'formatId': this.format !== undefined ? this.format.itemId : 0,
      'paperSize': this.paper !== undefined ? this.paper : 0,
      'itemCount': this.ItemNumber,
      'deliveryMethodId': this.selectedMode.itemId,
      'deliveryMediumId': this.deliveryMedia.itemId
    };
    this.loaderService.display(true);
    this.restService.feeSimulator(obj).subscribe((res: any) => {
      this.calculationData = res.data;
      this.showResult = true;
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    });
    }
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid[formControlName]');
    this.scrollTo(firstElementWithError);
  }

  setValidation() {
    const infoType = this.form.get('infoType');
    const selectedCat = this.form.get('selectedCat');
    const ItemNumber = this.form.get('ItemNumber');
    const format = this.form.get('format');
    const paper = this.form.get('paper');
    switch (this.infoType.itemId) {
      case 586: //Certificates
      case 588: //CADASTRAL_IMAGES
          infoType.setValidators([Validators.required]);
          selectedCat.setValidators([Validators.required]);
          ItemNumber.setValidators([Validators.required]);
          format.setValidators([Validators.required]);
          paper.setValidators([Validators.required]);
          break;
      case 587: //Miscellaneous
      case 590: //Advisory_Service
          selectedCat.setValidators(null);
          format.setValidators(null);
          paper.setValidators(null);
          selectedCat.clearValidators();
          selectedCat.updateValueAndValidity();
          format.clearValidators();
          format.updateValueAndValidity();
          paper.clearValidators();
          paper.updateValueAndValidity();
          break;
      case 589: //Spatial_Data
      case 591: //Cordinates
      case 592: //Alpha_Numerics
          selectedCat.setValidators(null);
          format.setValidators([Validators.required]);
          paper.setValidators(null);  
          paper.clearValidators();
          paper.updateValueAndValidity();
          selectedCat.clearValidators();
          selectedCat.updateValueAndValidity();
          break;
    }
  
  }
  nvigate(value){
    this.route.navigate(['authentication/' + value]);
  }
}
