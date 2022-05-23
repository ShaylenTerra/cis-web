import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {User} from '../../../models/externalUser';

const password = new FormControl('', [Validators.required, Validators.minLength(8),
  Validators.pattern('^.*(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')]);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public form: FormGroup;
  user: User = new User;
  isSpinnerVisible = false;
  newPassword = '';
  confirmPassword = '';
  hide1 = true;
  hide2 = true;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      newPassword: password,
      confirmPassword: confirmPassword
    });
  }

  submit() {
  }
}
