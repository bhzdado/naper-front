import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Questao } from '../../questoes/questao';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { QuestaoService } from '../questao.service';
import { AuthService, User } from 'src/app/services/auth/auth.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { GuiColumn, GuiGridModule, GuiInfoPanel, GuiLocalization, GuiPaging, GuiSearching, GuiSorting } from '@generic-ui/ngx-grid';
import { Actions } from 'src/app/interfaces/actions';
import AddQuestoesComponent from '../add-questoes/add-questoes.component';
import Utils from 'src/app/shared/utils';
import { GridLocalization } from 'src/app/shared/grid/grid-localization';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AdminComponent } from 'src/app/theme/layout/admin/admin.component';
import { NavLogoComponent } from 'src/app/theme/layout/admin/nav-bar/nav-logo/nav-logo.component';
import { BerryConfig } from 'src/app/app-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-questoes',
  templateUrl: './all-questoes.component.html',
  styleUrls: ['./all-questoes.component.scss'],
  standalone: true,
  imports: [AngularMaterialModule, SharedModule, GuiGridModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AllQuestoesComponent implements OnInit {
  public usuarioSource: MatTableDataSource<Questao> = new MatTableDataSource<Questao>([])
  public usuarioLogado: any;
  berryConfig;
  localization: GuiLocalization = {};

  columns: Array<GuiColumn> = [
    {
      header: 'Código',
      field: 'id',
      width: 300,
    },
    {
      header: 'Categoria',
      field: 'categoria',
    },
    {
      header: 'Questão',
      field: 'questao',
    },
  ];

  actions: Array<Actions> = [
    {
      name: "view",
      label: "Visualizar",
      icon: "manage_search",
      click: (item: any): void => {
        Utils.showHideSidebar();
        const current = new Date();
        this.router.navigate(['/admin/questoes/register/' + item.id], { queryParams: { view: current.getTime() }});
      },
      disabled: (item: any): boolean => {
        return false;
      },
      hidden: (item: any): boolean => {
        return false;
      }
    },
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        Utils.showHideSidebar();
        this.router.navigate(['/admin/questoes/register/' + item.id]);
      },
      disabled: (item: any): boolean => {
        if(item.possui_avaliacao_executada){
          return true;
        }
        return false;
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
        this.excluirQuestao(item.id);
      },
      disabled: (item: any): boolean => {
        if(item.possui_avaliacao_executada){
          return true;
        }
        return false;
      },
      hidden: (item: any): boolean => {
        return false;
      }
    },
  ];
  questoes: Array<any> = null;
  loading: boolean = true;
  paging: GuiPaging;
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

  searching: GuiSearching = {
    enabled: true,
    placeholder: 'Procurar...',
    highlighting: false
  };

  constructor(private questaoService: QuestaoService, private loadingService: LoaderService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute, private guiLocalization: GridLocalization
  ) {
    this.berryConfig = BerryConfig;
    this.usuarioLogado = authService.getUser();
    this.localization = this.guiLocalization.getConfig();
  }

  getValueCell(index, item, field) {
    switch (field) {
      case 'id':
        return Utils.padLeft(item.id, "0", 6);
    }

    return null;
  }

  trataContudo(conteudo){
    return conteudo.replace("[[api_url]]", environment.urlApi + "media/");
  }

  convertValue(value) {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.documentElement.textContent;
  }

  ngOnInit(): void {
    this.get();
    Utils.showSidebar();
  }

  addQuestao() {
    Utils.hideSidebar();
    this.router.navigate(['/admin/questoes/register']);
  }

  acao(action: Function, item: any) {
    action(item);
  }

  visualizarQuestao(id: number) {
    this.router.navigate(['/admin/questoes/ver/' + id]);
  }

  editarQuestao(id: number) {
    this.router.navigate(['/admin/questoes/editar/' + id]);
  }

  excluirQuestao(id: number) {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '400px',
      data: {
        titulo: 'EXCLUÇÃO DA QUESTÃO',
        conteudo: "Você tem certeza que deseja EXCLUIR essa questao?",
        tipo: "confirmacao",
        confirmText: 'Sim'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questaoService.excluir(id, (response) => {
          if (result) {
            this.get();
          }
          this.loadingService.setLoading(false);
        });
      }
    });

  }

  get(data?: any) {
    if (!data) {
      data = {
        i: 0,
        s: 20,
        l: 3
      }
    }

    this.questaoService.getAll(data)
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;
          this.questoes = response.dados as Questao[]
          // this.totalQuestoes = this.questoes.length;
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  changePaging(pe: PageEvent) {
    this.get({
      i: pe.pageIndex ?? 0,
      s: pe.pageSize ?? 0,
      l: pe.length ?? 3
    });
  }

  padLeft(text: number, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  refresh_grid() {
    this.get();    
  }
}
