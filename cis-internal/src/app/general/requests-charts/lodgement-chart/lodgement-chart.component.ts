import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeedetailsComponent } from '../../../tasks/task-details/employeedetails/employeedetails.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'app-lodgement-chart',
  templateUrl: './lodgement-chart.component.html',
  styleUrls: ['./lodgement-chart.component.css']
})
export class LodgementChartComponent implements OnInit {

  data: any = [12, 19, 3, 5];
  dateFrom;
  dateTo;
  dateFromProcess;
  dateToProcess;
  dateFromRequestInfo;
  dateToRequestInfo;
  dateFromUserSummary;
  dateToUserSummary;
  type: any = 'bar';
  labels: Array<any> = ['Completed', 'Approved', 'Pending', 'Rejected'];
  options: any = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  @Input() lodgementTab;
  minDate = new Date();
  arri = [];
  arrDatai = [];
  arre = [];
  arrDatae = [];
  arriRole = [];
  arrDataiRole = [];
  arrDataeRole = [];
  arrProvinceLabel = [];
  arrProvinceData = [];
  arrExternalProvinceLabel = [];
  arrExternalProvinceData = [];
  arrRoleLabel = [];
  arrRoleData = [];
  arrProvinceIELable = [];
  arrProvinceDataI = [];
  arrProvinceDataE = [];
  province;
  provincepdata: any[];
  filteredProvince;
  assignProvince;
  status;
  process;
  filterForm: FormGroup;
  filterProcessForm: FormGroup;
  filterInformationRequest: FormGroup;
  filterUserSummary: FormGroup;
  showFilter = false;
  public provinceRoleBarBasicChartData: any;
  public horizontalBarBasicChartData: any;
  public singlebarBasicChartData: any;
  public topsinglebarBasicChartData: any;
  public barBasicChartOption: any;
  public topsinglebarBasicChartOption: any;
  public topsinglebarHorizontalChartOption: any;


  public distributionRoleChartData: any;
  public distributionRoleChartOption: any;
  @ViewChild('distributionRoleChart', { static: false }) distributionRoleChart: ElementRef; // used barStackedChart, barHorizontalChart
  public distributionRoleChartTag: CanvasRenderingContext2D;
  distributionRole: any;
  distributionchartArrLabel = [];
  distributionTTchartArrData = [];

  @ViewChild('pieChart', { static: false }) pieChart: ElementRef; // doughnut
  public pieChartTag: CanvasRenderingContext2D;
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  user = JSON.parse(sessionStorage.getItem('userInfo'));
  informationTopCounts: any;
  processSummaryTopCounts: any;
  userSummaryTopCounts: any;
  userRegistrationTopCounts: any;

  @ViewChild('openRequest', { static: false }) openRequestpieChart: ElementRef; // doughnut
  public openRequestpieChartTag: CanvasRenderingContext2D;

  @ViewChild('closeRequest', { static: false }) closeRequestpieChart: ElementRef; // doughnut
  public closeRequestpieChartTag: CanvasRenderingContext2D;

  @ViewChild('managerAlert', { static: false }) managerAlertpieChart: ElementRef; // doughnut
  public managerAlertpieChartTag: CanvasRenderingContext2D;

  @ViewChild('billingChart', { static: false }) billingChart: ElementRef; // used barStackedChart, barHorizontalChart
  public billingChartTag: CanvasRenderingContext2D;
  public billingChartOption: any;

  public PSRequestChartData: any;
  public PSRequestChartOption: any;
  @ViewChild('PSRequest', { static: false }) PSRequestChart: ElementRef; // used barStackedChart, barHorizontalChart
  public PSRequestChartTag: CanvasRenderingContext2D;

  public PSTaskChartData: any;
  public PSTaskChartOption: any;
  @ViewChild('PSTaskRequest', { static: false }) PSTaskChart: ElementRef; // used barStackedChart, barHorizontalChart
  public PSTaskChartTag: CanvasRenderingContext2D;

