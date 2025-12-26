import { Injectable, ViewChild } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpStatusCode
}
    from '@angular/common/http';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../dialog-modal/dialog-modal/dialog-modal.component';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/auth/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavRightComponent } from 'src/app/theme/layout/admin/nav-bar/nav-right/nav-right.component';
@Injectable()
export class Interceptor implements HttpInterceptor {
    @ViewChild('nr', { static: false }) private navRightComponent: NavRightComponent;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private token: TokenService,
        public authService: AuthService,
    ) { }

    getCabecalho(request: HttpRequest<any>) {
        if (request.url.indexOf('viacep') < 0 && request.url.indexOf('auth/login') < 0  && request.url.indexOf('password') < 0) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + (localStorage.getItem('access_token')??''),
                    API_TOKEN: localStorage.getItem('api_token')??'',
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            });
        }
        return request;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = this.getCabecalho(request);
        let segundosRestantes = 0;
        if (request.url.indexOf('auth/login') < 0) {
            if (!this.authService.dataUltimaTarefa) {
                this.authService.dataUltimaTarefa = new Date();
            } else {
                let agora = new Date();
                segundosRestantes = (agora.getTime() - this.authService.dataUltimaTarefa.getTime()) / 1000;

                this.authService.reiniciarToken = true;
                if(segundosRestantes > 1680){
                    this.authService.reiniciarToken = false;
                } else {
                    this.authService.dataUltimaTarefa = new Date();
                }
            }
        }
        //this.authService.refreshToken();

        const $handle = next.handle(request)
            .pipe(
                retry(0),
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {

                    }
                    return event;
                }),
            );

        return $handle;
    }

    responseHandler(data: any) {

    }
}