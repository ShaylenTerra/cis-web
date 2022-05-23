import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BaseService } from '../services/base.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (sessionStorage.length > 0) {
            // this.router.navigate(['home']);
            return true;
        } else if (sessionStorage.length === 0) {
            this.router.navigate(['/authentication/login']);
            return false;
        }
        // return !this.authService.isLoggedIn();
    }
}
