import { Component, OnInit } from '@angular/core';
import {UtilityService} from '../../services/utility.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

    isSpinnerVisible = false;
    message: String;

    constructor(private utility: UtilityService) {
    }

    ngOnInit(): void {
      this.message = this.utility.message;
    }

}
