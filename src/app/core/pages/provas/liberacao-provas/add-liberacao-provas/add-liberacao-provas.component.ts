import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { LoaderService } from 'src/app/services/loader.service';
import { ResponseService } from 'src/app/services/response.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProvaLiberada } from '../../prova-liberada';
import { MatDialog } from '@angular/material/dialog';
import { ListaUsuariosComponent } from '../../../usuarios/lista-usuarios/lista-usuarios/lista-usuarios.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ProvaService } from '../../prova.service';
import { Prova } from "../../prova";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { TurmaService } from '../../../turmas/turma.service';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Utils from 'src/app/shared/utils';
import { DialogSelectComponent } from 'src/app/shared/dialog-modal/dialog-select/dialog-select.component';
import { MatTableDataSource } from '@angular/material/table';
import { Aluno, Turma } from '../../../turmas/turma';
import { Usuario } from '../../../usuarios/usuario';

@Component({
  selector: 'app-add-liberacao-provas',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule, AngularMaterialModule, AsyncPipe, AutocompleteLibModule, MatDatepickerModule, ReactiveFormsModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule
  ],
  templateUrl: './add-liberacao-provas.component.html',
  styleUrl: './add-liberacao-provas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export default class AddLiberacaoProvasComponent implements OnInit {
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


  turmas_liberadas: Turma[] = [];
  alunos_liberados: Aluno[] = [];

  columnsSchema: any = this.COLUMNS_SCHEMA;

  dataSourceTurmas = new MatTableDataSource<Turma>(this.turmas_liberadas);
  dataSourceAlunos = new MatTableDataSource<Aluno>(this.alunos_liberados);

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  liberacaoProvaForm: ProvaLiberada = {
    descricao: '',
    expiracao: this.range,
    turmas: null,
    alunos: null,
    data_prova: null,
    valor: 0,
    tempo_execucao: ''
  };

  formControlProva = new FormControl<string | Prova>('');
  provas: Prova[] = [];
  filteredOptions: Observable<Prova[]>;

  reactiveForm: FormGroup;
  isLoading: false;
  acao: any = "adicao";
  keyword_prova = 'title';
  keyword_turma = 'nome';
  historyHeading = null;
  turmas = [];
  alunos = [];
  id = null;
  view = null;
  titulo_prova = '';
  periodo_liberacao = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    private response: ResponseService,
    private dialog: MatDialog,
    private provaService: ProvaService,
    private turmaService: TurmaService,
    private _fb: FormBuilder,
  ) {
    Utils.hideSidebar();

    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? 0;

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.view = (params['view']) ? true : false;
      }
    )
  }

  displayFn(prova: Prova): string {
    return prova && prova.titulo ? prova.titulo : '';
  }

  private _filter(name: string): Prova[] {
    const filterValue = name.toLowerCase();

    return this.provas.filter(option => option.titulo.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {

    if (this.id) {
      this.carregaLiberacao(this.id);
    }

    this.provaService.getAll().subscribe({
      next: (response) => {
        if (!response || !response.dados) return;
        this.provas = response.dados;

        this.filteredOptions = this.formControlProva.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.titulo;
            return name ? this._filter(name as string) : this.provas.slice();
          }),
        );
      },
      complete: () => {

      },
      error: error => {
      }
    });


    this.reactiveForm = this._fb.group({
      autocompleteTurma: [{ value: '', disabled: false }]
    });
  }

  tentativa = 0;
  carregaLiberacao(id) {
    this.loadingService.setLoading(true);
    this.provaService.getProvaLiberacao(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.liberacaoProvaForm.descricao = response.dados.descricao;
          this.liberacaoProvaForm.data_prova = response.dados.data_prova;

          this.liberacaoProvaForm.turmas = response.dados.turmas;
          this.liberacaoProvaForm.alunos = response.dados.alunos;
          this.liberacaoProvaForm.tempo_execucao = response.dados.tempo_execucao;
          this.liberacaoProvaForm.valor = response.dados.valor;
          this.titulo_prova = response.dados.prova;

          let date = new Date(response.dados.range.start);
          const formattedDateStart = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

          date = new Date(response.dados.range.end);
          const formattedDateEnd = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

          this.periodo_liberacao = formattedDateStart + ' - ' + formattedDateEnd;

          this.range = new FormGroup({
            start: new FormControl<Date | null>(new Date(response.dados.range.start)),
            end: new FormControl<Date | null>(new Date(response.dados.range.end)),
          })

          this.liberacaoProvaForm.expiracao = this.range;

          response.dados.turmas.forEach((turma, index) => {
            this.temp = turma;
            this.addItemTurma();
          });

          response.dados.alunos.forEach((aluno, index) => {
            this.temp = aluno;
            this.addItemAluno();
          });

          this.loadingService.setLoading(false);
        }
      },
      (error) => {
        this.loadingService.setLoading(false);
        this.response.treatResponseError(error);
      });
  }


  abrirListagemUsuario() {
    const dialogRef = this.dialog.open(ListaUsuariosComponent, {
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

      }
      //Utils.showHideSidebar();
    });
  }

  getValueCell(valor) {
    return Utils.padLeft(valor, "0", 6);
  }

  salvar() {
    this.liberacaoProvaForm.expiracao = this.range.value;
    this.liberacaoProvaForm.turmas = this.turmas_liberadas;
    this.liberacaoProvaForm.alunos = this.alunos_liberados;

    if (this.id) {
      this.provaService.alterarLiberacao(this.id, this.liberacaoProvaForm).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/liberacao-prova']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    } else {
      this.provaService.liberaProva(this.liberacaoProvaForm).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/liberacao-prova']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    }
  }

  adicionarTurma() {
    let selecionados = [];
    this.turmas_liberadas.forEach((element, i) => {
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
        titulo: 'Turmas',
        dataModalSelect: {
          rota: 'turmas',
          selecionados: selecionados,
          selectedItem: (item) => this.selectedTurma(item),
          campos: [{
            header: 'Código',
            field: 'id',
            width: 100,
          },
          {
            header: 'Turma',
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

  adicionarAluno() {
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

  selectedTurma(item) {
    this.temp = item;
    const element = document.getElementById("btnFilterTurma").click();
  }

  addItemTurma() {
    let item = this.temp;
    this.temp = null;

    let FILTERED_ELEMENT_DATA = [];
    const newRow: Turma = {
      id: item.id,
      nome: item.nome,
      alunos: item.alunos
    };

    this.turmas_liberadas.push(newRow);

    this.turmas_liberadas.forEach((element, i) => {
      FILTERED_ELEMENT_DATA.push(element);
    });

    this.dataSourceTurmas = new MatTableDataSource(FILTERED_ELEMENT_DATA);
    this.turmas_liberadas = FILTERED_ELEMENT_DATA;
  }

  removeRowTurma(id: number) {
    let FILTERED_ELEMENT_DATA = [];

    this.turmas_liberadas = this.turmas_liberadas.filter((u) => Number(u.id) !== id);
    this.turmas_liberadas.forEach((element, i) => {
      FILTERED_ELEMENT_DATA.push(element);
    });

    this.dataSourceTurmas = new MatTableDataSource(FILTERED_ELEMENT_DATA);

    //const element = document.getElementById("btnFilter").click();
  }

  voltar() {
    this.router.navigate(['/admin/liberacao-prova']);
  }
}
