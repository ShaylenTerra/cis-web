import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {RestcallService} from '../../services/restcall.service';
import {SnackbarService} from '../../services/snackbar.service';
import * as enums from '../../constants/enums';

const password = new FormControl('', [Validators.required, Validators.minLength(8),
  Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')]);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  isSpinnerVisible = false;
  step1 = true;
  step2 = false;
  step3 = false;
  step4 = false;
  public firstForm: FormGroup;
  public secondForm: FormGroup;
  public thirdForm: FormGroup;
  email = '';
  code = '';
  ans1 = '';
  message: string;
  userSecurityInfo: any;
  securityQuestions: any;

  constructor(private fb: FormBuilder, private restService: RestcallService,
    private router: Router, private snackbar: SnackbarService) { }

  ngOnInit() {
    this.firstForm = this.fb.group({
      'email': [null, Validators.compose([Validators.required, CustomValidators.email])]
    });
    this.secondForm = this.fb.group({
      'ans1': ['', Validators.required],
      // 'ans2': ['', Validators.required],
      // 'ans3': ['', Validators.required],
      'secQ1': ['', Validators.required]
    });
    this.thirdForm = this.fb.group({
      'newPassword': password,
      'confirmPassword': confirmPassword
    });

      this.loadInitialData();
  }

  loadInitialData() {
    this.restService.getListItems(enums.list_master.SECURITYQUESTION).subscribe(res => {
        this.securityQuestions = res.data;
    }, error => {
        this.snackbar.openSnackBar('An error occurred while retrieving', 'Error');
    });
  }

  submitStep1() {
    this.isSpinnerVisible = true;
    this.restService.getSecurityInfoByEmail(this.email).subscribe(res => {
      if (res.code === 50000) {
        this.isSpinnerVisible = false;
        this.snackbar.openSnackBar(res.data, 'Error');
        return;
      }
      this.step1 = false;
        this.userSecurityInfo = res.data;
        this.step2 = true;
        this.isSpinnerVisible = false;

    }, error => {
      this.snackbar.openSnackBar('An error occurred while retrieving user info', 'Error');
      this.step1 = true;
      this.isSpinnerVisible = false;
    });

  }

  submitStep2() {
    this.isSpinnerVisible = true;
    // console.log(this.secondForm.value.secQ1);
    this.restService.verifySecurityAnswerByEmail(this.secondForm.value.secQ1.itemId, this.secondForm.value.ans1, this.email)
        .subscribe(res => {
            if (res.data) {
                this.message = 'Password sent on registered email address successfully';
                this.snackbar.openSnackBar(this.message, 'Success');
                this.step4 = true;
                this.step2 = false;
            } else {
                this.message = 'Verification failed.Please try again.';
                this.snackbar.openSnackBar(this.message, 'Error');
            }
            this.isSpinnerVisible = false;
        }, error => {
            this.snackbar.openSnackBar('Server error', 'Error');
            this.isSpinnerVisible = false;
        });
    // if (this.userSecurityInfo.securityQuestionTypeItemId1 === this.secondForm.value.secQ1 && this.userSecurityInfo.) {
    //
    // }
    // if (this.ans1 === this.answer1 && this.ans2 === this.answer2 && this.ans3 === this.answer3) {
    //   this.restService.forgotPassword(this.email).subscribe((data) => {
    //     this.snackbar.openSnackBar('Password sent on registered email address successfully', 'Success');
    //     this.router.navigate(['/']);
    //   }, error => {
    //     this.snackbar.openSnackBar('Password sent on registered email address successfully', 'Success');
    //     this.router.navigate(['/']);
    //   });
    // } else {
    //   this.snackbar.openSnackBar('Answers do not Match', 'Error');
    // }

  }

  submitStep3() {
    this.isSpinnerVisible = true;
    this.restService.resetPassword(this.email).subscribe((data) => {
      this.snackbar.openSnackBar('Password Updated Successfully', 'Success');
      this.router.navigate(['/']);
    }, error => {
      this.snackbar.openSnackBar('Error occured while updating password', 'Error');
    });
    this.isSpinnerVisible = false;
  }

  submitStep4() {
      // this.step1 = true;
      // this.step4 = false;
      this.router.navigate(['/']);
  }
}
