import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-diagram-docket',
  templateUrl: './diagram-docket.component.html',
  styleUrls: ['./diagram-docket.component.css']
})
export class DiagramDocketComponent implements OnInit,OnChanges {

  @Input() diagramInformation;
  diagramDocketArray: any [] = [];

  tabs: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.diagramInformation!=undefined){
      this.t();
    }
    
  }


  t(){
    debugger;
    this.diagramInformation;
    let j = 0;
     for (let i = 0; i< this.diagramInformation.length; i++) {
       /* if(this.diagramInformation[0].parentId==0){
          this.tabs[j] = this.diagramInformation[i]; 
       } */
      
       this.diagramDocketArray[i]=this.diagramInformation[i];
    }
  }

  updateDocketList(parentList,childList){
    console.log(childList[1].name);
     alert(childList);
  }


}
