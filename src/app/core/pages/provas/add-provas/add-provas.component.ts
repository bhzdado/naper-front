import { AfterViewInit, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { Prova } from '../prova';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CategoriaService } from '../../categorias/categoria.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import Utils from 'src/app/shared/utils';
import { ProvaService } from '../prova.service';
import { ResponseService } from 'src/app/services/response.service';
import { HttpParams } from '@angular/common/http';
import { Categoria } from '../../categorias/categoria';
import { MatTableDataSource } from '@angular/material/table';
import { DialogSelectComponent } from 'src/app/shared/dialog-modal/dialog-select/dialog-select.component';

@Component({
  selector: 'app-add-provas',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-provas.component.html',
  styleUrl: './add-provas.component.scss'
})
export default class AddProvasComponent implements OnInit, AfterViewInit {
  public id: any = null;
  public verificaCarregamento: any;
  view = null;

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
    key: 'qtd_questoes',
    type: 'text',
    label: 'Full Name',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  }];

  displayedColumns = ['id', 'nome', 'qtd_questoes', 'actions'];

  public provaForm: Prova = {
    titulo: '',
    ativo: 1,
    total_questoes: 0,
    tipo_prova: null,
    categorias: [],
    quantidade_questoes: []
  };

  public categorias = [];

  categorias_liberadas: Categoria[] = [];
  columnsSchema: any = this.COLUMNS_SCHEMA;
  dataSourceCategorias = new MatTableDataSource<Categoria>(this.categorias_liberadas);

  constructor(private loadingService: LoaderService, private router: Router, private categoriaService: CategoriaService, private dialog: MatDialog,
    private provaService: ProvaService, private response: ResponseService, private activatedRoute: ActivatedRoute, private renderer: Renderer2
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? 0;
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.view = (params['view']) ? true : false;
      }
    );

    this.carregarCategorias();
    
  }

  ngOnInit(): void {
    Utils.hideSidebar();
  }

  ngAfterViewInit() {
    if (this.id) {
      this.carregaProva(this.id);
      this.verificaCarregamento = setInterval(() => {
        if (this.provaForm.titulo != '') {
          clearInterval(this.verificaCarregamento);
        } else {
          //this.carregaProva(this.id);
        }
      }, 2000);
    }
  }

  carregaProva(id) {
    this.provaService.getProva(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.id = response.dados.id;
          this.provaForm.titulo = response.dados.titulo;
          this.provaForm.tipo_prova = response.dados.tipo_prova;
          this.provaForm.ativo = response.dados.ativo;
          this.provaForm.total_questoes = response.dados.total_questoes;

          response.dados.categorias.forEach((element, index) => {
            //this.provaForm.quantidade_questoes[index] = element.quantidade_questoes;

            this.temp = element;
            this.addItemCategoria();
          });

          this.carregarCategorias();
        }
      },
      (error) => {
        this.response.treatResponseError(error);
      });
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  carregarCategorias() {
    this.loadingService.setLoading(true);

    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;

          let categorias = [];
          response.dados.forEach((currentValue, index) => {

            if (typeof currentValue.subcategorias === "object") {
              currentValue.subcategorias.forEach(element => {
                let id = Utils.padLeft(element.id, "0", 6);
                categorias.push({
                  'id': id,
                  'nome': element.nome,
                  'parent': currentValue.nome
                });
              });
            } else {
              let id = Utils.padLeft(currentValue.id, "0", 6);
              categorias.push({
                'id': id,
                'nome': currentValue.nome
              });
            }
          });

          this.categorias = categorias;
          this.loadingService.setLoading(false);
        },
        complete: () => {
        },
        error: error => {
          if (error.message) {
            const dialogRef = this.dialog.open(DialogModalComponent, {
              width: '400px',
              data: {
                titulo: '',
                conteudo: error.message,
                tipo: "erro"
              },
            });
          } else {
            const erros: Array<string> = [];
            Object.values(error.errors).forEach((value: any) => value.forEach((_: any) => erros.push(_)))

            const dialogRef = this.dialog.open(DialogModalComponent, {
              width: '400px',
              data: {
                titulo: '',
                conteudo: erros.toString().replace(new RegExp(',', 'g'), '\n'),
                tipo: "erro"
              },
            });
          }
          this.loadingService.setLoading(false);
        }
      });
  }

  isTabQuestaoActive() {
    return (this.provaForm.tipo_prova !== null && this.provaForm.tipo_prova != "DINAMICA") ? true : false;
  }

  isTabCategoriaActive() {
    return (this.provaForm.tipo_prova !== null && this.provaForm.tipo_prova != "") ? true : false;
  }

  somaTotalQuestoes() {
    let soma: number = 0;
    let itens = this.categorias_liberadas;
    itens.forEach(element => {
      soma += Number(element.quantidade_questoes);
    });

    this.provaForm.total_questoes = soma;
  }

  salvar() {
    this.loadingService.setLoading(true);

    this.provaForm.categorias = this.categorias_liberadas;

    if (this.id) {
      this.provaService.update(this.id, this.provaForm).subscribe(
        (response: any) => {
          Utils.hideSidebar();
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/provas']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    } else {
      this.provaService.create(this.provaForm).subscribe(
        (response: any) => {
          Utils.hideSidebar();
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          
          this.router.navigate(['/admin/provas']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    }
  }

  temp: any = '';
  selectedCategoria(item) {
    this.temp = item;
    const element = document.getElementById("btnFilterCategoria").click();
  }

  addItemCategoria() {
    let item = this.temp;
    this.temp = null;

    let FILTERED_ELEMENT_DATA = [];
    const newRow: Categoria = {
      id: item.id,
      nome: item.nome,
      quantidade_questoes: item.quantidade_questoes
    };

    this.categorias_liberadas.push(newRow);

    this.categorias_liberadas.forEach((element, i) => {
      FILTERED_ELEMENT_DATA.push(element);
    });

    this.dataSourceCategorias = new MatTableDataSource(FILTERED_ELEMENT_DATA);
    this.categorias_liberadas = FILTERED_ELEMENT_DATA;
  }

  removeRowCategoria(id: number) {
    let FILTERED_ELEMENT_DATA = [];

    this.categorias_liberadas = this.categorias_liberadas.filter((u) => Number(u.id) !== id);
    this.categorias_liberadas.forEach((element, i) => {
      FILTERED_ELEMENT_DATA.push(element);
    });

    this.dataSourceCategorias = new MatTableDataSource(FILTERED_ELEMENT_DATA);

    //const element = document.getElementById("btnFilter").click();
  }

  adicionarCategoria() {
    Utils.hideSidebar();
    
    let selecionados = [];
    this.categorias_liberadas.forEach((element, i) => {
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
        titulo: 'Categorias',
        dataModalSelect: {
          rota: 'categorias',
          selecionados: selecionados,
          selectedItem: (item) => this.selectedCategoria(item),
          campos: [{
            header: 'Código',
            field: 'id',
            width: 100,
          },
          {
            header: 'Categoria',
            field: 'nome',
          }]
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  getValueCell(valor) {
    return Utils.padLeft(valor, "0", 6);
  }

  voltar() {
    this.router.navigate(['admin/provas']);
  }
}
