import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LeitorComponent } from '../shared/modal/leitor/leitor.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaService } from 'src/app/services/media.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { AutenticarComponent } from '../shared/modal/autenticar/autenticar.component';

@Injectable({
  providedIn: 'root'
})
export class NavegacaoService {
  tokenService: TokenService = inject(TokenService);

  constructor(private router: Router, private dialog: MatDialog, public mediaService: MediaService,
  ) { }

  navigateTo(route: string) {
    if (this.tokenService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AutenticarComponent, {
        width: '350px',
      });
      dialogRef.afterClosed().toPromise()
        .then(result => {
          if (result) {
            //router.navigate(['/auth/login']);
            //router.navigate(['/site']); 
          }
          return Promise.resolve(result);
        });
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

  abrirPdf(pdf_url) {
    // const dialogSpinner = this.dialog.open(SpinnerComponent, {

    // });

    this.mediaService.isExternalPdf(pdf_url, (response) => {
      if (response.isExternalPdf) {
        const dialogRef = this.dialog.open(LeitorComponent, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '90%',
          width: '95%',
          panelClass: 'full-screen-modal',
          data: {
            url: pdf_url,
            tipo_conteudo: 'pdf'
          },
        });

        // dialogRef.close();
      } else {
        this.navigateToExternalUrl(pdf_url);
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
