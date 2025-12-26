import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../dialog-modal/dialog-modal/dialog-modal.component';
import { AuthStateService } from 'src/app/services/auth/auth-state.service';
import { LoaderService } from 'src/app/services/loader.service';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authState: AuthStateService, private loaderService: LoaderService, private dialog: MatDialog,
        private route: ActivatedRoute
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let msg = '';
            if ([401].includes(err.status)) {
                this.loaderService.setLoading(false);
                this.router.events.subscribe(event => {
                    if (event instanceof NavigationStart) {
                        if (event.url.indexOf("/auth/logout") < 0 && event.url.indexOf("/auth/login") < 0) {
                            localStorage.setItem('rota', event.url);
                        }
                    }
                });

                this.router.navigate(["/auth/logout"], { queryParams: { addroute: 'true' } });
                // Swal.fire({
                //     icon: "error",
                //     text: err.error.message,
                //     draggable: true,
                //     confirmButtonColor: "#A9C92F",
                //     cancelButtonColor: "#d33",
                //     //title: "Oops...",
                //     //footer: '<a href="#">Why do I have this issue?</a>'
                // }).then((result) => {
                //     this.router.navigate(["/auth/logout"]);
                //   });

                return throwError(() => error);
            } else if ([403].includes(err.status)) {
                let mensagem = (err.error.mensagem) ? err.error.mensagem : err.error.message;
                console.log(mensagem);
                Swal.fire({
                    icon: "error",
                    text: mensagem,
                    draggable: true,
                    confirmButtonColor: "#A9C92F",
                    cancelButtonColor: "#d33",
                    //title: "Oops...",
                    //footer: '<a href="#">Why do I have this issue?</a>'
                });

                this.loaderService.setLoading(false);
                return throwError(() => mensagem);
            } else if ([404].includes(err.status)) {
                msg = err.error.mensagem;
            } else if ([412].includes(err.status)) {
                if (request.url.indexOf('avaliacoes-liberadas') < 0) {
                    if (typeof err.error.errors === 'object') {
                        const erros: Array<string> = [];
                        console.log(err.error.errors);
                        Object.values(err.error.errors).forEach((value: any) => {
                            msg += value + "\n";
                        });
                    } else {
                        msg = err.error.message;
                    }
                }
            } else if ([400, 405, 422, 500].includes(err.status)) {
                if (typeof err.error.errors === 'object') {
                    const erros: Array<string> = [];
                    Object.values(err.error.errors).forEach((value: any) => value.forEach((_: any) => erros.push(_)));
                    erros.forEach((valor: any) => {
                        msg += valor + "\n";
                    });
                } else {
                    msg = err.error.message;
                }
            }

            if (msg != '') {
                Swal.fire({
                    icon: "error",
                    text: msg,
                    draggable: true,
                    confirmButtonColor: "#A9C92F",
                    cancelButtonColor: "#d33",
                    //title: "Oops...",
                    //footer: '<a href="#">Why do I have this issue?</a>'
                });

                this.authState.setAuthState(false);
                this.loaderService.setLoading(false);
            }

            const error = err.error?.message || err?.statusText;
            return throwError(() => error);
        }))
    }
}