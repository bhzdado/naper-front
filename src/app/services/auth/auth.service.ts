import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
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

  constructor(private http: HttpClient, private token: TokenService, private router: Router, private dialog: MatDialog) { }
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
    if(!localStorage.getItem('usuario')){
      return null;
    }
    return JSON.parse(atob(localStorage.getItem('usuario') ?? ""));
  }

  getUserAcl(): any {
    return JSON.parse(atob(localStorage.getItem('usuarioAcl') ?? ""));
  }

  refresh(): any {
    return this.http.post<any>(environment.urlApi + 'auth/refresh', null);
  }

  loadAclUser(id: number): any{
    return this.http.get(environment.urlApi + 'usuarios/acl/' + id);
  }


  refreshToken() {
    this.refresh().subscribe(
      (data) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('api_token');
        this.token.handleData(data.authorization.access_token);
        localStorage.setItem('api_token', data.authorization.api_token);
      },
      (error) => {
        if (error.status == 401) {
          this.stopRefreshTokenTimer();
          // const dialogRef = this.dialog.open(DialogModalComponent, {
          //   width: '400px',
          //   data: {
          //     titulo: 'ERRO',
          //     conteudo: error.message,
          //     tipo: "erro"
          //   },
          // });
          // dialogRef.afterClosed().toPromise()
          //   .then(result => {
          //     //window.location.href = "auth/login";
          //     this.router.navigate(["/auth/login"]);
          //     return Promise.resolve(result);
          //   });
        }
      });
  }


  public iniciaTempoOciosidade() {
    this._segundosPassados = 0;
  }

  public startRefreshTokenTimer() {

    const jwtToken = JSON.parse(atob(this.token.getToken().split('.')[1]));

    this.iniciaTempoOciosidade();
    this.refreshTokenTimeout = setInterval(() => {
      if (this._segundosPassados == 0 ) {
        this._segundosPassados++;
        this.refreshToken();
      } else if(this._segundosPassados > this.tempoSegundos){
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