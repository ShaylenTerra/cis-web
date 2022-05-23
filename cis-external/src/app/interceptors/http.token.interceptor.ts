import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { LoaderService } from '../services/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../authentication/warning-dialog/warning-dialog.component';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(public baseService: AuthService, private router: Router, private snackbar: SnackbarService,
        private loaderService: LoaderService, private dialog: MatDialog) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.baseService.getJwtToken()) {
            if (!request.url.includes('oauth/token')) {
                request = this.addToken(request, this.baseService.getJwtToken());
            }
        }

        return next.handle(request).pipe(catchError(error => {
            // if (error instanceof HttpErrorResponse && error.status === 401 && error.code === 'UNAUTHORIZED') {
            if (error.status === 409 && error.error.code === 'UNREGISTERED_USER_ERROR') {
                return throwError(error);
            } else if (error.status === 401) {
                return this.handle401Error(request, next);
            } else {
                return throwError(error);
            }
        }));
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.baseService.refreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    if (token.status === 400) {
                        this.warningDialog();
                        this.loaderService.display(false);
                      } else {
                        this.refreshTokenSubject.next(token.access_token);
                        return next.handle(this.addToken(request, token.access_token));
                      }
                }));
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }
    warningDialog() {
        const dialogRef = this.dialog.open(WarningDialogComponent, {
            width: '450px',
        });
        dialogRef.afterClosed().subscribe(async (resultCode) => {
        });
    }
}
