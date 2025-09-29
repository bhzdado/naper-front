import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, NgModule, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Usuario } from '../usuario';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EMPTY, catchError, of } from 'rxjs';
import { NgxViacepModule } from "@brunoc/ngx-viacep";
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import {
  NgxViacepService, Endereco,
  CEPError,
  CEPErrorCode,
} from "@brunoc/ngx-viacep";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PapelService } from '../../papeis/papel.service';
import { ModalData } from 'src/app/interfaces/modalData';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from 'src/app/services/loader.service';
import { MatSelectModule } from '@angular/material/select';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ResponseService } from 'src/app/services/response.service';
import Utils from 'src/app/shared/utils';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-add-usuarios',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule,
    NgxMaskDirective, NgxMaskPipe, AngularMaterialModule],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-usuarios.component.html',
  styleUrls: ['./add-usuarios.component.scss']
})
export default class AddUsuariosComponent implements OnInit {
  public usuario_id = null;
  public titulo = "Novo Usuário";
  public acao: any = "adicao";
  public disabled: boolean = false;
  public papel_disabled: boolean = false;
  public papeis: any = [];
  public usuario: Usuario;
  public usuarioLogado: any;

  usuarioForm: Usuario = {
    nome: '',
    papel: '',
    email: '',
    status: 1,
    logradouro: '',
    numero: 0,
    complemento: '',
    bairro: '',
    cep: '',
    telefone: '',
    celular: '',
    cidade: '',
    uf: '',
    avatar_path: '',
  };

  public customPatterns = { '0': { pattern: new RegExp('\[0-9\]') } };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private viacep: NgxViacepService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private papelService: PapelService,
    private loadingService: LoaderService,
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private response: ResponseService,
    private authService: AuthService
  ) {
    this.titulo = data.titulo;
    this.acao = data.acao ?? "adicao";
    this.usuario_id = data?.item?.id ?? 0;
    this.usuarioLogado = authService.getUser();
  }

  ngOnInit(): void {
    Utils.hideSidebar();
    if (this.acao == 'visualizar') {
      this.disabled = true;
    }

    this.carregaDadosUsuario();

    this.papelService.getAll()
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;
          this.papeis = response.dados;

          this.papeis = this.papeis.filter( value => value.role != this.usuarioLogado.papel);
        },
      });
  }

  consultaCEP(cep: string) {
    cep = cep.replace(/\D/g, '');

    this.viacep
      .buscarPorCep(cep)
      .pipe(
        catchError((error: CEPError) => {
          const dialogRef = this.dialog.open(DialogModalComponent, {
            width: '400px',
            data: {
              titulo: 'ERRO',
              conteudo: error.message,
              tipo: "erro"
            },
          });

          return EMPTY;
        })
      )
      .subscribe((endereco: Endereco) => {
        // Endereço retornado :)
        this.usuarioForm.cidade = endereco.localidade;
        this.usuarioForm.uf = endereco.uf;
        this.usuarioForm.logradouro = endereco.logradouro;
        this.usuarioForm.bairro = endereco.bairro
      });
  }

  populandoEndereco(dados: any) {

  }

  carregaDadosUsuario() {
    if (this.usuario_id) {
      this.loadingService.setLoading(true);
      this.usuarioService.getUsuario(this.usuario_id).subscribe(
        (response: any) => {
          if (response.errors) {
            const dialogRef = this.dialog.open(DialogModalComponent, {
              width: '400px',
              data: {
                titulo: 'ERRO',
                conteudo: response.message,
                tipo: "erro"
              },
            });
          } else {
            this.usuario = response.dados;

            if (this.usuario_id) {
              this.usuarioForm.nome = response.dados.nome;
              this.usuarioForm.papel = response.dados.papel;
              this.usuarioForm.avatar_path = response.dados.avatar_path;
              this.usuarioForm.celular = response.dados.celular;
              this.usuarioForm.email = response.dados.email;
              this.usuarioForm.telefone = response.dados.telefone;
              this.usuarioForm.cep = response.dados?.endereco?.cep;
              this.usuarioForm.logradouro = response.dados.endereco?.endereco;
              this.usuarioForm.numero = response.dados.endereco?.numero;
              this.usuarioForm.complemento = response.dados.endereco?.complemento;
              this.usuarioForm.bairro = response.dados.endereco?.bairro;
              this.usuarioForm.cidade = response.dados.endereco?.cidade.name;
              this.usuarioForm.uf = response.dados.endereco?.cidade.estado.name;

              if (this.usuario.papel == 'Administrador' || this.usuario_id == this.usuario.id) {
                this.papel_disabled = true;
              }
            }
          }
          this.loadingService.setLoading(false);
        });
    }
  }

  create() {
    this.loadingService.setLoading(true);
    this.usuarioService.create(this.usuarioForm).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
        //this.router.navigate(['/usuarios']);
        this.dialogRef.close(true);
      },
      (error) => {
        this.response.treatResponseError(error);
      });
  }

  editar() {
    this.loadingService.setLoading(true);

    this.usuarioService.update(this.usuario_id, this.usuarioForm).subscribe(
      (response: any) => {
        this.onNoClick();
        this.response.treatResponse(response, response.mensagem);
        this.loadingService.setLoading(false);
        this.dialogRef.close(true);
      },
      (error) => {
        this.response.treatResponseError(error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  voltar() {
    this.router.navigate(['/usuarios']);
  }
}
