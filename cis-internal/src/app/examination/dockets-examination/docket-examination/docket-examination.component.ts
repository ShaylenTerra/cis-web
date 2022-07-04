import { Component, OnInit , OnChanges, SimpleChanges, Input} from '@angular/core';
import { data } from 'jquery';
import { DOCKET, DOCKETSHOW, EXAMINATIONFORM } from '../../../constants/enums';
import { RestcallService } from '../../../services/restcall.service';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { NumberingComponent } from '../../../lodgement/numbering/numbering.component';

@Component({
  selector: 'app-docket-examination',
  templateUrl: './docket-examination.component.html',
  styleUrls: ['./docket-examination.component.css']
})
export class DocketExaminationComponent implements OnInit,OnChanges {
  @Input() batchDetails; 

  documentTypeObj: any;
  documentTypeArray: any[]=[];

  diagram: boolean = false;
  generalplan: boolean = false;
  servitudeplan: boolean = false;
  sectionaltitleplan: boolean = false;
  surveyrecord: boolean = false;

  docketList: any;
  docketByParentId: any;

  ExaminationItems: any [];
  masterdocketId = 1;
  docketInfo : any;
  parentID : number;
  docketListId: any;

  typeId: any;
  docketInformation: any;

  constructor(private restService: RestcallService) {  }

  ngOnChanges(){
    if(this.batchDetails!=undefined){
      this.getDocumentType();
      this.viewDocketBasedOnType();
      this.getDocketList();
      this.getDocketListByParentId();
    }
  }

  ngOnInit(): void {
    //this.getDocketDetails();
  }

  getDocumentType(){
    this.documentTypeObj = this.batchDetails.lodgementBatchSgDocuments;
    for (let i = 0; i < this.documentTypeObj.length; i++) {
      this.documentTypeArray.push(this.documentTypeObj[i].documentType);
    }
  }

  viewDocketBasedOnType(){
    for (let j = 0; j < this.documentTypeArray.length; j++) {
        const type = this.documentTypeArray[j].toUpperCase();
        if(type.includes(DOCKET.DIAGRAM)){
           this.diagram = true;
           this.typeId=1;
           this.getDocketListByType(this.typeId);
        }else if(type.includes(DOCKET.GENERALPLAN)){
           this.generalplan = true;
        }else if(type.includes(DOCKET.SECTIONALTITLEPLAN)){
           this.sectionaltitleplan = true;
        }else if(type.includes(DOCKET.SERVITUDEPLAN)){
          this.servitudeplan = true;
        }else if(type.includes(DOCKET.SURVEYRECORD)){
          this.surveyrecord = true;
        }
    }
  }

  /* Docket */
  getDocketList(){
    this.restService.getDocketList().subscribe(dockets=>{
       this.docketList = dockets.data;
    });
  }

  getDocketListByParentId(){
    const parentId = 0 ;
    this.restService.getDocketListWithParentId(parentId).subscribe(docketbyParent=>{
       this.docketByParentId = docketbyParent.data;
    });
  }

  getDocketDetails(){
    this.restService.getMasterDocketDetails(this.masterdocketId).subscribe(payload=>{
      this.docketInfo=payload.data;
    });
  }

  getDocketListByID(parentID: number){
    this.restService.getDocketListByID(this.parentID).subscribe(payload=>{
      this.ExaminationItems=payload.data;
     });
  }

  getDocketListByType(typeId){
    this.restService.getDocketListByType(typeId).subscribe(docketByType=>{
      this.docketInformation=docketByType.data;
    });
  }
  
}
