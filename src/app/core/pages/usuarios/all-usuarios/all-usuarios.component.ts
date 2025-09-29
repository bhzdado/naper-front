import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { GuiColumn, GuiPaging } from '@generic-ui/ngx-grid';
import { Actions } from 'src/app/interfaces/actions';
import AddUsuariosComponent from '../add-usuarios/add-usuarios.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import Utils from 'src/app/shared/utils';
import { NavLogoComponent } from 'src/app/theme/layout/admin/nav-bar/nav-logo/nav-logo.component';
import { ResponseService } from 'src/app/services/response.service';

@Component({
  selector: 'app-all-usuarios',
  templateUrl: './all-usuarios.component.html',
  styleUrls: ['./all-usuarios.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule, MatIconModule, MatListModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export default class AllUsuariosComponent implements OnInit {
  public usuarios: Array<Usuario> = []
  public totalUsuarios: number = 0;

  public campo = 'papel.nome';

  columns: Array<GuiColumn> = [
    {
      header: 'Matrícula',
      field: 'id',
      width: 100,
    },
    {
      header: 'Nome',
      field: 'nome',
    },
    {
      header: 'E-mail',
      field: 'email',
    },
    {
      name: "papel.nome",
      header: 'Papel',
      field: 'papel'
    },
    {
      header: 'Status',
      field: 'status',
    },
    {
      header: 'Telefone',
      field: 'telefone',
    },
  ];

  //columnMatcher = (item: any) => item.nome;

  getValueCell(index, item, field) {
    switch (field) {
      case 'papel':
        return this.source[index].papel.nome;
      case 'id':
        return Utils.padLeft(item.id, "0", 6);
    }

    return null;
  }

  actions: Array<Actions> = [
    {
      name: "view",
      label: "Visualizar",
      icon: "manage_search",
      click: (item: any): void => {
        Utils.showHideSidebar();
        const dialogRef = this.dialog.open(AddUsuariosComponent, {
          width: '70%',
          height: '80%',
          data: {
            titulo: 'Usuário',
            acao: 'visualizar',
            item: item
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          Utils.showHideSidebar();
        });
      },
    },
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        this.abreTelaEdicao(item);
      },
      disabled: (item: any): boolean => {
        if ((this.authService.getUserAcl().role == 'Professor' && item.id == this.authService.getUser().id) || (item.papel == 'Aluno')
          || (this.authService.getUserAcl().role == 'Administrador')) {
          return false;
        }
        return true;
      }
    },
    {
      name: "inativar",
      label: "Inativar",
      icon: "person_remove",
      click: (item: any): void => {
        this.inativarUsuario(item.id, item.nome);
      },
      disabled: (item: any): boolean => {
        if ((this.authService.getUserAcl().role == 'Professor' && item.id == this.authService.getUser().id) || (item.papel == 'Aluno')) {
          return false;
        }
        return true;
      },
      hidden: (item: any): boolean => {
        if (item.status != 'Ativo' || item.id == this.usuario.id) {
          return true;
        }

        return false;
      },
    },
    {
      name: "ativar",
      label: "Ativar",
      icon: "how_to_reg",
      click: (item: any): void => {
        this.ativarUsuario(item.id, item.nome);
      },
      disabled: (item: any): boolean => {
        if ((this.authService.getUserAcl().role == 'Professor' && item.id == this.authService.getUser().id) || (item.papel == 'Aluno')) {
          return false;
        }
        return true;
      },
      hidden: (item: any): boolean => {
        if (item.status == 'Ativo' || item.id == this.usuario.id) {
          return true;
        }

        return false;
      },
    }
  ];

  source: Array<any> = null;
  loading: boolean = false;
  paging: GuiPaging;
  usuario: any;

  constructor(private usuarioService: UsuarioService, private loadingService: LoaderService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private response: ResponseService, private route: ActivatedRoute
  ) {
    this.usuario = authService.getUser();
  }

  ngOnInit(): void {
    this.get();

    this.route.queryParams.subscribe(params => {
      let id_perfil = params['u'] || null;
      if (id_perfil) {
        this.abreTelaEdicao({
          id: id_perfil
        });
      }
    });
  }

  abreTelaEdicao(item) {
    Utils.showHideSidebar();
    const dialogRef = this.dialog.open(AddUsuariosComponent, {
      width: '70%',
      height: '80%',
      data: {
        titulo: 'Edição de Usuário',
        acao: 'edicao',
        item: item
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.get();
      }
      Utils.showHideSidebar();
    });
  }

  addUsuario() {
    Utils.showHideSidebar();
    const dialogRef = this.dialog.open(AddUsuariosComponent, {
      maxWidth: '100vw',
      width: '80%',
      maxHeight: '80vh',
      height: '80%',
      data: {
        titulo: 'Novo Usuário',
        acao: 'adicao',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.get();
      }
      Utils.showHideSidebar();
    });
  }

  visualizarUsuario(id: number) {
    this.router.navigate(['/show-usuario/' + id]);
  }

  inativarUsuario(id: number, nome: string) {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '400px',
      data: {
        titulo: 'INATIVAÇÃO DE USUÁRIO',
        conteudo: "Você tem certeza que deseja inativar o(a) usuário(a) '" + nome + "'?",
        tipo: "confirmacao",
        confirmText: 'Sim'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.setLoading(true);
        this.usuarioService.inativarUsuario(id).subscribe(
          (response: any) => {
            this.response.treatResponse(response, response.mensagem, (response, result) => {
              this.get();
            });
          },
          (error) => {
            this.response.treatResponseError(error);
          });
      }
    });

    //this.router.navigate(['/inactivate-usuario/' + id]);
  }

  ativarUsuario(id: number, nome: string) {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '400px',
      data: {
        titulo: 'ATIVAÇÃO DE USUÁRIO',
        conteudo: "Você tem certeza que deseja ativar o(a) usuário(a) '" + nome + "'?",
        tipo: "confirmacao",
        confirmText: 'Sim'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.ativarUsuario(id).subscribe(
          (response: any) => {
            this.response.treatResponse(response, response.mensagem, (response, result) => {
              this.get();
            });
          },
          (error) => {
            this.response.treatResponseError(error);
          });
      }
    });
  }

  get(data?: any) {
    this.loading = true;
    if (!data) {
      data = {
        i: 0,
        s: 20,
        l: 3
      }
    }
    this.usuarioService.getAll(data)
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;
          this.usuarios = response.dados as Usuario[]
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  padLeft(text: number, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  refresh_grid() {
    this.get();    
  }
}
