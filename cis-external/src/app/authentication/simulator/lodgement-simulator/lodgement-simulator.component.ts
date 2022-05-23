
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';

@Component({
  selector: 'app-lodgement-simulator',
  templateUrl: './lodgement-simulator.component.html',
  styleUrls: ['./lodgement-simulator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LodgementSimulatorComponent implements OnInit {

  selectedmenu = 'IRS';
  infoData;
  infoType;
  state;
  categorydata: any[] = [];
  selectedCat;
  categoryType: any[] = [];
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
  showResult = false;
  form: FormGroup;

  constructor(private restService: RestcallService, private loaderService: LoaderService, private fb: FormBuilder, private route:Router) { 
    this.form = this.fb.group({
      infoType: '',
      selectedCat: '',
      selectedMode: ''
    });
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin([
      this.restService.getLodegementType(),
      this.restService.getListItems(16),
      this.restService.getListItems(18)
    ]).subscribe(([categoryLodge, method, media]) => {
      this.infoData = categoryLodge.data;
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

  getLodgementCategory(id) {
    this.restService.getLodegementCategory(id).subscribe((res: any) => {
      this.categoryType = res.data;
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
    this.getLodgementCategory(event.value.categoryId);
    this.categorydata = [];
    this.state = event.value.name;
    let obj: any = {};
    obj = event.value;
    this.categorydata.push(obj);
  }

  changeManu(value) {
    this.selectedmenu = value;
  }

  reset() {
    this.infoType = undefined;
    this.selectedCat = undefined;
    this.selectedMode = this.selectedModes[0];
    this.showResult = false;
    this.form = this.fb.group({
      infoType: '',
      selectedCat: '',
      selectedMode: this.selectedModes[0]
    });
    this.form.clearValidators();
    this.form.updateValueAndValidity();
    // this.form.get('infoType').markAsUntouched();
    // this.form.get('selectedCat').markAsUntouched();
  }

  calculate() {
    if (this.form.invalid) {
      this.form.get('infoType').markAsTouched();
      this.form.get('selectedCat').markAsTouched();
      this.scrollToError();
      this.loaderService.display(false);
    } else {
    const obj = {
      'type': 'LODGEMENT',
      'categoryId': 0, //this.infoType.itemId,
      'categoryTypeId': this.selectedCat,
      'formatId': 0,
      'paperSize': 0,
      'itemCount': 0,
      'deliveryMethodId': this.selectedMode.itemId,
      'deliveryMediumId': 0
    };
    this.loaderService.display(true);
    this.restService.feeSimulator(obj).subscribe((res: any) => {
      this.calculationData = res.data;
      this.showResult = true;
      this.loaderService.display(false);
    }, error => {
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
