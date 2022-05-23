import { FormControl, ValidatorFn, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class Validator {

    public static strong(control: FormControl): ValidationResult {
        const hasNumber = /\d/.test(control.value);
        const hasUpper = /[A-Z]/.test(control.value);
        const hasLower = /[a-z]/.test(control.value);
        const valid = hasNumber && hasUpper && hasLower;
        if (!valid) {
            // return what´s not valid
            return { strong: true };
        }
        return null;
    }

}
export const CompareValidation: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('Password');
    const cpassword = control.get('confirm_password');
    return password && cpassword && password.value !== cpassword.value ? { 'ismatch': true } : null;
};
export const CompareValidation2: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const cpassword = control.get('confirm_password');
    return password && cpassword && password.value !== cpassword.value ? { 'ismatch': true } : null;
};
export function AlreadyRegisteredEmail(emails: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return emails.indexOf(('' + control.value).toLowerCase().trim()) > -1 ? { 'alreadyemail': true } : null;
    };
}
