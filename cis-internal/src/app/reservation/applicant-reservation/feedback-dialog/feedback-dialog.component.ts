import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css']
})
export class FeedbackDialogComponent implements OnInit {
  provinceIds: any[] = [];
  province: any;
  notes;
  rating;
  applicantFeedback: any[] = []
  @ViewChild('PSRequest', { static: false }) PSRequestChart: ElementRef
  public PSRequestChartData: any;
  public PSRequestChartOption: any;
  @ViewChild('provinceSelect') provinceSelect: MatSelect;
  public provinceFilterCtrl: FormControl = new FormControl();
  public filteredProvince: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroyProvince = new Subject<void>();
  provincepdata: any[];
  userId = JSON.parse(sessionStorage.getItem('userInfo')).userId;
  poorRating = 0;
  okRating = 0;
  happyRating = 0;
  @ViewChild('PSTaskRequest', { static: false }) PSTaskChart: ElementRef;
  public PSTaskChartData: any;
  public PSTaskChartOption: any;
  feedbackChart: any;
  feedbackchartArrLabel = [];
  feedbackchartArrData = [];
  constructor(public dialogRef: MatDialogRef<FeedbackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restService: RestcallService, private fb: FormBuilder,
    private loaderService: LoaderService, private snackbar: SnackbarService) { }

  ngOnInit(): void {
    this.initialise()
  }

  initialise() {
    this.loaderService.display(true);
    forkJoin([
      this.restService.getProvinces(),
      this.restService.getApplicantFeedbacks(this.data.applicantUserId)
    ]).subscribe(([provinces, feedbackData]) => {

      this.provincepdata = provinces.data.filter(x => x.provinceId !== -1);
      this.province = this.provincepdata[0];
      this.filteredProvince = provinces.data.filter(x => x.provinceId !== -1);
      this.provincepdata.forEach((el, i) => {
        this.provinceIds.push(el.provinceId);
      })

      this.getWorkflowUserFeedbackYearlyStatus();
      this.applicantFeedback = _.orderBy(feedbackData.data, ['dated'], ['desc']);
      if (this.applicantFeedback.length > 0) {
        var total = this.applicantFeedback.length;
        var pRating = this.applicantFeedback.filter(x => x.rating == 1).length;
        var oRating = this.applicantFeedback.filter(x => x.rating == 2).length;
        var gRating = this.applicantFeedback.filter(x => x.rating == 3).length;
        this.poorRating = (pRating / total) * 100;
        this.okRating = (oRating / total) * 100;
        this.happyRating = (gRating / total) * 100;
      }
      this.notes = undefined;
      this.rating = undefined;
      this.loaderService.display(false);
    }, error => {
      this.loaderService.display(false);
    });

  }

  getWorkflowUserFeedbackYearlyStatus() {
    let data = {
      'applicantId': this.data.applicantUserId,
      'provinces': this.provinceIds
    }
    this.loaderService.display(true);
    this.restService.getWorkflowUserFeedbackYearlyStatus(data).subscribe((payload) => {
      this.feedbackChart = _.orderBy(payload.data, ['year'], ['asc']);
      this.feedbackchartArrLabel = [];
      this.feedbackchartArrData = [];

      const unq = _.uniq(_.map(this.feedbackChart, 'year'));
      const unqProvince = _.uniq(_.map(this.feedbackChart, 'status'));

      const datas = [];
      for (let d = 0; d < unqProvince.length; d++) {
        const obj = { status: unqProvince[d], data: [] };
        datas.push(obj);
      }
      for (let k = 0; k < unqProvince.length; k++) {
        for (let j = 0; j < unq.length; j++) {
          const tempdata = this.feedbackChart.filter(x => x.year === unq[j] && x.status === unqProvince[k]);
          if (tempdata.length > 0) {
            datas[k].data.push(tempdata[0].noOfRequests);
          } else {
            datas[k].data.push(0);
          }
        }
      }
      for (let l = 0; l < this.feedbackChart.length; l++) {
        this.feedbackchartArrLabel.push(this.feedbackChart[l].status);
        this.feedbackchartArrData.push(this.feedbackChart[l].noOfRequests);
      }
      const colors = ['#f44336', '#01579B', '#1B5E20', '#E65100', '#FFD600', '#C51162', '#3E2723', '#76FF03', '#006064', '#4A148C'];
      const arr = [];
      for (let a = 0; a < datas.length; a++) {
        const tempD = {
          label: datas[a].status,
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
    }, error => {
      this.loaderService.display(false);
    })
  }

  submit() {

    if (this.notes !== undefined && this.rating !== undefined) {
      let data = {
        'dated': new Date(),
        'feedbackId': 0,
        'fromUserId': this.userId,
        'notes': this.notes,
        'rating': this.rating,
        'toUserId': this.data.applicantUserId,
        'workflowId': this.data.workflowId
      }

      this.loaderService.display(true);
      this.restService.saveWorkflowUserFeedback(data).subscribe((res) => {
        this.initialise()

        this.loaderService.display(false);
      }, error => {
        this.loaderService.display(false);
      });

    } else {
      this.snackbar.openSnackBar('Please fill all fields', 'Error');
    }
  }

  close() {
    this.dialogRef.close();
  }

}
