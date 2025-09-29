import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TurmaService } from '../turma.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { ModalData } from 'src/app/interfaces/modalData';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader.service';
import { ResponseService } from 'src/app/services/response.service';
import { provideNgxMask } from 'ngx-mask';
import { Aluno, Turma } from '../turma';
import Utils from 'src/app/shared/utils';
import { DialogSelectComponent } from 'src/app/shared/dialog-modal/dialog-select/dialog-select.component';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AsyncPipe } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-turmas',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule, AngularMaterialModule, AsyncPipe, 
    AutocompleteLibModule, MatDatepickerModule, ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  providers: [provideNgxMask()],
  templateUrl: './add-turmas.component.html',
  styleUrl: './add-turmas.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AddTurmasComponent implements OnInit {
  public acao: any = "adicao";
  public titulo = "Nova Turma";
  public view:boolean = false;
  public id: any = 0;

  COLUMNS_SCHEMA = [{
    key: 'id',
    type: 'text',
    label: 'Full Name',
  },
  {
    key: 'name',
    type: 'text',
    label: 'Full Name',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  }];

  displayedColumns = ['id', 'nome', 'actions'];
  alunos_liberados: Aluno[] = [];

  columnsSchema: any = this.COLUMNS_SCHEMA;

  dataSourceAlunos = new MatTableDataSource<Aluno>(this.alunos_liberados);

  turmaForm: Turma = {
    nome: '',
    alunos: []
  };

  constructor(
    private turmaService: TurmaService,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private loadingService: LoaderService,
    private response: ResponseService
  ) {
    Utils.hideSidebar();
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? 0;

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.view = (params['view']) ? true : false;
      }
    )
  }

  ngOnInit(): void {
    Utils.hideSidebar();
    if (this.id) {
      this.carregaDadosTurma();
    }
  }

  getValueCell(valor) {
    return Utils.padLeft(valor, "0", 6);
  }

  carregaDadosTurma() {
    this.loadingService.setLoading(true);
    this.turmaService.getTurma(this.id).subscribe(
      (response: any) => {
        this.response.treatResponseWithoutMessage(response, response.mensagem, (response, result) => {
          this.turmaForm.nome = response.dados.nome;

          response.dados.alunos.forEach((aluno) => {
            this.temp = aluno;
            this.addItemAluno();
          });
        });
        this.loadingService.setLoading(false);
      });
  }

  salvar() {
    this.turmaForm.alunos = this.alunos_liberados;
    if(this.id){
      console.log(this.turmaForm);
      this.turmaService.update(this.id, this.turmaForm).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/turmas']);
        },
        (error) => {
          this.response.treatResponseError(error);
        });
    } else {
    this.turmaService.create(this.turmaForm).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
        this.loadingService.setLoading(false);
        this.router.navigate(['/admin/turmas']);
      },
      (error) => {
        this.response.treatResponseError(error);
      });
    }
  }

  
  adicionarAluno() {
    Utils.hideSidebar();
    
    let selecionados = [];
    this.alunos_liberados.forEach((element, i) => {
      selecionados.push(element.id);
    });

    const dialogRef = this.dialog.open(DialogSelectComponent, {
      //disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '80%',
      width: '80%',
      panelClass: 'full-screen-modal',
      data: {
        titulo: 'Alunos',
        dataModalSelect: {
          rota: 'alunos',
          selecionados: selecionados,
          selectedItem: (item) => this.selectedAluno(item),
          campos: [{
            header: 'Código',
            field: 'id',
            width: 100,
          },
          {
            header: 'Aluno',
            field: 'nome',
          }]
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
      //Utils.showHideSidebar();
    });
  }

  public temp: any = null;

  selectedAluno(item) {
    this.temp = item;
    const element = document.getElementById("btnFilterAluno").click();
  }

  addItemAluno() {
    let item = this.temp;
    this.temp = null;

    let FILTERED_ELEMENT_DATA = [];
    const newRow: Aluno = {
      id: item.id,
      nome: item.nome
    };

    this.alunos_liberados.push(newRow);

    this.alunos_liberados.forEach((element, i) => {
      FILTERED_ELEMENT_DATA.push(element);
    });

    this.dataSourceAlunos = new MatTableDataSource(FILTERED_ELEMENT_DATA);
    this.alunos_liberados = FILTERED_ELEMENT_DATA;
  }

  removeRowAluno(id: number) {
    let FILTERED_ELEMENT_DATA = [];

    this.alunos_liberados = this.alunos_liberados.filter((u) => Number(u.id) !== id);
    this.alunos_liberados.forEach((element, i) => {
      FILTERED_ELEMENT_DATA.push(element);
    });

    this.dataSourceAlunos = new MatTableDataSource(FILTERED_ELEMENT_DATA);
  }

  voltar() {
    this.router.navigate(['admin/turmas']);
  }
}
