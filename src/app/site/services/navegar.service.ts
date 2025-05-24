import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavegarService {

  constructor(private router: Router) { }

  abrirConteudo(target, id){
    this.router.navigate(['/site/conteudo/' + target + "/" + id]);
  }

  abrirDetalhe(id){
    this.router.navigate(["/site/conteudo-detalhe/" + id]);
  }
}
