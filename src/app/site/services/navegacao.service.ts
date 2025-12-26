import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LeitorComponent } from '../shared/modal/leitor/leitor.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaService } from 'src/app/services/media.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { AutenticarComponent } from '../shared/modal/autenticar/autenticar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { map, Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HeaderService } from './header.service';
import { query } from '@angular/animations';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavegacaoService {
  tokenService: TokenService = inject(TokenService);

  constructor(private router: Router, private dialog: MatDialog, public mediaService: MediaService, private authService: AuthService,
    private headerService: HeaderService, private viewportScroller: ViewportScroller
  ) { }

  navigateTo(route: string) {
    if (!this.tokenService.isLoggedIn()) {

      this.authService.refreshToken().pipe(map((response: any) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('api_token');
        localStorage.setItem('api_token', response?.authorization.api_token);
        localStorage.setItem('access_token', response.authorization.access_token);
        return response.authorization;
      }),
        catchError((err: any) => {
          console.log('erro ao renovar token', err);
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
          return throwError(err);
        }));

    } else {
      localStorage.setItem('rota', route);
      let arrRoute = route.split('/');
      this.router.navigate(arrRoute);
    }
  }

  navigateToWithParams(route: string, params: any) {
    localStorage.setItem('rota', route);
    this.router.navigate([route, params]);
  }

  navigateByLocation(route: string) {
    localStorage.setItem('rota', route);
    window.location.href = route;
  }

  navigateToUrl(url: string) {
    localStorage.setItem('rota', url);
    this.router.navigateByUrl(url);
  }

  navigateToExternalUrl(url: string) {
    window.open(url, "_blank");
  }

  telaCheia(conteudo) {
    const dialogRef = this.dialog.open(LeitorComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        tipoConteudo: 'html',
        conteudo: conteudo
      },
    });
  }

  abrirModalByUrl(url) {
    this.headerService.toggleHeader(false);
    const dialogRef = this.dialog.open(LeitorComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      height: '90%',
      width: '90%',
      data: {
        tipoConteudo: 'load',
        url: url
      },
    });
  }

  goToAnchor(anchor, urlCompleta) {
    this.viewportScroller.setOffset([0, 180]);
    this.viewportScroller.scrollToAnchor(anchor);

    /*
    let url = urlCompleta.split('?');
    let objetoFinal = [];
    let tmp = "";

    if (url[1]) {
      tmp = url[1].split('#');

      objetoFinal = url[1].split('#')[0].split('&').reduce((obj, par) => {
        const [campo, valor] = par.split('=');
        obj[campo] = valor;
        return obj;
      }, {});
    }

    tmp = url[0].split('#');
    if(tmp[1]){
        url[0] = tmp[0];
    }

    this.router.navigate([url[0]], {
      queryParams: objetoFinal,
      fragment: anchor
    });
    */
  }


  abrirPdf(pdf_url) {
    // const dialogSpinner = this.dialog.open(SpinnerComponent, {

    // });

    this.mediaService.isExternalPdf(pdf_url, (response) => {
      if (!response.isExternalPdf) {
        const dialogRef = this.dialog.open(LeitorComponent, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '95%',
          width: '95%',
          panelClass: 'full-screen-modal',
          data: {
            url: pdf_url,
            tipoConteudo: 'pdf'
          },
        });

        // dialogRef.close();
      } else {
        //this.navigateToExternalUrl(pdf_url);
      }
    });

  }

  abrirConteudo(url) {
    const containsAny = ['pdf'].some(element => this.getFileExtension(url).includes(element));
    if (containsAny) {
      this.abrirPdf(url);
    } else {
      this.navigateToExternalUrl(url);
    }
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.pop() || '';
  }
}
