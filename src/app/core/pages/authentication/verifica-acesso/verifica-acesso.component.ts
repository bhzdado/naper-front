import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/auth/token.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-verifica-acesso',
  standalone: true,
  imports: [],
  templateUrl: './verifica-acesso.component.html',
  styleUrl: './verifica-acesso.component.scss'
})
export class VerificaAcessoComponent {
  public usuario;
  tokenService: TokenService = inject(TokenService);

  constructor(private loadingService: LoaderService, private router: Router) {
    this.loadingService.setLoading(true);

    if (this.tokenService.isLoggedIn()) {
      if (localStorage.getItem('usuario')) {
        this.usuario = JSON.parse(atob(localStorage.getItem('usuario')));
      }
  
      this.router.navigate(["/admin/menus/configurar"]);
      //window.location.href = "http://romildaalves.com.br";
      // if(this.usuario.papel == 'Aluno'){
      //   this.router.navigate(["/areaAluno"]);
      // } else {
      //   this.router.navigate(["/menu"]);
      // }
    } else {
      //this.router.navigate(["/admin/menus"]);
      router.navigate(['/auth/login']);
    }
  }
}
