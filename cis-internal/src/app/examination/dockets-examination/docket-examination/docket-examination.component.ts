import { Component, OnInit , OnChanges, SimpleChanges, Input} from '@angular/core';
import { data } from 'jquery';
import { DOCKET, DOCKETSHOW, EXAMINATIONFORM } from '../../../constants/enums';
import { NumberingComponent } from '../../../lodgement/numbering/numbering.component';
import { RestcallService } from '../../../services/restcall.service';

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

  // ExaminationItems =[{ name: 'Check fees' },
  // {  name: 'certificte' }];

  ExaminationItems: any [];
  masterdocketId = 1;
  docketInfo : any;
  parentID : number;
  docketListId: any;
  checked = false;
  CheckedValue: any;

  RadioDisable: any;
  user='Scrutinizer'

  values: any [][] =[];

  constructor(private restService: RestcallService) {

   }

  ngOnChanges(){
    debugger;
    if(this.batchDetails!=undefined){
      this.getDocumentType();
      this.viewDocketBasedOnType();
      this.setRadios();

    }
  }

  ngOnInit(): void {
    //this.getBatch();

    this.getDocketDetails()
  }

  getDocketDetails(){
    this.restService.getMasterDocketDetails(this.masterdocketId).subscribe(payload=>{
      this.docketInfo=payload.data;
    });

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
           this.parentID = 1
           this.getDocketListByID(this.parentID);
           this.setRadios();
           
        }else if(type.includes(DOCKET.GENERALPLAN)){
           this.generalplan = true;
           this.parentID = 5
        }else if(type.includes(DOCKET.SECTIONALTITLEPLAN)){
           this.sectionaltitleplan = true;
           this.parentID = 3 
        }else if(type.includes(DOCKET.SERVITUDEPLAN)){
          this.servitudeplan = true;
          this.parentID = 6
        }else if(type.includes(DOCKET.SURVEYRECORD)){
          this.surveyrecord = true;
          this.parentID = 2
        }
    }
  }

  getDocketListByID(parentID: number)
  {
    this.restService.getDocketListByID(this.parentID).subscribe(payload=>{
      debugger;
      this.ExaminationItems=payload.data;
     });
  }

  
  OnItemChange(e) {
    debugger;
    this.docketListId= e.target.name;

     
    this.CheckedValue= e.target.value;
    var name = this.ExaminationItems.find(x=>x.docketListId==this.docketListId).name
    
    this.values.push([name,this.CheckedValue])
  }

  convertArrayToJson()
  {
    debugger;
    var myJson = JSON.stringify(this.values);
    console.log(myJson);
    this.restService.updateDocket(2,myJson).subscribe(payload=>{
      this.docketInfo=payload.data;
    });
  }
  
  setRadios()
{
  debugger;
  if(this.user=='examiner')
  {
    this.RadioDisable==true;
  }
  else{
    this.RadioDisable = false;
  }
}


  

}
