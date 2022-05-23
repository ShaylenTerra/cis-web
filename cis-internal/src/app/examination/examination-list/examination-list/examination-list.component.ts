import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-examination-list',
  templateUrl: './examination-list.component.html',
  styleUrls: ['./examination-list.component.css']
})
export class ExaminationListComponent implements OnInit {

  constructor() { }

  displayedColumns: string[] = ['referenceNumber', 'reservationName', 'processName', 'provinceName', 'actionRequiredCaption', 'internalStatusCaption', 'triggeredOn', 'lastStatusUpdate'];
  lodgementColumns: string[] = ['draftName', 'username', 'updated'];
  @ViewChild(MatSort) matSort1: MatSort;
  @ViewChild(MatPaginator) paginator1: MatPaginator;

  @ViewChild('table2', { read: MatSort }) matSort2: MatSort;
  @ViewChild('table2', { read: MatPaginator }) paginator2: MatPaginator;
  ngOnInit(): void {
  }

}
