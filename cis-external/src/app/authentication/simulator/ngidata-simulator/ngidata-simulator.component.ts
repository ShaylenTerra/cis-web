import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestcallService } from '../../../services/restcall.service';
import * as enums from '../../../constants/enums';
import { LoaderService } from '../../../services/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ngidata-simulator',
  templateUrl: './ngidata-simulator.component.html',
  styleUrls: ['./ngidata-simulator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgidataSimulatorComponent implements OnInit {

  selectedmenu = 'IRS';
  infoData;
  infoType;
  state;
  categorydata: any[] = [];
  selectedCat;
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
  ItemNumber;
  Format;
  calculationData;
  showResult = false;
  form: FormGroup;

  constructor(private restService: RestcallService, private loaderService: LoaderService, private fb: FormBuilder,
    private route:Router) { 
    this.form = this.fb.group({
      infoType: '',
      selectedCat: '',
      Format: '',
      selectedMode: '',
      deliveryMedia: ''
    });
  }
  
  ngOnInit(): void {
    // this.getListIetms();
    this.loadData();
  }

  loadData() {
    forkJoin([
      this.restService.getListItems(226),
      this.restService.getListItems(enums.list_master.PAPERSIZE),
      this.restService.getListItems(enums.list_master.DOCUMENTFORMAT),
      this.restService.getListItems(enums.list_master.CERTIFICATES),
      this.restService.getListItems(enums.list_master.SPATIALDOCUMENTFORMAT),
      this.restService.getListItems(enums.list_master.ALPHADOCUMENTFORMAT),
      this.restService.getListItems(201),
      this.restService.getListItems(267),
      this.restService.getListItems(16),
      this.restService.getListItems(18),
      this.restService.ngiDataInformationType()
    ]).subscribe(([formatType, paperSize, documentFormat, certificateType, spatialType, alphaType,
                   coordinateType, cadastrialImage, method, media, searchType]) => {
      this.infoData = searchType.data;
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
      // this.isSpinnerVisible = false;
    });
  }

  getListIetms() {
    this.restService.getListItems(266).subscribe((res: any) => {
      this.infoData = res.data;
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
    this.categorydata = [];
    this.state = event.value.name;
    this.selectedCat = event.value.config;
    this.restService.getNgiDataInformationCategory(event.value.config).subscribe((res: any) => {
      this.categorydata = res.data;
    });
  }

  changeManu(value) {
    this.selectedmenu = value;
  }

  reset() {
    this.infoType = undefined;
    this.selectedCat = undefined;
    this.selectedimg = undefined;
    this.selectedCertificate = undefined;
    this.selectedMode = this.selectedModes[0];
    this.deliveryMedia = this.deliveryMedias[0];
    this.ItemNumber = undefined;
    this.Format = undefined;
    this.showResult = false;
    this.form = this.fb.group({
      infoType: '',
      selectedCat: '',
      Format: '',
      selectedMode: this.selectedModes[0],
      deliveryMedia: this.deliveryMedias[0]
    });
    this.form.reset();
  }

  calculate() {
    if (this.form.invalid) {
      this.form.get('infoType').markAsTouched();
      this.form.get('selectedCat').markAsTouched();
      this.form.get('Format').markAsTouched();
      this.scrollToError();
      this.loaderService.display(false);
    } else {
      const obj = {
        'type': 'NGI',
        'categoryId': this.infoType.itemId,
        'categoryTypeId': this.selectedCat,
        'formatId': this.Format,
        'paperSize': 0,
        'itemCount': 0,
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
  nvigate(value){
    this.route.navigate(['authentication/' + value]);
  }
}
