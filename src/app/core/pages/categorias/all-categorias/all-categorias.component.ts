import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { Categoria } from '../categoria';
import { GuiColumn, GuiGridModule, GuiInfoPanel, GuiLocalization, GuiPaging, GuiSearching, GuiSorting } from '@generic-ui/ngx-grid';
import { LoaderService } from 'src/app/services/loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from 'src/app/interfaces/actions';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GridLocalization } from 'src/app/shared/grid/grid-localization';
import { CategoriaService } from '../categoria.service';
import Utils from 'src/app/shared/utils';
import { AddCategoriasComponent } from '../add-categorias/add-categorias.component';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { ChangeCategoriasComponent } from '../change-categorias/change-categorias.component';

@Component({
  selector: 'app-all-categorias',
  standalone: true,
  imports: [AngularMaterialModule, SharedModule, GuiGridModule],
  templateUrl: './all-categorias.component.html',
  styleUrl: './all-categorias.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AllCategoriasComponent implements OnInit {
  localization: GuiLocalization = {};

  constructor(private loadingService: LoaderService, private router: Router, private dialog: MatDialog,
    private guiLocalization: GridLocalization, private categoriaService: CategoriaService,

  ) {
    this.localization = this.guiLocalization.getConfig();
  }

  public categorias: Array<Categoria> = []
  searching: GuiSearching = {
    enabled: true,
    placeholder: 'Procurar...',
    highlighting: false
  };
  public loading: boolean = false;
  public paging: GuiPaging;

  public columns: Array<GuiColumn> = [
    {
      header: 'Código',
      field: 'id',
      width: 140,
    },
    {
      header: 'Categoria/Subcategoria',
      field: 'nome',
    }
  ];

  public actions: Array<Actions> = [
    {
      name: "add-category",
      label: "Adicionar Subcategoria",
      icon: "splitscreen_add",
      hidden: (item: any): boolean => {
        return (item.parent != 0);
      },
      click: (item: any): void => {
        Utils.showHideSidebar();
        const dialogRef = this.dialog.open(AddCategoriasComponent, {
          width: '550px',
          height: '250px',
          data: {
            titulo: 'Criar Subcategoria para ' + item.nome,
            acao: 'addSubCategoria',
            item: item
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.carregarCategorias();
          }
          Utils.showHideSidebar();
        });
      },
    },
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        let data = null;

        Utils.showHideSidebar();

        // if (item.parent) {
        //   data = {
        //     titulo: 'Edição de Subcategoria',
        //     acao: 'edicaoSubCategoria',
        //     item: item
        //   }
        // } else {
          data = {
            titulo: 'Edição de Categoria',
            acao: 'edicaoCategoria',
            item: item
          }
        // }

        const dialogRef = this.dialog.open(AddCategoriasComponent, {
          width: '560px',
          height: '300px',
          data: data,
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.carregarCategorias();
          }
          Utils.showHideSidebar();
        });
      },
      hidden: (item: any): boolean => {
        return false;
      }
    },
    {
      name: "remove",
      label: "Remover",
      icon: "delete",
      click: (item: any): void => {
        let id = Number(item.id);
        let titulo = (item.parent) ? 'EXCLUÇÃO DE SUBCATEGORIA' : 'EXCLUÇÃO DE CATEGORIA';
        let conteudo = (item.parent) ? 'Você tem certeza que deseja EXCLUIR a subcategoria de código' : 'Você tem certeza que deseja EXCLUIR a categoria de código';

        const dialogRef = this.dialog.open(DialogModalComponent, {
          width: '460px',
          data: {
            titulo: titulo,
            conteudo: conteudo + " '" + item.id + "'?",
            tipo: "confirmacao",
            confirmText: 'Sim'
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (item.parent) {
              let dataResponse = this.categoriaService.excluirSubcategoria(item.id, (response) => {
                this.carregarCategorias();
                this.loadingService.setLoading(false);
              });
            } else {
              this.categoriaService.excluirCategoria(item.id, (response) => {
                if (result) {
                  this.carregarCategorias();
                }
                this.loadingService.setLoading(false);
              });
            }
          }
        });

      },
      hidden: (item: any): boolean => {
        return false;
      }
    }
  ];

  infoPanel: GuiInfoPanel = {
    enabled: true,
    infoDialog: false,
    columnsManager: true,
    schemaManager: false
  };

  sorting: GuiSorting = {
    enabled: true,
    multiSorting: true
  };

  ngOnInit() {

    this.carregarCategorias();
  }

  carregarCategorias() {
    this.loading = true;
    this.categoriaService.getAll()
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;

          let categorias: Categoria[] = [];
          response.dados.forEach((currentValue, index) => {
            let row = {
              id: Utils.padLeft(currentValue.id, "0", 6),
              nome: currentValue.nome,
              parent: 0
            };

            categorias.push(row);

            if (typeof currentValue.subcategorias === "object") {
              currentValue.subcategorias.forEach(element => {
                row = {
                  id: Utils.padLeft(element.id, "0", 6),
                  nome: element.nome,
                  parent: currentValue.id
                };

                categorias.push(row);
              });

            }

          });

          this.categorias = categorias;
        },
        complete: () => {
          this.loading = false;
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
        }
      });
  }

  afterEditCell($event) {
    console.log('event: ', $event);

    if ($event.after.nome == $event.before.nome) {
      return null;
    }

    if ($event.after.parent) {
      this.categoriaService.updateSubcategory($event.after.id, { nome: $event.after.nome });
    } else {
      this.categoriaService.updateCategory($event.after.id, { nome: $event.after.nome });
    }

  }

  acao(action: Function, item: any) {
    action(item);
  }

  addCategoria() {
    Utils.showHideSidebar();
    const dialogRef = this.dialog.open(AddCategoriasComponent, {
      width: '550px',
      height: '250px',
      data: {
        titulo: 'Criar Nova Categoria',
        acao: 'adicao'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarCategorias();
      }
      Utils.showHideSidebar();
    });
  }

  moverSubCategoria(subcategoria_id, categoria_id) {
    const dialogRef = this.dialog.open(ChangeCategoriasComponent, {
      width: '650px',
      height: '350px',
      data: {
        titulo: 'Mudar de Categoria',
        acao: 'adicao',
        item: {
          id: subcategoria_id,
          categoria_atual: categoria_id
        }
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.carregarCategorias();
      }
    });
  }

  refresh_grid() {
    this.carregarCategorias();    
  }
}
