import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LeitorComponent } from '../shared/modal/leitor/leitor.component';
import { MatDialog } from '@angular/material/dialog';
import { MediaService } from 'src/app/services/media.service';
import { LoaderService } from './loader.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class NavegacaoService {

  constructor(private router: Router, private dialog: MatDialog, public mediaService: MediaService,
    private loadingService: LoaderService
  ) { }

  navigateTo(route: string) {
    localStorage.setItem('rota', route);
    this.router.navigate([route]);
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
    const dialogSpinner = this.dialog.open(SpinnerComponent, {
      
    });

    this.mediaService.getPdf(pdf_url, (response) => {
      if (response.status) {
        const dialogRef = this.dialog.open(LeitorComponent, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '90%',
          width: '95%',
          panelClass: 'full-screen-modal',
          data: {
            url: response.pdf,
            tipoConteudo: 'pdf'
          },
        });
    
        // dialogRef.afterClosed().subscribe(result => {
        //   if (result && result.status == 0) {
        //     this.navigateToExternalUrl(pdf_url);
        //   }
        // });
      } else {
        dialogSpinner.close();
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