  processSummaryOpenChart: any;
  processSummaryCloseChart: any;
  processSummaryManagerAlertChart: any;
  processSummaryBillingChart: any;
  processSummaryRequestChart: any;
  processSummaryTaskChart: any;
  processSummaryOpenchartArrLable = [];
  processSummaryClosechartArrLable = [];
  processSummaryOpenchartArrData = [];
  processSummaryClosechartArrData = [];
  processSummaryManagerAlertchartArrLabel = [];
  processSummaryManagerAlertchartArrData = [];
  processSummaryBillingchartArrLabel = [];
  processSummaryBillingchartArrData = [];
  processSummaryBillingchartArrData1 = [];
  processSummaryRequestchartArrLabel = [];
  processSummaryRequestchartArrData = [];
  processSummaryTaskchartArrLabel = [];
  processSummaryTaskchartArrData = [];

  public PSOpenRequestChartData: any;
  public PSCloseRequestChartData: any;
  public PSManagerAlertChartData: any;
  public BillingChartData: any;



  IRMonthlychartArrLabel = [];
  IRMonthlychartArrData = [];

  IRBeforeTTchartArrLabel = [];
  IRBeforeTTchartArrData = [];
  IRAfterTTchartArrLabel = [];
  IRAfterTTchartArrData = [];

  processSummaryAlertDetail = [];

  public boundaryPage: number;
  pagesize: any = 5;

  public taskboundaryPage: number;
  taskpagesize: any = 10;

  public PSboundaryPage: number;
  PSpagesize: any = 5;

  public invoiceOverviewChartData: any;
  public invoiceOverviewChartOption: any;
  @ViewChild('InvoiceOverviewChart', { static: false }) invoiceOverviewChart: ElementRef; // used barStackedChart, barHorizontalChart
  public invoiceOverviewChartTag: CanvasRenderingContext2D;
  invoiceOverview: any;
  invoiceOverviewchartArrLabel = [];
  invoiceOverviewchartArrData = [];
  internaluser: any;
  processData: any;
  public pieChartOption: any;

  constructor(private restService: RestcallService, private loaderService: LoaderService, private fb: FormBuilder,
    private router: Router, private dialog: MatDialog, private dom: DomSanitizer) {
    this.boundaryPage = 1;
    this.taskboundaryPage = 1;
    this.PSboundaryPage = 1;
  }

  ngOnInit() {

  }

  setFilter() {
    const prvinceArr = [];
    const dat = new Date();
    const d = this.formatDate(dat);
    const backDt = dat.setMonth(dat.getMonth() - 3);
    const backDate = this.formatDate(backDt);
    this.filterForm = this.fb.group({
      provinceIds: [prvinceArr, Validators.required],
      fromDate: backDate,
      toDate: [d, Validators.required],
    });
    this.filterProcessForm = this.fb.group({
      provinceIds: [prvinceArr, Validators.required],
      fromDate: backDate,
      toDate: [d, Validators.required],
      processId: 1
    });
    this.filterInformationRequest = this.fb.group({
      provinceIds: [prvinceArr, Validators.required],
      fromDate: backDate,
      toDate: [d, Validators.required]
    });
    this.filterUserSummary = this.fb.group({
      fromDate: backDate,
      toDate: [d, Validators.required],
      userId: this.userId
    });
    this.process = 1;
    this.dateFrom = backDate;
    this.dateTo = d;
    this.dateFromProcess = backDate;
    this.dateToProcess = d;
    this.dateFromRequestInfo = backDate;
    this.dateToRequestInfo = d;
    this.dateFromUserSummary = backDate;
    this.dateToUserSummary = d;
  }

  initialise() {
    this.loaderService.display(true);
    this.getAllProvince();

  }

