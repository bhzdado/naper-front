import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../dialog-modal/dialog-modal/dialog-modal.component';
import { AuthStateService } from 'src/app/services/auth/auth-state.service';
import { LoaderService } from 'src/app/services/loader.service';

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

                this.router.navigate(["/auth/logout"]);

                const dialogRef = this.dialog.open(DialogModalComponent, {
                    width: '400px',
                    data: {
                        titulo: 'ERRO',
                        conteudo: err.error.message,
                        tipo: "erro"
                    },
                });

                dialogRef.afterClosed().subscribe(result => {
                    this.router.navigate(["/auth/logout"]);
                });

                return throwError(() => error);
            } else if ([403].includes(err.status)) {
                console.log(err);
                let mensagem = (err.error.mensagem) ? err.error.mensagem : err.error.message;
                const dialogRef = this.dialog.open(DialogModalComponent, {
                    width: '400px',
                    data: {
                        titulo: 'ERRO',
                        conteudo: mensagem,
                        tipo: "erro"
                    },
                });

                this.loaderService.setLoading(false);
                return throwError(() => error);
            } else if ([404].includes(err.status)) {
                const dialogRef = this.dialog.open(DialogModalComponent, {
                    width: '400px',
                    data: {
                        titulo: 'ERRO',
                        conteudo: err.error.mensagem,
                        tipo: "erro"
                    },
                });
                // this.router.navigate(["pagina-nao-encontrada"]);
                return throwError(() => error);
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
                const dialogRef = this.dialog.open(DialogModalComponent, {
                    width: '400px',
                    data: {
                        titulo: 'ERRO',
                        conteudo: msg,
                        tipo: "erro"
                    },
                });

                this.loaderService.setLoading(false);
                this.authState.setAuthState(false);

                dialogRef.afterClosed().subscribe(result => {
                    //this.router.navigate(["/"]);
                });
            }
            //this.router.navigate(["erro-servidor"]);

            const error = err.error?.message || err.statusText;
            return throwError(() => error);
        }))
    }
}