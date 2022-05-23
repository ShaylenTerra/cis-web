import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UtilityService} from '../../services/utility.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

    isSpinnerVisible = false;
    message: String;
    userDetail: any;
    constructor(private utility: UtilityService, private router: Router) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        this.userDetail = this.router.getCurrentNavigation().extras.state.userDetail;
      }
    }

    ngOnInit(): void {
      this.message = this.utility.message;
    }

    navigateToLogin() {
      this.router.navigate(['/authentication/login'], {state: {userDetail: this.userDetail}});
    }
}
