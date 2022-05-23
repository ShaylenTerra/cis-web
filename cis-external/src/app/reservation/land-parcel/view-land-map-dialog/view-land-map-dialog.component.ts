import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

const VIEW_MAP_URL = environment.viewMapServerUrl;
const DEMO_URL = 'http://10.1.15.220:8088/ang_mapview/#/mapview?'

@Component({
  selector: 'app-view-land-map-dialog',
  templateUrl: './view-land-map-dialog.component.html',
  styleUrls: ['./view-land-map-dialog.component.css']
})
export class ViewLandMapDialogComponent implements OnInit {
  mapsrc: any;
  constructor(public dialogRef: MatDialogRef<ViewLandMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService, private dom: DomSanitizer) {
    // this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL + 'DraftID=' + data.draftId + '&stepID=' + data.stepId);
    this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(DEMO_URL + 'DraftID=' + data.draftId + '&stepID=' + data.stepId);
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