  formatDate(date) {
    const d = new Date(date), year = d.getFullYear();
    let month = '' + (d.getMonth() + 1), day = '' + d.getDate();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  addDays(date: any, days: number): Date {
    const futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate;
  }

  setGraphData() {
    setTimeout(() => {
      this.barBasicChartOption = {
        barValueSpacing: 20,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      };

      this.topsinglebarHorizontalChartOption = {
        barValueSpacing: 20,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      };

      this.pieChartOption = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        legend: {
          display: true,
          position: 'right'
        },
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      };
    });
  }
  getAllProvince() {
    this.loaderService.display(true);
    this.assignProvince = '';
    this.restService.getProvinces().subscribe(response => {
      this.provincepdata = response.data.filter(x => x.provinceId !== -1);
      this.filteredProvince = response.data.filter(x => x.provinceId !== -1);
      const provinceArr = [];
      for (let i = 0; i < this.provincepdata.length; i++) {
        provinceArr.push(this.provincepdata[i].provinceId);
      }
      this.filterForm.patchValue({
        provinceIds: provinceArr
      });
      this.filterProcessForm.patchValue({
        provinceIds: provinceArr
      });
      this.filterInformationRequest.patchValue({
        provinceIds: provinceArr
      });

      this.loaderService.display(false);
      this.informationTopCounter();
      const filterCriteria = {
        provinceIds: this.filterForm.value.provinceIds,
        fromDate: this.filterForm.value.fromDate,
        toDate: this.formatDate(this.addDays(this.filterForm.value.toDate, 1))
      };
      this.restService.getUsersStatistics(filterCriteria).subscribe(payload => {
        this.data = payload.data;
        this.loaderService.display(false);
        const SEPERATOR = '-';
        const resultWithCount = _(_.orderBy(this.data, ['userCreationDate'], ['asc']).filter(d => d.userType !== null))
          .groupBy((x) => `${monthNames[new Date(x.userCreationDate).getMonth()]}${SEPERATOR}${new Date(x.userCreationDate).getFullYear().toString().substr(2)}`)
          .map((value, key) => ({
            usercreationdate: key, usertypeInternal: value.filter(z => z.userType === 'INTERNAL').length,
            usertypeExternal: value.filter(z => z.userType === 'EXTERNAL').length, users: value.length
          }))
          .value();

        for (let i = 0; i < resultWithCount.length; i++) {
          this.arri.push(resultWithCount[i].usercreationdate);
          this.arrDatai.push(resultWithCount[i].usertypeInternal);
          this.arrDatae.push(resultWithCount[i].usertypeExternal);
        }

        const resultByProvince = _(this.data.filter(d => d.provinceName !== null && d.userType === 'INTERNAL'))
          .groupBy(x => x.provinceName)
          .map((value, key) => ({ province: key, users: value.length }))
          .value();

        for (let k = 0; k < resultByProvince.length; k++) {
          this.arrProvinceLabel.push(resultByProvince[k].province);
          this.arrProvinceData.push(resultByProvince[k].users);
        }

        const resultByProvinceExternal = _(this.data.filter(d => d.provinceName !== null && d.userType === 'EXTERNAL'))
          .groupBy(x => x.provinceName)
          .map((value, key) => ({ province: key, users: value.length }))
          .value();

        for (let k = 0; k < resultByProvinceExternal.length; k++) {
          this.arrExternalProvinceLabel.push(resultByProvinceExternal[k].province);
          this.arrExternalProvinceData.push(resultByProvinceExternal[k].users);
        }

        const resultByRole = _(this.data.filter(d => d.roleName !== null))
          .groupBy(x => x.roleName)
          .map((value, key) => ({ role: key, users: value.length }))
          .value();

        for (let l = 0; l < resultByRole.length; l++) {
          this.arrRoleLabel.push(resultByRole[l].role);
          this.arrRoleData.push(resultByRole[l].users);
        }

        const resultAllByProvince = _(this.data.filter(d => d.provinceName !== null))
          .groupBy(x => x.userType && x.provinceName)
          .map((value, key1) => ({
            province: key1, usertypeInternal: value.filter(z => z.userType === 'INTERNAL').length,
            usertypeExternal: value.filter(z => z.userType === 'EXTERNAL').length, users: value.length
          }))
          .value();

        for (let m = 0; m < resultAllByProvince.length; m++) {
          this.arrProvinceIELable.push(resultAllByProvince[m].province);
          this.arrProvinceDataI.push(resultAllByProvince[m].usertypeInternal);
          this.arrProvinceDataE.push(resultAllByProvince[m].usertypeExternal);
        }

        const resultByProvinceWithCount = _(this.data.filter(d => d.userType !== null))
          .groupBy((x) => x.provinceName)
          .map((value, key) => ({
            province: key, usertypeInternal: value.filter(z => z.userType === 'INTERNAL').length,
            usertypeExternal: value.filter(z => z.userType === 'EXTERNAL').length, users: value.length
          }))
          .value();

        for (let i = 0; i < resultByProvinceWithCount.length; i++) {
          this.arriRole.push(resultByProvinceWithCount[i].province);
          this.arrDataiRole.push(resultByProvinceWithCount[i].usertypeInternal);
          this.arrDataeRole.push(resultByProvinceWithCount[i].usertypeExternal);
        }

        this.tabClick();
      },
        () => {
          this.loaderService.display(false);
        });

    }, () => {
      this.loaderService.display(false);
    });
    this.loaderService.display(false);
  }

