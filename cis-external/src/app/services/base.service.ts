import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mapTo, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable()
export class BaseService {
    constructor(
        protected http: HttpClient,
        public authService: AuthService
    ) {
    }

    get(params: HttpParams = new HttpParams(), fullUrl: string): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.get(fullUrl, {headers: headers})
            .pipe(catchError(this.formatErrors));
    }

    put(body: Object = {}, fullUrl: string): Observable<any> {
        return this.http.put(
            fullUrl,
            JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
    }

    post(body: Object = {}, fullUrl: string, options1?: any): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.post(
            fullUrl,
            body, {headers: headers}
        ).pipe(catchError(this.formatErrors));
    }

    postTextResponse(body: Object = {}, fullUrl: string): Observable<any> {
        return this.http.post(
            fullUrl,
            JSON.stringify(body), {responseType: 'text'}
        ).pipe(catchError(this.formatErrors));
    }

    postFormdata(formData: FormData, fullUrl: string): Observable<any> {
        const headers = new HttpHeaders();
        // headers.append('Access-Control-Allow-Origin', '*');
        /*headers.append('Content-Type', 'multipart/form-data');*/
        // headers.append('Accept', '*/*');
        headers.append('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.post(
            fullUrl,
            formData, {
                headers: headers
            }
        ).pipe(catchError(this.formatErrors));
    }

    postFileResponse(body: Object = {}, fullUrl: string): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.post(
            fullUrl,
            body, {responseType: 'blob'}
        ).pipe(catchError(this.formatErrors));
    }

    getFileResponse(fullUrl: string): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.get(
            fullUrl,
            {responseType: 'blob'}
        ).pipe(catchError(this.formatErrors));
    }

    delete(fullUrl: string): Observable<any> {
        return this.http.delete(
            fullUrl
        ).pipe(catchError(this.formatErrors));
    }

    getHeaderResponse(params: HttpParams = new HttpParams(), fullUrl: string): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.get(fullUrl, {headers: headers, observe: 'response'})
            .pipe(catchError(this.formatErrors));
    }

    logout(data: any, fullUrl: string): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.delete(fullUrl, {headers: headers, observe: 'response'}
        ).pipe(
            tap(() => this.authService.doLogoutUser()),
            mapTo(true),
            catchError(error => {
                // alert(error.error);
                return of(false);
            }));
    }

    postAuth(body: any, fullUrl: string, options1?: any): Observable<any> {
        const bodyData = new HttpParams()
            .set('grant_type', 'password')
            .set('username', body.username)
            .set('password', body.password);

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Basic ' + this.authService.getBasicAuthToken());
        return this.http.post<any>(
            fullUrl,
            bodyData, {headers: headers}
        ).pipe(
            tap(tokens => this.authService.doLoginUser(body.username, tokens)),
            mapTo(true),
            // catchError(error => {
            //   // alert(error.error);
            //   catchError(this.formatErrors)
            //   return of(error);
            // })
        );
    }

    getWithoutAuth(params: HttpParams = new HttpParams(), fullUrl: string): Observable<any> {
        return this.http.get(fullUrl)
            .pipe(catchError(this.formatErrors));
    }

    postWithoutAuth(body: Object = {}, fullUrl: string, options1?: any): Observable<any> {
        return this.http.post(
            fullUrl,
            body
        ).pipe(catchError(this.formatErrors));
    }

    postHeaderResponse(body: Object = {}, fullUrl: string, options1?: any): Observable<any> {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'bearer ' + this.authService.getJwtToken());
        return this.http.post(fullUrl, body, {headers: headers, observe: 'response'})
            .pipe(catchError(this.formatErrors));
    }

    private formatErrors(error: any) {
        return throwError(error.error);
    }
}
