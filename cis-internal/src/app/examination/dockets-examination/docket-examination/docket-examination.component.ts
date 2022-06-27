import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DOCKET, DOCKETSHOW, EXAMINATIONFORM } from '../../../constants/enums';
import { RestcallService } from '../../../services/restcall.service';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';

class TreeNode {
  name: string;
  children?: TreeNode[];
}

/* const TREE_DATA: TreeNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
]; */
/** Flat node with expandable and level information */
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

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  TREE_DATA: any[];
  name: any;
  children: any[];

  docketList: any;
  docketByParentId: any;

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


  constructor(private restService: RestcallService) {  }
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  ngOnChanges(){
    debugger;
    if(this.batchDetails!=undefined){
      this.getDocumentType();
      this.viewDocketBasedOnType();
      this.getDocketList();
      this.getDocketListByParentId();
      this.dataSource.data = this.TREE_DATA;
      this.setRadios();
    }
  }

  ngOnInit(): void {
    //this.getBatch();
    this.getDocketDetails();
  }

  getDocumentType(){
    debugger;
    this.documentTypeObj = this.batchDetails.lodgementBatchSgDocuments;
    for (let i = 0; i < this.documentTypeObj.length; i++) {
      this.documentTypeArray.push(this.documentTypeObj[i].documentType);
    }
  }

  viewDocketBasedOnType(){
    debugger;
    for (let j = 0; j < this.documentTypeArray.length; j++) {
        const type = this.documentTypeArray[j].toUpperCase();
        if(type.includes(DOCKET.DIAGRAM)){
           this.diagram = true;
           this.parentID = 1;
           this.getDocketListByID(this.parentID);
           this.setRadios();
        }else if(type.includes(DOCKET.GENERALPLAN)){
           this.generalplan = true;
           this.parentID = 5;
        }else if(type.includes(DOCKET.SECTIONALTITLEPLAN)){
           this.sectionaltitleplan = true;
           this.parentID = 3;        
        }else if(type.includes(DOCKET.SERVITUDEPLAN)){
          this.servitudeplan = true;
          this.parentID = 6;
        }else if(type.includes(DOCKET.SURVEYRECORD)){
          this.surveyrecord = true;
          this.parentID = 2;
        }
    }
  }

  /* Docket */
  getDocketList(){
    this.restService.getDocketList().subscribe(dockets=>{
       debugger;
       this.docketList = dockets.data;
       debugger;
    });
  }

  getDocketListByParentId(){
    const parentId = 0 ;
    this.restService.getDocketListWithParentId(parentId).subscribe(docketbyParent=>{
       debugger;
       this.docketByParentId = docketbyParent.data;
       //this.filterDocketListDisplay();
       debugger;
    });
  }
  

  /* filterDocketListDisplay(){
    debugger;
    let k = 0 ;
     for(let i = 0 ; i < this.docketByParentId.length ;i++){
        this.name = this.docketByParentId[i].name;
      for(let j = 0 ; j < this.docketList.length ;j++){
        if(this.docketByParentId[i].docketListId==this.docketList[j].parentId){
            this.children[k]="name: "+this.docketList[j].name;
            k++;
        }
      }
      const tree = new TreeNode();
      tree.name=this.name;
      tree.children=this.children;
      this.TREE_DATA.push(tree);
     }

  } */


  getDocketDetails(){
    this.restService.getMasterDocketDetails(this.masterdocketId).subscribe(payload=>{
      this.docketInfo=payload.data;
      debugger;
    });

  }


  getDocketListByID(parentID: number)
  {
    this.restService.getMasterDocketDetails(this.parentID).subscribe(payload=>{
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
