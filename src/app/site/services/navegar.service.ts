import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavegarService {

  constructor(private router: Router) {}

  navigateTo(route: string) {
    localStorage.setItem('rota', route);
    this.router.navigate([route]);
  }

  navigateToWithParams(route: string, params: any) {
    localStorage.setItem('rota', route);
     this.router.navigate([route, params]);
  }

  navigateToUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  // constructor(private router: Router) { }

  // abrirConteudo(target, id){
  //   this.router.navigate(['edit', target, id]);
  //   //this.router.navigate(['site/conteudo/' + target + "/" + id]);
  // }

  // abrirDetalhe(id){
  //   this.router.navigate(["/site/conteudo-detalhe/" + id]);
  // }
}
