import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CompareValidation2 } from '../../models/validators';
import { RestcallService } from '../../services/restcall.service';
import { SnackbarService } from '../../services/snackbar.service';
import * as constants from '../../constants/storage-keys';
import { CustomsValidators } from '../../profile/customa-validators';
import { error_messege } from '../../models/error_massege';
import { ConfirmPasswordComponent } from '../confirm-password/confirm-password.component';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent implements OnInit, OnDestroy {
  state: any = '';
  changeFormGroup: FormGroup;
  error_messege = error_messege;
  user: any;
  hide = true;
  hiden = true;
  hidec = true;
  isSpinnerVisible = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  oldPass: any;
  constructor(private snackbar: SnackbarService, private restService: RestcallService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private dialog: MatDialog) {
      dialogRef.disableClose = true;
    }

    ngOnInit() {
      this.user = JSON.parse(sessionStorage.getItem(constants.StorageConstants.USERINFO));
      this.oldPass = sessionStorage.getItem('password');
      this.changeFormGroup = this._formBuilder.group({
        password: ['', Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomsValidators.patternValidators(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomsValidators.patternValidators(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomsValidators.patternValidators(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomsValidators.patternValidators(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            // /[ !@#$%^&*()_+-]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])],
        confirm_password: ['', Validators.required],
      }, { validator: CompareValidation2 });
    }

    get f() {
      return this.changeFormGroup;
    }

    change_password() {
      if (!this.changeFormGroup.valid || !this.changeFormGroup.valid) {
        this.changeFormGroup.get('password').markAsTouched();
        this.changeFormGroup.get('confirm_password').markAsTouched();
        return;
      }
      this.isSpinnerVisible = true;
      const payload = {
          email: this.user.email,
          oldPassword: this.oldPass,
          newPassword: this.changeFormGroup.value.password
      };
      this.restService.updatePassword(payload).subscribe(() => {
        this.snackbar.openSnackBar('Password Updated Successfully', 'Success');
        this.changeFormGroup.reset(this.changeFormGroup.value);
        this.isSpinnerVisible = false;
        sessionStorage.removeItem('password');
        this.decisionDialog();
        this.dialogRef.close();
      },
      () => {
        this.snackbar.openSnackBar('Error Occurred on Reset Password', 'Error');
        this.isSpinnerVisible = false;
      });
  }

  decisionDialog(): void {
    const dialogRef = this.dialog.open(ConfirmPasswordComponent, {
        width: '546px',
    });
    dialogRef.afterClosed().subscribe(async (resultCode) => {
    });
}
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
