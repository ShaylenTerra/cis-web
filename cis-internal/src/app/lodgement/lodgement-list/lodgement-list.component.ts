import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import { ProcessID } from '../../constants/enums';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TopMenuService } from '../../services/topmenu.service';
import { LodgementDraftDialogComponent } from './lodgement-draft-dialog/lodgement-draft-dialog.component';

@Component({
  selector: 'app-lodgement-list',
  templateUrl: './lodgement-list.component.html',
  styleUrls: ['./lodgement-list.component.css']
})
export class LodgementListComponent implements OnInit, AfterViewInit {
  direction = '';
  activefield = '';
  sortArr: any[] = [];
  activePage = 0;
  activesize = 10;
  activePageFrom = 1;
  activePageTo = 10;
  tasks;
  isSpinnerVisible = false;
  displayedColumns: string[] = ['referenceNumber', 'reservationName', 'processName', 'provinceName', 'actionRequiredCaption', 'internalStatusCaption', 'triggeredOn', 'lastStatusUpdate'];
  lodgementColumns: string[] = ['draftName', 'username', 'updated'];
  dataLength: number;
  dataSource: any[] = [];

  @ViewChild(MatSort) matSort1: MatSort;
  @ViewChild(MatPaginator) paginator1: MatPaginator;

  @ViewChild('table2', { read: MatSort }) matSort2: MatSort;
  @ViewChild('table2', { read: MatPaginator }) paginator2: MatPaginator;
  page2 = 0;
  size2 = 10;
  PageFrom2 = 1;
  PageTo2 = 10;
  totalprepackaged: any;
  dataSourceLodgement: any[] = []

  dataSourceLodgementData: any[] = [];
  userId: number;
  dataSourceList: any;
  dataSourceLodgementList: any;
  dataLengthRes: number;
  filteredDrafts: any[] = [];

  filteredDraftsData: any[] = [];
  serverDate: any;
  filteredLodgement: any[] = [];

  constructor(
    private router: Router,
    private restService: RestcallService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private topMenu: TopMenuService, private ref: ChangeDetectorRef) {

    const navig = this.topMenu.iconsInfo.filter(x => x.name ===
      router.getCurrentNavigation().finalUrl.root.children.primary.segments[0].path);
    if (navig.length > 0) {
      this.topMenu.navigate(navig[0].id);
    }
  }

  ngOnInit() {
    const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    this.userId = userInfoJson.userId;
    this.getAllLodgementDraft('');
    this.getLodgementsList();

  }


  ngAfterViewInit() {
    // const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    // this.userId = userInfoJson.userId;
    // this.getAllLodgementDraft('');
    // this.getLodgementsList();

    if (this.dataSourceList !== undefined) {
      this.refreshTable()
    }
    if (this.dataSourceLodgementList !== undefined) {
      this.refreshTableLodgement();
    }
  }

  ngOnChanges() {
    // const userInfoJson = JSON.parse(sessionStorage.getItem('userInfo'));
    // this.userId = userInfoJson.userId;
    // this.getAllReservationDraft('');
    // this.getLodgementsList();
  }

  createDraft(): void {
    const dialogRef = this.dialog.open(LodgementDraftDialogComponent, {
      width: '550px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(resultCode => {
      if (resultCode === 1) {
        this.getAllLodgementDraft('');
      } else {
        this.router.navigate(['/lodgement/lodgement-draft'], { state: { lodgeData: resultCode.data } });
      }
    });
  }

  getAllLodgementDraft(stat: any) {
    this.loaderService.display(true);
    this.restService.getAllLodgementDraft().subscribe(response => {
      if (response.code === 50000) {
        this.loaderService.display(false);
        return;
      } else {
        this.filteredDraftsData = response.data;
        this.dataSource = response.data;
        this.filteredDrafts = this.filteredDraftsData;
        this.refreshTable()
        this.loaderService.display(false);
      }
    }, () => {
      this.loaderService.display(false);
    });
  }

  gotoLodgementDetails(element) {
    this.router.navigate(['/lodgement/lodgement-draft'], { state: { lodgeData: element } });
  }

  getLodgementsList() {
    this.loaderService.display(true);
    this.restService.getLodgementsList(ProcessID.Lodgement, this.userId).subscribe(response => {
      if (response.code === 50000) {
        this.loaderService.display(false);
        return;
      } else {
        this.filteredLodgement = response.data;
        this.dataSourceLodgement = response.data;

        this.refreshTableLodgement();
        this.serverDate = response.timestamp;
        this.loaderService.display(false);
      }
    }, () => {
      this.loaderService.display(false);
    });
  }

  filterAll(val) {
    this.filteredDrafts = this.filteredDraftsData;
    if (val.target.value !== undefined && val.target.value !== null) {
      this.filteredDrafts = this.filteredDrafts.filter((task) => task.name.toLowerCase().includes(val.target.value.toLowerCase()) ||
        task.provinceName.toLowerCase().includes(val.target.value.toLowerCase()));
    }
    this.refreshTable();
  }

  refreshTable() {
    this.dataSourceList = new MatTableDataSource(this.filteredDrafts);
    this.dataSourceList.paginator = this.paginator2;
    this.dataSourceList.sort = this.matSort2;
    this.dataLength = this.filteredDrafts.length || 0;
  }

  gotolodgement(element) {
    this.router.navigate(['/lodgement/lodgement-task'], { state: { lodgeData: element } });
  }

  filterReservationRequests(val) {
    this.filteredLodgement = this.dataSourceLodgement;
    if (val.target.value !== undefined && val.target.value !== null) {
      this.filteredLodgement = this.dataSourceLodgement.filter((data) => data.referenceNumber.toLowerCase().includes(val.target.value.toLowerCase()) ||
        data.reservationName.toLowerCase().includes(val.target.value.toLowerCase()));
    }
    this.refreshTableLodgement();
  }

  refreshTableLodgement() {
    this.dataSourceLodgementList = new MatTableDataSource(this.filteredLodgement);
    this.ref.detectChanges();
    this.dataSourceLodgementList.paginator = this.paginator1;
    this.dataSourceLodgementList.sort = this.matSort1;
    this.dataLengthRes = this.dataSourceLodgement.length || 0;
    setTimeout(() => this.dataSourceLodgementList.sort = this.matSort1);
  }

  download() {
    const data: any = this.dataSourceLodgement,
      d = new Date(),
      todayDate = [d.getDate(), d.getMonth(), d.getFullYear()].join('-'),
      fileName = `lodgement_${todayDate}`;
    const options = {
      fieldSeparator: ',',
      filename: fileName,
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }


}
