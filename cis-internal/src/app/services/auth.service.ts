import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {Tokens} from '../models/token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly USERID = 'USERID';
  private loggedUser: string;

  constructor(private http: HttpClient) {}

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    const url = environment.tokenUrl;
    const bodyData = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.getRefreshToken());
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', 'Basic ' + this.getBasicAuthToken());
    return this.http.post<any>(url, bodyData
    , {headers: headers}).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.access_token);
      this.storeTokens(tokens);
    }),
    catchError(error => {
          return of(error);
        })
    );
  }

  getJwtToken() {
    return sessionStorage.getItem(this.JWT_TOKEN);
  }

  public doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  public getBasicAuthToken() {
    return window.btoa(environment.clientId + ':' + environment.clientSecret);
  }
  public doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  public getRefreshToken() {
    return sessionStorage.getItem(this.REFRESH_TOKEN);
  }

  public storeJwtToken(jwt: string) {
    sessionStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    sessionStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    sessionStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
    sessionStorage.setItem(this.USERID, tokens.userId.toString());
  }

  private removeTokens() {
    sessionStorage.removeItem(this.JWT_TOKEN);
    sessionStorage.removeItem(this.REFRESH_TOKEN);
    sessionStorage.removeItem(this.USERID);
  }
}
