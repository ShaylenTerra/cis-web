import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';

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
    isSpinnerVisible = false;
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    hide1 = true;
    hide2 = true;
    hide3 = true;

    constructor(private fb: FormBuilder, private router: Router) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            currentPassword: ['', Validators.required],
            password: password,
            confirmPassword: confirmPassword
        });
    }

    onSubmit() {
        this.router.navigate(['/login']);
    }
}
