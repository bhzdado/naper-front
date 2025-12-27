// Angular import
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CountdownComponent } from 'ngx-countdown';
import { interval } from 'rxjs';
import { UsuarioService } from 'src/app/core/pages/usuarios/usuario.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';

@Component({
  selector: 'app-nav-right',
  standalone: false,
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
})
export class NavRightComponent {
  public cumprimento: string = 'Bom dia'
  public usuario: any = [];
  public timeData = 1800;
  dataUltimaTarefa = null;

  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  constructor(private authService: AuthService, private usuarioService: UsuarioService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.usuario = JSON.parse(atob(localStorage.getItem('usuario')));

    this.atualizaDadosUsuario()

    interval(1000)
      .subscribe({
        next: (value) => {
          this.cumprimento = this.setCumprimento(new Date().getHours());
        }
      })

  }

  public reiniciarContador() {
    //if (this.countdown) {
    //this.countdown.restart();
    //}
  }

  public handleEvent(event) {
    if (event.action == 'done') {
      console.log(this.authService.reiniciarToken, "REiniciar? ");
      if (this.authService.reiniciarToken) {
        this.authService.refreshToken();
      }
      this.countdown.restart();
    }
  }

  private setCumprimento(hora: number): string {
    if (hora >= 0 && hora < 12) return 'Bom dia'
    if (hora >= 12 && hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  private atualizaDadosUsuario() {
    this.usuarioService.getUsuario(this.usuario.id).subscribe(
      (response: any) => {
        if (response.sucesso == 1) {
          localStorage.setItem('usuario', btoa(JSON.stringify(response.user)));
        }
      },
      (error) => {
        if (error.status == 401) {
          const dialogRef = this.dialog.open(DialogModalComponent, {
            width: '400px',
            data: {
              titulo: '',
              conteudo: "Você não esta autenticado.",
              tipo: "erro"
            },
          });

          dialogRef.afterClosed().subscribe(result => {

          });
        }
      });
  }
}
