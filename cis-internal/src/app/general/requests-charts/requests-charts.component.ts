import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicket';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { EmployeedetailsComponent } from '../../tasks/task-details/employeedetails/employeedetails.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const VIEW_MAP_URL = environment.gisServerUrl + '/stat/MapStat.html';
@Component({
  selector: 'app-requests-charts',
  templateUrl: './requests-charts.component.html',
  styleUrls: ['./requests-charts.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class RequestsChartsComponent implements OnInit {
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
  reservationTab = false;
  lodgementTab = false;
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
  public barBasicChartData: any;
  public provinceRoleBarBasicChartData: any;
  public horizontalBarBasicChartData: any;
  public singlebarBasicChartData: any;
  public topsinglebarBasicChartData: any;
  public barBasicChartOption: any;
  public topsinglebarBasicChartOption: any;
  public topsinglebarHorizontalChartOption: any;
  @ViewChild('barBasicChart', { static: false }) barBasicChart: ElementRef; // used barStackedChart, barHorizontalChart
  public barBasicChartTag: CanvasRenderingContext2D;

  @ViewChild('barbasictopsinglechart', { static: false }) barBasicTopSingleChart: ElementRef; // used barStackedChart, barHorizontalChart
  public barBasicTopSingleChartTag: CanvasRenderingContext2D;

  @ViewChild('barHorizontalChart', { static: false }) barHorizontalChart: ElementRef; // used barStackedChart, barHorizontalChart
  public barHorizontalChartTag: CanvasRenderingContext2D;

  @ViewChild('bar_basic_chart_task_monthly', { static: false }) bar_basic_chart_task_monthly: ElementRef;
  public bar_basic_chart_task_monthlyTag: CanvasRenderingContext2D;

  public lineChartData: any;
  public lineChartOption: any;
  @ViewChild('lineChart', { static: false }) lineChart: ElementRef; // used barStackedChart, barHorizontalChart
  public lineChartTag: CanvasRenderingContext2D;


  public barBasicStackChartData: any;
  public barStackedChartOption: any;
  @ViewChild('barStackedChart', { static: false }) barStackedChart: ElementRef; // used barStackedChart, barHorizontalChart
  public barBasicStackChartTag: CanvasRenderingContext2D;

  public lineIPMChartData: any;
  public lineIPMChartOption: any;
  public pieChartOption: any;
  @ViewChild('lineIPMChart', { static: false }) lineIPMChart: ElementRef;
  public lineIPMChartTag: CanvasRenderingContext2D;

  public areaBasicChartData: any;
  public areaBasicChartOption: any;
  @ViewChild('areaBasicChart', { static: false }) areaBasicChart: ElementRef;
  public areaBasicChartTag: CanvasRenderingContext2D;

  public areaFillOriginChartData: any;
  @ViewChild('areaFillOriginChart', { static: false }) areaFillOriginChart: ElementRef;
  public areaFillOriginChartTag: CanvasRenderingContext2D;

  public areaFillEndChartData: any;
  @ViewChild('areaFillEndChart', { static: false }) areaFillEndChart: ElementRef;
  public areaFillEndChartTag: CanvasRenderingContext2D;

  public areaRadar1ChartData: any;
  @ViewChild('areaRadar1Chart', { static: false }) areaRadar1Chart: ElementRef;
  public areaRadar1ChartTag: CanvasRenderingContext2D;

  public areaRadar2ChartData: any;
  @ViewChild('areaRadar2Chart', { static: false }) areaRadar2Chart: ElementRef;
  public areaRadar2ChartTag: CanvasRenderingContext2D;

  public areaRadar3ChartData: any;
  @ViewChild('areaRadar3Chart', { static: false }) areaRadar3Chart: ElementRef;
  public areaRadar3ChartTag: CanvasRenderingContext2D;

  public pieChartData: any;
  public doughnutChartData: any;

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


  public IRTTChartData: any;
  public IRTTChartOption: any;
  @ViewChild('IRTTChart', { static: false }) IRTTChart: ElementRef; // used barStackedChart, barHorizontalChart
  public IRTTChartTag: CanvasRenderingContext2D;

  public IRMonthlyChartData: any;
  public IRMonthlyChartOption: any;
  @ViewChild('IRMonthly', { static: false }) IRMonthlyChart: ElementRef;
  public IRMonthlyTag: CanvasRenderingContext2D;
  IRMonthlyData: any;
  IRMonthlychartArrLabel = [];
  IRMonthlychartArrData = [];

  IRBeforeTTchartArrLabel = [];
  IRBeforeTTchartArrData = [];
  IRAfterTTchartArrLabel = [];
  IRAfterTTchartArrData = [];
  AfterTurnaroundTime: any;
  BeforeTurnaroundTime: any;

  public USTTChartData: any;
  public USTTChartOption: any;
  @ViewChild('USTTChart', { static: false }) USTTChart: ElementRef; // used barStackedChart, barHorizontalChart
  public USTTChartTag: CanvasRenderingContext2D;
  USBeforeTTchartArrLabel = [];
  USBeforeTTchartArrData = [];
  USAfterTTchartArrLabel = [];
  USAfterTTchartArrData = [];
  UserSummaryAfterTurnaroundTime: any;
  UserSummaryBeforeTurnaroundTime: any;

  public distributionRoleChartData: any;
  public distributionRoleChartOption: any;
  @ViewChild('distributionRoleChart', { static: false }) distributionRoleChart: ElementRef; // used barStackedChart, barHorizontalChart
  public distributionRoleChartTag: CanvasRenderingContext2D;
  distributionRole: any;
  distributionchartArrLabel = [];
  distributionTTchartArrData = [];

  public distributionUserChartData: any;
  public distributionUserChartOption: any;
  @ViewChild('distributionUserChart', { static: false }) distributionUserChart: ElementRef;
  public distributionUserChartTag: CanvasRenderingContext2D;
  distributionUser: any;
  distributionUserchartArrLabel = [];
  distributionUserchartArrData = [];

  public monthlyDistributionChartData: any;
  public monthlyDistributionChartOption: any;
  @ViewChild('monthlyDistributionChart', { static: false }) monthlyDistributionChart: ElementRef;
  public monthlyDistributionChartTag: CanvasRenderingContext2D;
  monthlyDistribution: any;
  monthlyDistributionchartArrLabel = [];
  monthlyDistributionchartArrData = [];

  public distributionActionChartData: any;
  public distributionActionChartOption: any;
  @ViewChild('distributionActionChart', { static: false }) distributionActionChart: ElementRef;
  public distributionActionChartTag: CanvasRenderingContext2D;
  distributionAction: any;
  distributionActionchartArrLabel = [];
  distributionActionchartArrData = [];

  userSummaryAlertDetails = [];
  userSummaryTaskList = [];
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

  @ViewChild('provinceRolebarBasicChart', { static: false }) provinceRolebarBasicChart: ElementRef;
  public provinceRolebarBasicChartChartTag: CanvasRenderingContext2D;

  @ViewChild('externalUserpieChart', { static: false }) externalUserpieChart: ElementRef; // doughnut
  public externalUserpieChartTag: CanvasRenderingContext2D;
  public externalpieChartData: any;
  userByprovinceTbl: any;
  mapsrc;

  constructor(private restService: RestcallService, private loaderService: LoaderService, private fb: FormBuilder,
    private router: Router, private dialog: MatDialog, private dom: DomSanitizer) {
    this.boundaryPage = 1;
    this.taskboundaryPage = 1;
    this.PSboundaryPage = 1;
    this.mapsrc = this.dom.bypassSecurityTrustResourceUrl(VIEW_MAP_URL);
  }

  ngOnInit() {
    this.setFilter();
    this.initialise();
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

      /* line interpolation mode chart */
      const lineIpmTag = (((this.lineIPMChart.nativeElement as HTMLCanvasElement).children));
      this.lineIPMChartTag = ((lineIpmTag['line_ipm_chart']).lastChild).getContext('2d');
      const klm = (this.lineIPMChartTag).createLinearGradient(0, 0, 500, 0);
      klm.addColorStop(0, '#0e9e4a');
      klm.addColorStop(1, '#0e9e4a');
      const hij = (this.lineIPMChartTag).createLinearGradient(0, 0, 500, 0);
      hij.addColorStop(0, '#4680ff');
      hij.addColorStop(1, '#4680ff');

      this.lineIPMChartData = {
        labels: this.arri,
        datasets: [{
          label: 'INTERNAL',
          data: this.arrDatai,
          fill: true,
          cubicInterpolationMode: 'monotone',
          borderWidth: 0,
          borderColor: hij,
          backgroundColor: hij,
          hoverborderColor: hij,
          hoverBackgroundColor: hij,
        }, {
          label: 'EXTERNAL',
          data: this.arrDatae,
          fill: false,
          borderWidth: 4,
          borderColor: '#0e9e4a',
          backgroundColor: '#0e9e4a',
          hoverborderColor: '#0e9e4a',
          hoverBackgroundColor: '#0e9e4a',
        }]
      };

      this.lineIPMChartOption = {
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

      /* pie cart */
      const pieTag = (((this.pieChart.nativeElement as HTMLCanvasElement).children));
      this.pieChartTag = ((pieTag['pie_chart']).lastChild).getContext('2d'); // doughnut_chart
      const cdef = (this.pieChartTag).createLinearGradient(100, 0, 300, 0);
      cdef.addColorStop(0, '#4caf50');
      cdef.addColorStop(1, '#4caf50');
      const wxyz = (this.pieChartTag).createLinearGradient(100, 0, 300, 0);
      wxyz.addColorStop(0, '#FF9800');
      wxyz.addColorStop(1, '#FF9800');

      this.pieChartData = {
        labels: this.arrProvinceLabel,
        datasets: [{
          data: this.arrProvinceData,
          backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723'],
          hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723']
        }]
      };

      const extpieTag = (((this.externalUserpieChart.nativeElement as HTMLCanvasElement).children));
      this.externalUserpieChartTag = ((extpieTag['externalpie_chart']).lastChild).getContext('2d'); // doughnut_chart
      const cdef1 = (this.externalUserpieChartTag).createLinearGradient(100, 0, 300, 0);
      cdef1.addColorStop(0, '#4caf50');
      cdef1.addColorStop(1, '#4caf50');
      const wxyz1 = (this.externalUserpieChartTag).createLinearGradient(100, 0, 300, 0);
      wxyz1.addColorStop(0, '#FF9800');
      wxyz1.addColorStop(1, '#FF9800');

      this.externalpieChartData = {
        labels: this.arrExternalProvinceLabel,
        datasets: [{
          data: this.arrExternalProvinceData,
          backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723'],
          hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723']
        }]
      };

      this.doughnutChartData = {
        labels: this.arrRoleLabel,
        datasets: [{
          data: this.arrRoleData,
          backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
        }]
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
      this.getTopCountersForProcessSummary();
      this.getUserSummaryTotalTask();
      this.getUserRegistrationTopCounter();
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

        this.userByprovinceTbl = _.orderBy(resultByProvinceWithCount, ['province'], ['asc']);
        this.setGraphData();
      },
        () => {
          this.loaderService.display(false);
        });

    }, () => {
      this.loaderService.display(false);
    });
    this.loaderService.display(false);
  }

  displayProvince(provincedata) {
    return provincedata ? (provincedata.provinceName) : '';
  }
  displayStatus(status) {
    return status ? (status) : '';
  }

  displayProcess(process) {
    return process ? (process) : '';
  }

  search() {
    if (this.filterForm.invalid) {
      this.filterForm.get('provinceIds').markAsTouched();
      this.filterForm.get('fromDate').markAsTouched();
      this.filterForm.get('toDate').markAsTouched();
      return;
    } else {
      this.loaderService.display(true);
      this.clearData();
      this.filterForm.patchValue({
        fromDate: this.formatDate(this.filterForm.value.fromDate),
        toDate: this.formatDate(this.filterForm.value.toDate),
      });
      const filterCriteria = {
        provinceIds: this.filterForm.value.provinceIds,
        fromDate: this.filterForm.value.fromDate,
        toDate: this.formatDate(this.addDays(this.filterForm.value.toDate, 1))
      };
      this.getUserRegistrationTopCounter();
      this.restService.getUsersStatistics(filterCriteria).subscribe(payload => {
        this.data = payload.data;
        this.loaderService.display(false);
        const SEPERATOR = '-';
        const resultWithCount =
          _(_.orderBy(this.data, ['userCreationDate'], ['asc']).filter(d => d.userType !== null
            && this.filterForm.value.provinceIds.includes(d.provinceId)
            && (d.userCreationDate >= this.formatDate(this.filterForm.value.fromDate)
              && d.userCreationDate <= this.formatDate(this.filterForm.value.toDate))))
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

        const resultByProvince =
          _(this.data.filter(d => d.provinceId !== null
            && this.filterForm.value.provinceIds.includes(d.provinceId) && d.userType === 'INTERNAL' &&
            (d.userCreationDate >= this.formatDate(this.filterForm.value.fromDate)
              && d.userCreationDate <= this.formatDate(this.filterForm.value.toDate))))
            .groupBy(x => x.provinceName)
            .map((value, key) => ({ province: key, users: value.length }))
            .value();

        for (let k = 0; k < resultByProvince.length; k++) {
          this.arrProvinceLabel.push(resultByProvince[k].province);
          this.arrProvinceData.push(resultByProvince[k].users);
        }

        const resultByProvinceExternal = _(this.data.filter(d => d.provinceId !== null
          && this.filterForm.value.provinceIds.includes(d.provinceId) && d.userType === 'EXTERNAL' &&
          (d.userCreationDate >= this.formatDate(this.filterForm.value.fromDate)
            && d.userCreationDate <= this.formatDate(this.filterForm.value.toDate))))
          .groupBy(x => x.provinceName)
          .map((value, key) => ({ province: key, users: value.length }))
          .value();

        for (let k = 0; k < resultByProvinceExternal.length; k++) {
          this.arrExternalProvinceLabel.push(resultByProvinceExternal[k].province);
          this.arrExternalProvinceData.push(resultByProvinceExternal[k].users);
        }

        const resultByRole =
          _(this.data.filter(d => d.roleName !== null
            && this.filterForm.value.provinceIds.includes(d.provinceId) &&
            (d.userCreationDate >= this.formatDate(this.filterForm.value.fromDate)
              && d.userCreationDate <= this.formatDate(this.filterForm.value.toDate))))
            .groupBy(x => x.roleName)
            .map((value, key) => ({ role: key, users: value.length }))
            .value();

        for (let l = 0; l < resultByRole.length; l++) {
          this.arrRoleLabel.push(resultByRole[l].role);
          this.arrRoleData.push(resultByRole[l].users);
        }

        const resultAllByProvince =
          _(this.data.filter(d => d.provinceId !== null
            && this.filterForm.value.provinceIds.includes(d.provinceId) &&
            (d.userCreationDate >= this.formatDate(this.filterForm.value.fromDate)
              && d.userCreationDate <= this.formatDate(this.filterForm.value.toDate))))
            .groupBy(x => x.usertype && x.provinceName)
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
        this.setGraphData();
      }, () => {
        this.loaderService.display(false);
      });
    }
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

  clearProcessSummary() {
    const dat = new Date();
    const d = this.formatDate(dat);
    const backDt = dat.setMonth(dat.getMonth() - 3);
    const backDate = this.formatDate(backDt);
    const provinceArr = [];
    for (let i = 0; i < this.provincepdata.length; i++) {
      provinceArr.push(this.provincepdata[i].provinceId);
    }
    this.process = 1;
    this.filterProcessForm.patchValue({
      provinceIds: provinceArr,
      fromDate: backDate,
      toDate: d,
      processId: 1
    });
    this.dateFromProcess = backDate;
    this.dateToProcess = d;

    this.searchProcessSummary();
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

  clearUserSummary() {
    const dat = new Date();
    const d = this.formatDate(dat);
    const backDt = dat.setMonth(dat.getMonth() - 3);
    const backDate = this.formatDate(backDt);
    this.filterUserSummary.patchValue({
      fromDate: backDate,
      toDate: d,
      userId: this.userId
    });
    this.dateFromUserSummary = backDate;
    this.dateToUserSummary = d;
    this.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
    this.user = JSON.parse(sessionStorage.getItem('userInfo'));
    this.searchUserSummay();
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

  tabClick(event) {
    if (event.index === 1) {
      this.reservationTab = false;
      this.lodgementTab = false;
      this.getTopCountersForProcessSummary();
      this.getTaskDistributionTurnaroundTine();
      this.getIRMonthly();
      this.getTaskDistributionByRole();
      this.getTaskDistributionByUser();
      this.simulateProcess();

    } else if (event.index === 2) {
      this.reservationTab = false;
      this.lodgementTab = false;
      this.informationTopCounter();
      this.getProcessSummaryOpenRequests();
      this.getProcessSummaryClosedRequests();
      this.getProcessSummaryManagerAlerts();
      this.getProcessSummaryBilling();
      this.getProcessSummaryRequestDistibution();
      this.getProcessSummaryTaskDistibution();
      this.getProcessSummaryAlertDetails();
      this.getinvoiceOverviewStatus();
    } else if (event.index === 3) {
      this.reservationTab = false;
      this.lodgementTab = false;
      this.getInternalUsers();
    } else if (event.index === 5) {

      this.reservationTab = true;
      this.lodgementTab = false;
    } else if (event.index === 6) {

      this.reservationTab = false;
      this.lodgementTab = true;
    }
    this.setGraphData();
  }

  searchProcessSummary() {
    if (this.filterProcessForm.invalid) {
      this.filterProcessForm.get('provinceIds').markAsTouched();
      this.filterProcessForm.get('fromDate').markAsTouched();
      this.filterProcessForm.get('toDate').markAsTouched();
      return;
    } else {
      this.filterProcessForm.patchValue({
        fromDate: this.formatDate(this.filterProcessForm.value.fromDate),
        toDate: this.formatDate(this.filterProcessForm.value.toDate),
        processId: this.filterProcessForm.value.processId === undefined ? 0 : this.filterProcessForm.value.processId
      });
      this.getTopCountersForProcessSummary();
      this.getTaskDistributionTurnaroundTine();
      this.getIRMonthly();
      this.getTaskDistributionByRole();
      this.getTaskDistributionByUser();
      this.simulateProcess();
      this.setGraphData();
    }
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
      this.getProcessSummaryClosedRequests();
      this.getProcessSummaryManagerAlerts();
      this.getProcessSummaryBilling();
      this.getProcessSummaryRequestDistibution();
      this.getProcessSummaryTaskDistibution();
      this.getProcessSummaryAlertDetails();
      this.getinvoiceOverviewStatus();
      this.setGraphData();
    }
  }

  searchUserSummay() {
    if (this.filterUserSummary.invalid) {
      this.filterUserSummary.get('fromDate').markAsTouched();
      this.filterUserSummary.get('toDate').markAsTouched();
      return;
    } else {
      this.filterUserSummary.patchValue({
        fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
        toDate: this.formatDate(this.filterUserSummary.value.toDate),
        userId: this.userId
      });
      this.user = this.internaluser.filter(x => x.userId === this.filterUserSummary.value.userId)[0];
      this.getUserSummaryTotalTask();
      this.getUserSummaryTaskTurnaroundTime();
      this.userSummaryGetMonthlyTaskDuration();
      this.getUserSummaryDistributionByAction();
      this.getUserAlertDetails();
      this.getUsertaskList();
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

  getTopCountersForProcessSummary() {
    this.loaderService.display(true);
    const filterProcess = {
      provinceIds: this.filterProcessForm.value.provinceIds,
      fromDate: this.formatDate(this.filterProcessForm.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterProcessForm.value.toDate, 1)),
      processId: this.filterProcessForm.value.processId === undefined ? 0 : this.filterProcessForm.value.processId
    };
    this.restService.getTopCountersForProcessSummary(filterProcess).subscribe(payload => {
      this.processSummaryTopCounts = payload.data;
      this.processSummaryTopCounts.turnaroundDuration = Math.round(this.processSummaryTopCounts.turnaroundDuration);
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }
  getProcessSummaryClosedRequests() {
    this.loaderService.display(true);
    const filterInformationRequests = {
      provinceIds: this.filterInformationRequest.value.provinceIds,
      fromDate: this.filterInformationRequest.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterInformationRequest.value.toDate, 1))
    };
    this.restService.getProcessSummaryClosedRequests(filterInformationRequests).subscribe(payload => {
      this.processSummaryCloseChart = payload.data;
      this.processSummaryClosechartArrLable = [];
      this.processSummaryClosechartArrData = [];

      const pieTag = (((this.closeRequestpieChart.nativeElement as HTMLCanvasElement).children));
      this.closeRequestpieChartTag = ((pieTag['closeRequest_chart']).lastChild).getContext('2d'); // doughnut_chart
      const cdef = (this.closeRequestpieChartTag).createLinearGradient(100, 0, 300, 0);
      cdef.addColorStop(0, '#4caf50');
      cdef.addColorStop(1, '#4caf50');
      const wxyz = (this.closeRequestpieChartTag).createLinearGradient(100, 0, 300, 0);
      wxyz.addColorStop(0, '#FF9800');
      wxyz.addColorStop(1, '#FF9800');

      for (let l = 0; l < this.processSummaryCloseChart.length; l++) {
        this.processSummaryClosechartArrLable.push(this.processSummaryCloseChart[l].product);
        this.processSummaryClosechartArrData.push(this.processSummaryCloseChart[l].totalProduct);
      }
      this.PSCloseRequestChartData = {
        labels: this.processSummaryClosechartArrLable,
        datasets: [{
          data: this.processSummaryClosechartArrData,
          backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
        }]
      };
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

      const lineChartTag = (((this.PSTaskChart.nativeElement as HTMLCanvasElement).children));
      this.lineChartTag = ((lineChartTag['PSTask_chart']).lastChild).getContext('2d');
      const lu10 = (this.lineChartTag).createLinearGradient(0, 0, 500, 0);
      lu10.addColorStop(0, '#0e9e4a');
      lu10.addColorStop(1, '#0e9e4a');
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

      const lineChartTag = (((this.PSRequestChart.nativeElement as HTMLCanvasElement).children));
      this.lineChartTag = ((lineChartTag['PSRequest_chart']).lastChild).getContext('2d');
      const lu10 = (this.lineChartTag).createLinearGradient(0, 0, 500, 0);
      lu10.addColorStop(0, '#0e9e4a');
      lu10.addColorStop(1, '#0e9e4a');
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

  getTaskDistributionTurnaroundTine() {
    this.loaderService.display(true);
    const filterProcess = {
      provinceIds: this.filterProcessForm.value.provinceIds,
      fromDate: this.formatDate(this.filterProcessForm.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterProcessForm.value.toDate, 1)),
      processId: this.filterProcessForm.value.processId === undefined ? 0 : this.filterProcessForm.value.processId
    };
    forkJoin([
      this.restService.getTaskDistributionAfterTurnaroundTime(filterProcess),
      this.restService.gettaskDistributionBeforeTurnaroundTime(filterProcess)

    ]).subscribe(([afterTT, beforeTT]) => {
      this.AfterTurnaroundTime = afterTT.data;
      this.BeforeTurnaroundTime = beforeTT.data;
      this.IRBeforeTTchartArrLabel = [];
      this.IRBeforeTTchartArrData = [];
      this.IRAfterTTchartArrLabel = [];
      this.IRAfterTTchartArrData = [];
      const lineChartTag = (((this.IRTTChart.nativeElement as HTMLCanvasElement).children));
      this.lineChartTag = ((lineChartTag['IRTT_chart']).lastChild).getContext('2d');
      const li = (this.lineChartTag).createLinearGradient(0, 0, 500, 0);
      li.addColorStop(0, '#0e9e4a');
      li.addColorStop(1, '#0e9e4a');
      const lu = (this.lineChartTag).createLinearGradient(0, 0, 500, 0);
      lu.addColorStop(0, '#4680ff');
      lu.addColorStop(1, '#4680ff');
      for (let l = 0; l < this.AfterTurnaroundTime.length; l++) {
        this.IRAfterTTchartArrLabel.push(this.AfterTurnaroundTime[l].month);
        this.IRAfterTTchartArrData.push(this.AfterTurnaroundTime[l].totalTask);
      }
      for (let l = 0; l < this.BeforeTurnaroundTime.length; l++) {
        this.IRBeforeTTchartArrLabel.push(this.BeforeTurnaroundTime[l].month);
        this.IRBeforeTTchartArrData.push(this.BeforeTurnaroundTime[l].totalTask);
      }
      this.IRTTChartData = {
        labels: this.IRAfterTTchartArrLabel,
        datasets: [{
          label: 'After Turnaround Time',
          data: this.IRAfterTTchartArrData,
          fill: false,
          borderWidth: 0,
          borderColor: 'red',
          backgroundColor: 'red',
          hoverborderColor: 'red',
          hoverBackgroundColor: 'red',
        }, {
          label: 'Before Turnaround Time',
          data: this.IRBeforeTTchartArrData,
          fill: false,
          borderWidth: 4,
          borderColor: 'green',
          backgroundColor: 'green',
          hoverborderColor: 'green',
          hoverBackgroundColor: 'green',
        }
        ]
      };

      this.IRTTChartOption = {
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
      this.loaderService.display(false);
    });
  }

  getIRMonthly() {
    this.loaderService.display(true);
    const filterProcess = {
      provinceIds: this.filterProcessForm.value.provinceIds,
      fromDate: this.formatDate(this.filterProcessForm.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterProcessForm.value.toDate, 1)),
      processId: this.filterProcessForm.value.processId === undefined ? 0 : this.filterProcessForm.value.processId
    };
    this.restService.getIRTaskDistributionByMonth(filterProcess).subscribe(payload => {
      this.IRMonthlyChartData = payload.data;
      this.IRMonthlychartArrData = [];
      this.IRMonthlychartArrLabel = [];

      const barBasicTag = (((this.IRMonthlyChart.nativeElement as HTMLCanvasElement).children));
      this.barBasicChartTag = ((barBasicTag['IRMonthly_chart']).lastChild).getContext('2d');
      const abc = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
      abc.addColorStop(0, '#4680ff');
      abc.addColorStop(1, '#4680ff');
      const def = (this.barBasicChartTag).createLinearGradient(0, 300, 0, 0);
      def.addColorStop(0, '#0e9e4a');
      def.addColorStop(1, '#0e9e4a');

      for (let l = 0; l < this.IRMonthlyChartData.length; l++) {
        this.IRMonthlychartArrLabel.push(this.IRMonthlyChartData[l].month);
        this.IRMonthlychartArrData.push(this.IRMonthlyChartData[l].totalTask);
      }
      this.IRMonthlyChartData = {
        labels: this.IRMonthlychartArrLabel,
        datasets: [{
          label: 'Tasks',
          data: this.IRMonthlychartArrData,
          borderColor: [abc, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          backgroundColor: [abc, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverborderColor: [abc, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [abc, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
        }]
      };
      this.IRTTChartOption = {
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

      this.topsinglebarBasicChartOption = {
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
      this.loaderService.display(false);
    },
      () => {
        this.loaderService.display(false);
      });
  }

  getTaskDistributionByRole() {
    const filterProcess = {
      provinceIds: this.filterProcessForm.value.provinceIds,
      fromDate: this.formatDate(this.filterProcessForm.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterProcessForm.value.toDate, 1)),
      processId: this.filterProcessForm.value.processId === undefined ? 0 : this.filterProcessForm.value.processId
    };
    this.restService.getTaskDistributionByRole(filterProcess).subscribe(payload => {
      this.distributionRole = payload.data;
      this.distributionchartArrLabel = [];
      this.distributionTTchartArrData = [];
      const bar_Horizontal_Chart = (((this.distributionRoleChart.nativeElement as HTMLCanvasElement).children));
      this.distributionRoleChartTag = ((bar_Horizontal_Chart['distributionRole_chart']).lastChild).getContext('2d');
      const bar_Horizontal_Chart_val = (this.distributionRoleChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val.addColorStop(0, '#4680ff');
      bar_Horizontal_Chart_val.addColorStop(1, '#4680ff');
      const bar_Horizontal_Chart_val2 = (this.distributionRoleChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val2.addColorStop(0, '#0e9e4a');
      bar_Horizontal_Chart_val2.addColorStop(1, '#0e9e4a');

      for (let l = 0; l < this.distributionRole.length; l++) {
        this.distributionchartArrLabel.push(this.distributionRole[l].role);
        this.distributionTTchartArrData.push(this.distributionRole[l].noOfRequest);
      }
      this.distributionRoleChartData = {
        labels: this.distributionchartArrLabel,
        datasets: [{
          label: 'Tasks',
          data: this.distributionTTchartArrData,
          borderColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          backgroundColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverborderColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
        }]
      };
      this.distributionRoleChartOption = {
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

  getTaskDistributionByUser() {
    const filterProcess = {
      provinceIds: this.filterProcessForm.value.provinceIds,
      fromDate: this.formatDate(this.filterProcessForm.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterProcessForm.value.toDate, 1)),
      processId: this.filterProcessForm.value.processId === undefined ? 0 : this.filterProcessForm.value.processId
    };
    this.restService.getTaskDistributionByUser(filterProcess).subscribe(payload => {
      this.distributionUser = payload.data;
      this.distributionUserchartArrLabel = [];
      this.distributionUserchartArrData = [];
      const bar_Horizontal_Chart = (((this.distributionUserChart.nativeElement as HTMLCanvasElement).children));
      this.distributionRoleChartTag = ((bar_Horizontal_Chart['distributionUser_chart']).lastChild).getContext('2d');
      const bar_Horizontal_Chart_val = (this.distributionRoleChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val.addColorStop(0, '#4680ff');
      bar_Horizontal_Chart_val.addColorStop(1, '#4680ff');
      const bar_Horizontal_Chart_val2 = (this.distributionRoleChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val2.addColorStop(0, '#0e9e4a');
      bar_Horizontal_Chart_val2.addColorStop(1, '#0e9e4a');

      for (let l = 0; l < this.distributionUser.length; l++) {
        this.distributionUserchartArrLabel.push(this.distributionUser[l].requestor);
        this.distributionUserchartArrData.push(this.distributionUser[l].totalTasks);
      }
      this.distributionUserChartData = {
        labels: this.distributionUserchartArrLabel,
        datasets: [{
          label: 'Tasks',
          data: this.distributionUserchartArrData,
          borderColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          backgroundColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverborderColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
        }]
      };
      this.distributionUserChartOption = {
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


  getUserSummaryTotalTask() {
    this.filterUserSummary.patchValue({
      userId: this.userId
    });
    const filterUserSummaries = {
      fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterUserSummary.value.toDate, 1)),
      userId: this.filterUserSummary.value.userId
    };
    this.restService.getUserSummaryTotalTask(filterUserSummaries).subscribe(payload => {
      this.userSummaryTopCounts = payload.data;
      this.userSummaryTopCounts.turnaroundDuration = Math.round(this.userSummaryTopCounts.turnaroundDuration);
    });
  }

  getUserRegistrationTopCounter() {
    const filterCriteria = {
      provinceIds: this.filterForm.value.provinceIds,
      fromDate: this.filterForm.value.fromDate,
      toDate: this.formatDate(this.addDays(this.filterForm.value.toDate, 1))
    };
    this.restService.getUserRegistrationTopCounter(filterCriteria).subscribe(payload => {
      this.userRegistrationTopCounts = payload.data;
    });
  }


  userSummaryGetMonthlyTaskDuration() {
    this.filterUserSummary.patchValue({
      userId: this.userId
    });
    const filterUserSummaries = {
      fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterUserSummary.value.toDate, 1)),
      userId: this.filterUserSummary.value.userId
    };
    this.restService.userSummaryGetMonthlyTaskDuration(filterUserSummaries).subscribe(payload => {
      this.monthlyDistribution = payload.data;
      this.monthlyDistributionchartArrLabel = [];
      this.monthlyDistributionchartArrData = [];
      const monthlyDistribution_Chart = (((this.monthlyDistributionChart.nativeElement as HTMLCanvasElement).children));
      this.monthlyDistributionChartTag = ((monthlyDistribution_Chart['monthlyDistribution_chart']).lastChild).getContext('2d');
      // used bar_stacked_chart, bar_horizontal_chart
      const bar_Horizontal_Chart_val = (this.monthlyDistributionChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val.addColorStop(0, '#4680ff');
      bar_Horizontal_Chart_val.addColorStop(1, '#4680ff');
      const bar_Horizontal_Chart_val2 = (this.monthlyDistributionChartTag).createLinearGradient(0, 300, 0, 0);
      bar_Horizontal_Chart_val2.addColorStop(0, '#0e9e4a');
      bar_Horizontal_Chart_val2.addColorStop(1, '#0e9e4a');

      for (let l = 0; l < this.monthlyDistribution.length; l++) {
        this.monthlyDistributionchartArrLabel.push(this.monthlyDistribution[l].month);
        this.monthlyDistributionchartArrData.push(this.monthlyDistribution[l].totalTask);
      }
      this.monthlyDistributionChartData = {
        labels: this.monthlyDistributionchartArrLabel,
        datasets: [{
          label: 'Tasks',
          data: this.monthlyDistributionchartArrData,
          borderColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          backgroundColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverborderColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF'],
          hoverBackgroundColor: [bar_Horizontal_Chart_val, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723',
            '#AEEA00', '#FF9100', '#FFEB3B', '#69F0AE', '#0097A7', '#AA00FF']
        }]
      };
      this.monthlyDistributionChartOption = {
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



  getUserSummaryTaskTurnaroundTime() {

    this.loaderService.display(true);
    this.filterUserSummary.patchValue({
      userId: this.userId
    });
    const filterUserSummaries = {
      fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterUserSummary.value.toDate, 1)),
      userId: this.filterUserSummary.value.userId
    };
    forkJoin([
      this.restService.getUserSummaryTaskAfterTurnaroundTime(filterUserSummaries),
      this.restService.getUserSummaryTaskBeforeTurnaroundTime(filterUserSummaries)

    ]).subscribe(([afterTT, beforeTT]) => {
      this.UserSummaryAfterTurnaroundTime = afterTT.data;
      this.UserSummaryBeforeTurnaroundTime = beforeTT.data;
      this.USBeforeTTchartArrLabel = [];
      this.USBeforeTTchartArrData = [];
      this.USAfterTTchartArrLabel = [];
      this.USAfterTTchartArrData = [];
      const USTTChartTag = (((this.USTTChart.nativeElement as HTMLCanvasElement).children));
      this.USTTChartTag = ((USTTChartTag['USTT_chart']).lastChild).getContext('2d');
      const li = (this.USTTChartTag).createLinearGradient(0, 0, 500, 0);
      li.addColorStop(0, 'red');
      li.addColorStop(1, 'green');
      const lu = (this.USTTChartTag).createLinearGradient(0, 0, 500, 0);
      lu.addColorStop(0, 'red');
      lu.addColorStop(1, 'green');
      for (let l = 0; l < this.UserSummaryAfterTurnaroundTime.length; l++) {
        this.USAfterTTchartArrLabel.push(this.UserSummaryAfterTurnaroundTime[l].month);
        this.USAfterTTchartArrData.push(this.UserSummaryAfterTurnaroundTime[l].totalTask);
      }
      for (let l = 0; l < this.UserSummaryBeforeTurnaroundTime.length; l++) {
        this.USBeforeTTchartArrLabel.push(this.UserSummaryBeforeTurnaroundTime[l].month);
        this.USBeforeTTchartArrData.push(this.UserSummaryBeforeTurnaroundTime[l].totalTask);
      }
      this.USTTChartData = {
        labels: this.USAfterTTchartArrLabel,
        datasets: [{
          label: 'After Turnaround Time',
          data: this.USAfterTTchartArrData,
          fill: false,
          borderWidth: 0,
          borderColor: 'red',
          backgroundColor: 'red',
          hoverborderColor: 'red',
          hoverBackgroundColor: 'red',
        }, {
          label: 'Before Turnaround Time',
          data: this.USBeforeTTchartArrData,
          fill: false,
          borderWidth: 4,
          borderColor: 'green',
          backgroundColor: 'green',
          hoverborderColor: 'green',
          hoverBackgroundColor: 'green',
        },

        ]
      };

      this.USTTChartOption = {
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
      this.loaderService.display(false);
    });
  }


  getUserSummaryDistributionByAction() {
    this.filterUserSummary.patchValue({
      userId: this.userId
    });
    const filterUserSummaries = {
      fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterUserSummary.value.toDate, 1)),
      userId: this.filterUserSummary.value.userId
    };
    this.restService.getUserSummaryDistributionByAction(filterUserSummaries).subscribe(payload => {
      this.distributionAction = payload.data;
      this.distributionActionchartArrLabel = [];
      this.distributionActionchartArrData = [];

      const distributionActionChartTag = (((this.distributionActionChart.nativeElement as HTMLCanvasElement).children));
      this.distributionActionChartTag = ((distributionActionChartTag['distributionAction_chart']).lastChild).getContext('2d');
      const cdef = (this.distributionActionChartTag).createLinearGradient(100, 0, 300, 0);
      cdef.addColorStop(0, '#4caf50');
      cdef.addColorStop(1, '#4caf50');
      const wxyz = (this.distributionActionChartTag).createLinearGradient(100, 0, 300, 0);
      wxyz.addColorStop(0, '#FF9800');
      wxyz.addColorStop(1, '#FF9800');


      for (let l = 0; l < this.distributionAction.length; l++) {
        this.distributionActionchartArrLabel.push(this.distributionAction[l].action);
        this.distributionActionchartArrData.push(this.distributionAction[l].totalTask);
      }

      this.distributionActionChartData = {
        labels: this.distributionActionchartArrLabel,
        datasets: [{
          data: this.distributionActionchartArrData,
          backgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723'],
          hoverBackgroundColor: [cdef, wxyz, '#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723']
        }]
      };
      this.distributionActionChartOption = {
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
  getUserAlertDetails() {
    this.filterUserSummary.patchValue({
      userId: this.userId
    });
    const filterUserSummaries = {
      fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterUserSummary.value.toDate, 1)),
      userId: this.filterUserSummary.value.userId
    };
    this.restService.getUserSummaryalertDetails(filterUserSummaries).subscribe(payload => {
      this.userSummaryAlertDetails = payload.data;
    });
  }

  getUsertaskList() {
    this.filterUserSummary.patchValue({
      userId: this.userId
    });
    const filterUserSummaries = {
      fromDate: this.formatDate(this.filterUserSummary.value.fromDate),
      toDate: this.formatDate(this.addDays(this.filterUserSummary.value.toDate, 1)),
      userId: this.filterUserSummary.value.userId
    };
    this.restService.getUserSummaryTaskList(filterUserSummaries).subscribe(payload => {
      this.userSummaryTaskList = payload.data;
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

  getInternalUsers() {
    this.restService.getUserList(0, 100, 'INTERNAL').subscribe(payload => {
      this.internaluser = payload.data;
      this.filterUserSummary.patchValue({
        userId: this.userId
      });
      this.user = this.internaluser.filter(x => x.userId === this.userId)[0];
      this.getUserSummaryTaskTurnaroundTime();
      this.userSummaryGetMonthlyTaskDuration();
      this.getUserSummaryDistributionByAction();
      this.getUserAlertDetails();
      this.getUsertaskList();
      this.getUserSummaryTotalTask();
    },
      () => {
      });
  }

  userChange(selectedVal) {
    this.user = selectedVal.value;
    this.userId = selectedVal.value.userId;
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

  openUserSummary(uName) {
    const userDetail = this.internaluser.filter(x => uName === x.firstName + x.surname)[0];
    const dialogRef = this.dialog.open(EmployeedetailsComponent, {
      width: '750px',
      data: userDetail.userId,
    });
    dialogRef.afterClosed().subscribe(async () => {
    });
  }

  simulateProcess() {
    this.restService.simulateProcess().subscribe((res: any) => {
      this.processData = res.data;
    });
  }
}
