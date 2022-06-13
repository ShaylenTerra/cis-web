import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SendSMSModalComponent } from '../../../tasks/task-details/modal/send-sms-modal.dialog';

@Component({
  selector: 'app-referral-input-examination',
  templateUrl: './referral-input-examination.component.html',
  styleUrls: ['./referral-input-examination.component.css']
})
export class ReferralInputExaminationComponent implements OnInit {

  searchRequestsData: any[] = [];
  refCols: Array<string> = ['referenceNo', 'triggeredOn', 'fromUser', 'requestNote', 'toUser',
    'referralInput', 'createdOn', 'status', 'sms'];
  refData: any;
  refDataLength: number;
  referrals: any[];
  @Input() workflowId;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(private loaderService: LoaderService,
    private restService: RestcallService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private router: Router) { }

    ngOnInit(): void {
      this.getAllReferrals();
    }
  
    getAllReferrals() {
      this.loaderService.display(true);
      this.restService.getAllReferrals(this.workflowId ).subscribe((res: any) => {
        this.loaderService.display(false);
        this.referrals = res.data;
        this.refData = new MatTableDataSource(this.referrals);
        this.refData.sort = this.sort;
        this.refData.paginator = this.paginator;
        this.refDataLength = this.refData.data.length || 0;
      });
    }
  
   /*  sendSMS() {
      const dialog = this.dialog.open(SendSMSModalComponent, {
        width: '50%'
      });
  
      dialog.afterClosed().subscribe(data => {
        if (data) {
          this.restService.sendSMS(data.to, data.body).subscribe(() => {
            this.snackbar.openSnackBar('SMS send Succesfully', 'Success');
          });
        }
      });
    } */
  
    ngOnChanges() {
      this.getAllReferrals();
    }
  
    navigate(requestDetail) {
      this.router.navigate(['/task-profile'],
        { state: { taskDetail: requestDetail === undefined ? this.searchRequestsData[0] : requestDetail } });
    }

}
