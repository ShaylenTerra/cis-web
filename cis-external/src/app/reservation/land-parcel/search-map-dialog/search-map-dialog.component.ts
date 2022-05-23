import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

const VIEW_MAP_URL = environment.searchMapServerUrl;
const DEMO_URL = 'http://10.1.15.220:8088/ang_mapview/#/mapview?'
@Component({
  selector: 'app-search-map-dialog',
  templateUrl: './search-map-dialog.component.html',
  styleUrls: ['./search-map-dialog.component.css']
})
export class SearchMapDialogComponent implements OnInit {
  mapsrc: any;
  constructor(public dialogRef: MatDialogRef<SearchMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService,
    private dom: DomSanitizer) {
    // this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL + 'DraftID=' + data.draftId + '&stepID=' + data.stepId);
    this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(DEMO_URL + 'DraftID=' + data.draftId + '&stepID=' + data.stepId);

  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
