import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {SnackbarService} from '../../services/snackbar.service';

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
    step1: boolean;
    step2: boolean;
    step3: boolean;
    public firstForm: FormGroup;
    public secondForm: FormGroup;
    public thirdForm: FormGroup;

    secq1 = '';
    secq2 = '';
    secq3 = '';
    ans1 = '';
    ans2 = '';
    ans3 = '';

    hide1 = true;
    hide2 = true;
    newPassword: '';
    confirmPassword: '';

    constructor(private fb: FormBuilder, private router: Router,
                private snackbar: SnackbarService) {
    }

    ngOnInit() {
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.firstForm = this.fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])]
        });
        this.secondForm = this.fb.group({
            'ans1': ['', Validators.required],
            'ans2': ['', Validators.required],
            'ans3': ['', Validators.required]
        });
        this.thirdForm = this.fb.group({
            'newPassword': password,
            'confirmPassword': confirmPassword
        });
    }

    submitStep1() {
    }

    async getUser() {
    }

    submitStep2() {
        this.snackbar.openSnackBar('Please check your email', 'Success');
        this.router.navigate(['/authentication/login']);
    }

    submitStep3() {
        this.router.navigate(['/login']);
    }
}
