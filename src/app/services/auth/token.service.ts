import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private issuer = {
    login: environment.urlApi + 'auth/login',
    register: environment.urlApi + 'auth/register',
    refresh: environment.urlApi + 'auth/refresh',
  };
  constructor() { }
  handleData(token: any) {
    localStorage.setItem('access_token', token);
  }
  getToken() {
    return localStorage.getItem('access_token');
  }
  // Verify the token
  isValidToken() {
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.issuer).indexOf(payload.iss) > -1
          ? true
          : false;
      }
    }

    return false;
  }
  payload(token: any) {
      const jwtPayload = token.split('.')[1];
      return JSON.parse(atob(jwtPayload));
  }
  // User state based on valid token
  isLoggedIn() {
    return this.isValidToken();
  }
  // Remove token
  removeToken() {
    localStorage.removeItem('access_token');
  }
}