  clear() {
    this.clearData();
    const dat = new Date();
    const d = this.formatDate(dat);
    const backDt = dat.setMonth(dat.getMonth() - 3);
    const backDate = this.formatDate(backDt);
    const provinceArr = [];
    for (let i = 0; i < this.provincepdata.length; i++) {
      provinceArr.push(this.provincepdata[i].provinceId);
    }
    this.filterForm.patchValue({
      provinceIds: provinceArr,
      fromDate: backDate,
      toDate: d,
    });
    this.initialise();
  }

  clearInformationRequest() {
    const dat = new Date();
    const d = this.formatDate(dat);
    const backDt = dat.setMonth(dat.getMonth() - 3);
    const backDate = this.formatDate(backDt);
    const provinceArr = [];
    for (let i = 0; i < this.provincepdata.length; i++) {
      provinceArr.push(this.provincepdata[i].provinceId);
    }
    this.filterInformationRequest.patchValue({
      provinceIds: provinceArr,
      fromDate: backDate,
      toDate: d
    });
    this.dateFromRequestInfo = backDate;
    this.dateToRequestInfo = d;

    this.searchInformationRequest();
  }

  clearData() {
    this.arri = [];
    this.arrDatai = [];
    this.arre = [];
    this.arrDatae = [];
    this.arrProvinceLabel = [];
    this.arrProvinceData = [];
    this.arrRoleLabel = [];
    this.arrRoleData = [];
    this.arrProvinceIELable = [];
    this.arrProvinceDataI = [];
    this.arrProvinceDataE = [];
  }

  tabClick() {

    this.informationTopCounter();
    this.getProcessSummaryOpenRequests();
    this.getProcessSummaryManagerAlerts();
    this.getProcessSummaryBilling();
    this.getProcessSummaryRequestDistibution();
    this.getProcessSummaryTaskDistibution();
    this.getProcessSummaryAlertDetails();
    this.getinvoiceOverviewStatus();

    this.setGraphData();
  }

  searchInformationRequest() {
    if (this.filterInformationRequest.invalid) {
      this.filterInformationRequest.get('provinceIds').markAsTouched();
      this.filterInformationRequest.get('fromDate').markAsTouched();
      this.filterInformationRequest.get('toDate').markAsTouched();
      return;
    } else {
      this.filterInformationRequest.patchValue({
        fromDate: this.formatDate(this.filterInformationRequest.value.fromDate),
        toDate: this.formatDate(this.filterInformationRequest.value.toDate)
      });
      this.informationTopCounter();
      this.getProcessSummaryOpenRequests();
      this.getProcessSummaryManagerAlerts();
      this.getProcessSummaryBilling();
      this.getProcessSummaryRequestDistibution();
      this.getProcessSummaryTaskDistibution();
      this.getProcessSummaryAlertDetails();
      this.getinvoiceOverviewStatus();
      this.setGraphData();
    }
  }

  showFilterRow() {
    this.showFilter = !this.showFilter;
    const dat = new Date();
    const d = this.formatDate(dat);
    const backDt = dat.setMonth(dat.getMonth() - 3);
    const backDate = this.formatDate(backDt);
    this.filterForm.patchValue({
      fromDate: backDate,
      toDate: d,
    });
    this.filterProcessForm.patchValue({
      fromDate: backDate,
      toDate: d,
      processId: 1
    });
    this.filterInformationRequest.patchValue({
      fromDate: backDate,
      toDate: d
    });
    this.filterUserSummary.patchValue({
      fromDate: backDate,
      toDate: d,
      userId: this.userId
    });
    this.process = 1;
    this.dateFrom = backDate;
    this.dateTo = d;
    this.dateFromProcess = backDate;
    this.dateToProcess = d;
    this.dateFromRequestInfo = backDate;
    this.dateToRequestInfo = d;
    this.dateFromUserSummary = backDate;
    this.dateToUserSummary = d;
  }

