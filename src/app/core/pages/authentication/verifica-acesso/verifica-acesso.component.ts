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

    this.usuario = JSON.parse(atob(localStorage.getItem('usuario')));

    if (this.tokenService.isLoggedIn()) {
      window.location.href = "http://romildaalves.com.br";
      // if(this.usuario.papel == 'Aluno'){
      //   this.router.navigate(["/areaAluno"]);
      // } else {
      //   this.router.navigate(["/menu"]);
      // }
    } else {
      router.navigate(['/auth/login']);
    }
  }
}
