import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class UtilityService {
    message: String;
    constructor(private router: Router) {
    }

    forcefulRedirectTo(uri: string, data: any) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
            this.router.navigate([uri], data)
        );
    }

    public setMessage(message) {
        this.message = message;
    }
    public getMessage() {
      return  this.message;
    }
}