  informationTopCounter() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getTopCountersForinformationRequest(filterInformationRequests).subscribe(payload => {
      this.informationTopCounts = payload.data;
      this.informationTopCounts.turnaroundDuration = Math.round(this.informationTopCounts.turnaroundDuration);
      this.informationTopCounts.totalRequestCount = this.informationTopCounts.totalRequestCount == null ?
        0 : this.informationTopCounts.totalRequestCount;
      this.informationTopCounts.invoiceAmount = this.informationTopCounts.invoiceAmount == null ?
        0 : this.informationTopCounts.invoiceAmount;
      this.informationTopCounts.paymentAmount = this.informationTopCounts.paymentAmount == null ?
        0 : this.informationTopCounts.paymentAmount;
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getProcessSummaryOpenRequests() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryOpenRequests(filterInformationRequests).subscribe(payload => {
      this.processSummaryOpenChart = payload.data;

      this.processSummaryOpenchartArrLable = [];
      this.processSummaryOpenchartArrData = [];

      setTimeout(() => {
        const pieTag = (((this.openRequestpieChart.nativeElement as HTMLCanvasElement).children));
        this.openRequestpieChartTag = ((pieTag['openRequest_chart']).lastChild).getContext('2d'); // doughnut_chart
        const cdef = (this.openRequestpieChartTag).createLinearGradient(100, 0, 300, 0);
        cdef.addColorStop(0, '#4caf50');
        cdef.addColorStop(1, '#4caf50');
        const wxyz = (this.openRequestpieChartTag).createLinearGradient(100, 0, 300, 0);
        wxyz.addColorStop(0, '#FF9800');
        wxyz.addColorStop(1, '#FF9800');

        for (let l = 0; l < this.processSummaryOpenChart.length; l++) {
          this.processSummaryOpenchartArrLable.push(this.processSummaryOpenChart[l].product);
          this.processSummaryOpenchartArrData.push(this.processSummaryOpenChart[l].totalProduct);
        }
        this.PSOpenRequestChartData = {
          labels: this.processSummaryOpenchartArrLable,
          datasets: [{
            data: this.processSummaryOpenchartArrData,
            backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
            hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
          }]
        };
      });
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getProcessSummaryManagerAlerts() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryManagerAlerts(filterInformationRequests).subscribe(payload => {
      this.processSummaryManagerAlertChart = payload.data;
      this.processSummaryManagerAlertchartArrLabel = [];
      this.processSummaryManagerAlertchartArrData = [];

      setTimeout(() => {
        const pieTag = (((this.managerAlertpieChart.nativeElement as HTMLCanvasElement).children));
        this.managerAlertpieChartTag = ((pieTag['managerAlert_chart']).lastChild).getContext('2d'); // doughnut_chart
        const cdef = (this.managerAlertpieChartTag).createLinearGradient(100, 0, 300, 0);
        cdef.addColorStop(0, '#4caf50');
        cdef.addColorStop(1, '#4caf50');
        const wxyz = (this.managerAlertpieChartTag).createLinearGradient(100, 0, 300, 0);
        wxyz.addColorStop(0, '#FF9800');
        wxyz.addColorStop(1, '#FF9800');

        for (let l = 0; l < this.processSummaryManagerAlertChart.length; l++) {
          this.processSummaryManagerAlertchartArrLabel.push(this.processSummaryManagerAlertChart[l].notificationType);
          this.processSummaryManagerAlertchartArrData.push(this.processSummaryManagerAlertChart[l].noOfAlerts);
        }
        this.PSManagerAlertChartData = {
          labels: this.processSummaryManagerAlertchartArrLabel,
          datasets: [{
            data: this.processSummaryManagerAlertchartArrData,
            backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
            hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
          }]
        };
      });
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getProcessSummaryBilling() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryBilling(filterInformationRequests).subscribe(payload => {
      this.processSummaryBillingChart = payload.data;
      this.processSummaryBillingchartArrLabel = [];
      this.processSummaryBillingchartArrData = [];
      this.processSummaryBillingchartArrData1 = [];

      setTimeout(() => {
        const barBasicTag = (((this.billingChart.nativeElement as HTMLCanvasElement).children));
        this.billingChartTag = ((barBasicTag['billingchart']).lastChild).getContext('2d');
        const abc = (this.billingChartTag).createLinearGradient(0, 300, 0, 0);
        abc.addColorStop(0, '#4680ff');
        abc.addColorStop(1, '#4680ff');
        const def = (this.billingChartTag).createLinearGradient(0, 300, 0, 0);
        def.addColorStop(0, '#0e9e4a');
        def.addColorStop(1, '#0e9e4a');

        for (let l = 0; l < this.processSummaryBillingChart.length; l++) {
          this.processSummaryBillingchartArrLabel.push(this.processSummaryBillingChart[l].province);
          this.processSummaryBillingchartArrData.push(this.processSummaryBillingChart[l].paid);
          this.processSummaryBillingchartArrData1.push(this.processSummaryBillingChart[l].invoice);
        }

        this.BillingChartData = {
          labels: this.processSummaryBillingchartArrLabel,
          datasets: [{
            label: 'Invoice',
            data: this.processSummaryBillingchartArrData1,
            borderColor: 'red',
            backgroundColor: 'red',
            hoverborderColor: 'red',
            hoverBackgroundColor: 'red'
          }, {
            label: 'Paid',
            data: this.processSummaryBillingchartArrData,
            borderColor: 'green',
            backgroundColor: 'green',
            hoverborderColor: 'green',
            hoverBackgroundColor: 'green'
          }]
        };

        this.billingChartOption = {
          barValueSpacing: 20,
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1,
          animation: {
            duration: 0
          },
          legend: {
            display: true
          },
          hover: {
            animationDuration: 0
          },
          responsiveAnimationDuration: 0
        };
      });
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getProcessSummaryTaskDistibution() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryTaskDistibution(filterInformationRequests).subscribe(payload => {
      this.processSummaryTaskChart = payload.data;
      this.processSummaryTaskchartArrLabel = [];
      this.processSummaryTaskchartArrData = [];

      const unq = _.uniq(_.map(this.processSummaryTaskChart, 'month'));
      const unqProvince = _.uniq(_.map(this.processSummaryTaskChart, 'province'));

      const datas = [];
      for (let d = 0; d < unqProvince.length; d++) {
        const obj = { province: unqProvince[d], data: [] };
        datas.push(obj);
      }
      for (let k = 0; k < unqProvince.length; k++) {
        for (let j = 0; j < unq.length; j++) {
          const tempdata = this.processSummaryTaskChart.filter(x => x.month === unq[j] && x.province === unqProvince[k]);
          if (tempdata.length > 0) {
            datas[k].data.push(tempdata[0].totalRequest);
          } else {
            datas[k].data.push(0);
          }
        }
      }
      for (let l = 0; l < this.processSummaryTaskChart.length; l++) {
        this.processSummaryTaskchartArrLabel.push(this.processSummaryTaskChart[l].province);
        this.processSummaryTaskchartArrData.push(this.processSummaryTaskChart[l].totalRequest);
      }
      const colors = ['#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#76FF03', '#006064', '#4A148C'];
      const arr = [];
      for (let a = 0; a < datas.length; a++) {
        const tempD = {
          label: datas[a].province,
          data: datas[a].data,
          fill: false,
          borderColor: colors[a],
          backgroundColor: colors[a],
          hoverborderColor: colors[a],
          hoverBackgroundColor: colors[a],
        };
        arr.push(tempD);
      }
      this.PSTaskChartData = {
        labels: unq,
        datasets: arr
      };

      this.PSTaskChartOption = {
        barValueSpacing: 20,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        animation: {
          duration: 0
        },
        legend: {
          display: true
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      };
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getProcessSummaryRequestDistibution() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryRequestDistibution(filterInformationRequests).subscribe(payload => {
      this.processSummaryRequestChart = payload.data;
      this.processSummaryRequestchartArrLabel = [];
      this.processSummaryRequestchartArrData = [];

      const unq = _.uniq(_.map(this.processSummaryRequestChart, 'month'));
      const unqProvince = _.uniq(_.map(this.processSummaryRequestChart, 'province'));

      const datas = [];
      for (let d = 0; d < unqProvince.length; d++) {
        const obj = { province: unqProvince[d], data: [] };
        datas.push(obj);
      }
      for (let k = 0; k < unqProvince.length; k++) {
        for (let j = 0; j < unq.length; j++) {
          const tempdata = this.processSummaryRequestChart.filter(x => x.month === unq[j] && x.province === unqProvince[k]);
          if (tempdata.length > 0) {
            datas[k].data.push(tempdata[0].totalInvoice);
          } else {
            datas[k].data.push(0);
          }
        }
      }
      for (let l = 0; l < this.processSummaryRequestChart.length; l++) {
        this.processSummaryRequestchartArrLabel.push(this.processSummaryRequestChart[l].province);
        this.processSummaryRequestchartArrData.push(this.processSummaryRequestChart[l].totalInvoice);
      }
      const colors = ['#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#76FF03', '#006064', '#4A148C'];
      const arr = [];
      for (let a = 0; a < datas.length; a++) {
        const tempD = {
          label: datas[a].province,
          data: datas[a].data,
          fill: false,
          borderWidth: 0,
          borderColor: colors[a],
          backgroundColor: colors[a],
          hoverborderColor: colors[a],
          hoverBackgroundColor: colors[a],
        };
        arr.push(tempD);
      }

      this.PSRequestChartData = {
        labels: unq,
        datasets: arr,
      };

      this.PSRequestChartOption = {
        barValueSpacing: 20,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        legend: {
          display: true
        },
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      };
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getProcessSummaryAlertDetails() {
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryAlertList(filterInformationRequests).subscribe(payload => {
      this.processSummaryAlertDetail = payload.data;
    });
  }

  getinvoiceOverviewStatus() {
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getinvoiceOverviewStatus(filterInformationRequests).subscribe(payload => {
      this.invoiceOverview = payload.data;
      this.invoiceOverviewchartArrLabel = [];
      this.invoiceOverviewchartArrData = [];
      const bar_Horizontal_Chart = (((this.invoiceOverviewChart.nativeElement as HTMLCanvasElement).children));
      this.distributionRoleChartTag = ((bar_Horizontal_Chart['InvoiceOverview_chart']).lastChild).getContext('2d');
      const bar_Horizontal_Chart_val = (this.distributionRoleChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val.addColorStop(0, '#4680ff');
      bar_Horizontal_Chart_val.addColorStop(1, '#4680ff');
      const bar_Horizontal_Chart_val2 = (this.distributionRoleChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val2.addColorStop(0, '#0e9e4a');
      bar_Horizontal_Chart_val2.addColorStop(1, '#0e9e4a');
      let totalVal = 0;
      for (let l = 0; l < this.invoiceOverview.length; l++) {
        this.invoiceOverviewchartArrLabel.push(this.invoiceOverview[l].status);
        this.invoiceOverviewchartArrData.push(this.invoiceOverview[l].totalInvoice === null ? 0 : this.invoiceOverview[l].totalInvoice);
        totalVal = this.invoiceOverview[l].totalInvoice !== null ? (this.invoiceOverview[l].totalInvoice + totalVal) : (totalVal + 0);
      }
      this.invoiceOverviewChartData = {
        labels: this.invoiceOverviewchartArrLabel,
        datasets: [{
          label: 'Total : ' + totalVal,
          data: this.invoiceOverviewchartArrData,
          borderColor: [bar_Horizontal_Chart_val, '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100',
            '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          backgroundColor: [bar_Horizontal_Chart_val, '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B',
            '#69F0AE', '#0097A7', '#AA00FF'],
          hoverborderColor: [bar_Horizontal_Chart_val, '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B',
            '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [bar_Horizontal_Chart_val, '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B',
            '#69F0AE', '#0097A7', '#AA00FF']
        }]
      };
      this.invoiceOverviewChartOption = {
        barValueSpacing: 20,
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        animation: {
          duration: 0
        },
        legend: {
          display: false
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      };
    });
  }

  navigateToReference(refNo) {
    this.getByReferenceNo(refNo);

  }

  getByReferenceNo(refNo) {
    this.loaderService.display(true);
    this.restService.searchByRefNo(refNo).subscribe(payload => {
      const searchRequestsData = [];
      if (typeof payload.data === 'object' && payload.data !== null) {
        searchRequestsData.push(payload.data);
      }
      this.loaderService.display(false);
      this.router.navigate(['/task-profile'],
        { state: { taskDetail: searchRequestsData[0] } });
    },
      () => {
        this.loaderService.display(false);
      });
  }

  ngOnChanges() {

    if (this.lodgementTab === true) {
      this.setFilter();
      this.initialise();
    }
  }
}
