import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RestcallService } from '../../../services/restcall.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-tempdialog',
  templateUrl: './tempdialog.component.html',
  styleUrls: ['./tempdialog.component.css']
})
export class TempdialogComponent implements OnInit {

  columns = ['Dated', 'UserName', 'Subject', 'action'];
  dataSource;
  dataLength;
  tempData: any[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public dialogRef: MatDialogRef<TempdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, private snackbar: SnackbarService,
    private restService: RestcallService) {
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    this.getTemplateHistory();
  }

  getTemplateHistory() {
      this.restService.getTemplateHistory(this.data.templateId).subscribe(response => {
          this.tempData = response.data;
          this.dataSource = new MatTableDataSource(this.tempData);
          this.dataSource.paginator = this.paginator;
          this.dataLength = this.dataSource.data.length || 0;
      });
    }


  onClose() {
    this.dialogRef.close();
  }

  save(obj) {
          this.dialogRef.close(obj);
  }
}
