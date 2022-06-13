import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DOCKET, DOCKETSHOW, EXAMINATIONFORM } from '../../../constants/enums';

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

  constructor() { }

  ngOnChanges(){
    debugger;
    if(this.batchDetails!=undefined){
      this.getDocumentType();
      this.viewDocketBasedOnType();
    }
  }

  ngOnInit(): void {
    //this.getBatch();
  }

  getDocumentType(){
    debugger;
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


}
