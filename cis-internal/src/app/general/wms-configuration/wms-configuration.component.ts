import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-wms-configuration',
  templateUrl: './wms-configuration.component.html',
  styleUrls: ['./wms-configuration.component.css']
})
export class WmsConfigurationComponent implements OnInit {

 gisUrl;

    constructor(private dom: DomSanitizer) {

    }

  ngOnInit(): void {
    this.gisUrl = this.dom.bypassSecurityTrustResourceUrl(environment.gisServerUrl + '/Wmsconfig3.aspx');
  }

}
