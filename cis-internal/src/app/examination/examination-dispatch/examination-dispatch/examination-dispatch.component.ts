import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-examination-dispatch',
  templateUrl: './examination-dispatch.component.html',
  styleUrls: ['./examination-dispatch.component.css']
})
export class ExaminationDispatchComponent implements OnInit {

  dispatchMethodName;
  dispatchMedia;
  selectedModes;
  deliveryMediasdata;
  dispatchMethod: FormGroup;
  dispatchRefNo;
  dispatchDate;
  deliveryMedias;
  selectedMode;
  deliveryMedia;

  constructor(private fb: FormBuilder, private restService: RestcallService,
    private loaderService: LoaderService) {
      this.dispatchMethod = this.fb.group({
        primaryEmail: '',
        secondaryEmail: '',
        referenceNumber: '',
        dataDispatched: '',
        collectorName: '',
        collectorSurname: '',
        collectorContactNumber: '',
        postaladdressLine1: '',
        postaladdressLine2: '',
        postaladdressLine3: '',
        postalCode: '',
        courierName: '',
        contactPerson: '',
        ftpDetails: '',
        cartDispatchId: 0
    });
     }

     ngOnInit() {
       //this.loadInitial();   
     }

     loadInitial() {
      forkJoin([
          this.restService.getListItems(16),
          this.restService.getListItems(18)
      ]).subscribe(([method, media]) => {
          this.selectedModes = method.data;
          this.selectedMode = method.data[0];
          this.deliveryMedias = media.data;
          this.deliveryMedia = media.data[0];
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
  
      });
  }
  ngOnChanges() {
      this.loadInitial();
    }

}
