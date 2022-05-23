import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { LoaderService } from '../../services/loader.service';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-requestflow-reservation',
  templateUrl: './requestflow-reservation.component.html',
  styleUrls: ['./requestflow-reservation.component.css']
})
export class RequestflowReservationComponent implements OnInit {
  result: any[] = [];
  @Input() workflowId;
  constructor(private restService: RestcallService,
    private snackbar: SnackbarService,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.getWorkflowTasks();
  }

  getWorkflowTasks() {
    this.loaderService.display(true);
    this.restService.getWorkflowTasks(this.workflowId).subscribe(payload => {
      const notesData = payload.data;
      for (let i = 0; i < notesData.length; i++) {
        notesData[i].convertedDate = notesData[i].postedOn.substring(0, 10);
        notesData[i].convertedTime = notesData[i].postedOn.substring(11, 16);
      }
      this.result = _(_.orderBy(payload.data, ['dated'], ['desc']))
        .groupBy((x) => x.postedOn)
        .map((value, key) => ({ date: key, timeline: value }))
        .value();
      this.loaderService.display(false);
    },
      error => {
        this.loaderService.display(false);
        if (error.message === 'No tasks found.') {
          this.snackbar.openSnackBar('No tasks found.', 'Message');
        } else {
          this.snackbar.openSnackBar('Unknown error while retreiving information.', 'Error');
        }
      });
  }

}
