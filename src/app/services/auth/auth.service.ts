import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { AutenticarComponent } from 'src/app/site/shared/modal/autenticar/autenticar.component';
// User interface
export class User {
  name!: String;
  email!: String;
  password!: String;
  password_confirmation!: String;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private refreshTokenTimeout;
  private tempoSegundos = 1680;
  private _segundosPassados = 0;
  public dataUltimaTarefa: any = null;
  public reiniciarToken: boolean = false;
  private _dataInicial: number = new Date().getTime();

  constructor(private http: HttpClient, public token: TokenService, private router: Router, private dialog: MatDialog) { }
  // User registration
  register(user: User): Observable<any> {
    return this.http.post(environment.urlApi + 'auth/register', user);
  }
  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'auth/login', user);
  }
  // Access user profile
  profileUser(): Observable<any> {
    return this.http.get(environment.urlApi + 'auth/me');
  }

  enviaEmailRecuperarSenha(email: any): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'auth/enviaEmailRecuperarSenha', email);
  }

  getUser(): any {
    if (!localStorage.getItem('usuario')) {
      return null;
    }

    if (localStorage.getItem('usuario')) {
      let usuario = localStorage.getItem('usuario') ?? "";
      if (usuario) {
        return JSON.parse(atob(usuario));
      }
    }

    return {};
  }

  getUserAcl(): any {
    return JSON.parse(atob(localStorage.getItem('usuarioAcl') ?? ""));
  }

  refresh(): any {
    return this.http.post(environment.urlApi + 'auth/refresh', []).subscribe(
      (response: any) => {
        if (response.status == 401) {
          this.operModalAutenticar();
          return false;
        } else {
          localStorage.removeItem('access_token');
          localStorage.removeItem('api_token');
          this.token.handleData(response.authorization.access_token);
          localStorage.setItem('api_token', response.authorization.api_token);
          localStorage.setItem('access_token', response.authorization.access_token);
        }
        return response.authorization;
      },
      (error) => {
        console.log('Erro ao atualizar token:', error);
        this.operModalAutenticar();
        return false;
      });
  }

  operModalAutenticar() {
    const dialogRef = this.dialog.open(AutenticarComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().toPromise()
      .then(result => {
        if (result) {
          this.router.navigate(['/auth/login']);
        }
        return Promise.resolve(result);
      });
  }

  loadAclUser(id: number): any {
    return this.http.get(environment.urlApi + 'usuarios/acl/' + id);
  }

  getAccessToken() {
    return this.token.getToken();
  }

  refreshToken() {
    return this.refresh();
  }


  public iniciaTempoOciosidade() {
    this._segundosPassados = 0;
  }

  public startRefreshTokenTimer() {

    const jwtToken = JSON.parse(atob(this.token.getToken().split('.')[1]));

    this.iniciaTempoOciosidade();
    this.refreshTokenTimeout = setInterval(() => {
      if (this._segundosPassados == 0) {
        this._segundosPassados++;
        this.refreshToken();
      } else if (this._segundosPassados > this.tempoSegundos) {
        this.stopRefreshTokenTimer();
      } else {
        this._segundosPassados++;
      }
    }, 1000);
  }

  public stopRefreshTokenTimer() {
    clearInterval(this.refreshTokenTimeout);
  }
}