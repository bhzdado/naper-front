import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiColumn, GuiPaging } from '@generic-ui/ngx-grid';
import { Actions } from 'src/app/interfaces/actions';
import { LoaderService } from 'src/app/services/loader.service';
import { GridLocalization } from 'src/app/shared/grid/grid-localization';
import Utils from 'src/app/shared/utils';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProvaService } from '../prova.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';

@Component({
  selector: 'app-all-provas',
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule, MatIconModule, MatListModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './all-provas.component.html',
  styleUrl: './all-provas.component.scss'
})
export default class AllProvasComponent implements OnInit {
  public usuarioLogado: any;
  public provas: any;
  public id: any;

  columns: Array<GuiColumn> = [
    {
      header: 'Código',
      field: 'id',
      width: 100,
    },
    {
      header: 'Título',
      field: 'titulo',
    },
    {
      header: 'Número de Questões',
      field: 'total_questoes',
    },
    {
      header: 'Tipo de prova',
      field: 'tipo_prova',
    },
    {
      header: 'Ativo',
      field: 'ativo',
    },
  ];

  actions: Array<Actions> = [
    {
      name: "view",
      label: "Visualizar",
      icon: "manage_search",
      click: (item: any): void => {
        const current = new Date();
        this.router.navigate(['admin/provas/register/' + item.id], { queryParams: { view: current.getTime() }});
      },
    },
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        Utils.hideSidebar();
        this.router.navigate(['admin/provas/register/' + item.id]);
      },
    },
    {
      name: "remove",
      label: "Remover",
      icon: "delete",
      click: (item: any): void => {
        this.provaService.excluir(item.id, (response) => {
          this.loadingService.setLoading(false);
          this.getProvas();
        });
      },
    },
  ];
  source: Array<any> = null;
  loading: boolean = false;
  paging: GuiPaging;

  constructor(private loadingService: LoaderService, private router: Router, private guiLocalization: GridLocalization,
    private provaService: ProvaService, private activatedRoute: ActivatedRoute
  ) {
    Utils.showSidebar();
  }

  ngOnInit(): void {
    this.getProvas();
  }

  getProvas() {
    this.provaService.getAll().subscribe({
      next: (response) => {
        if (!response || !response.dados) return;

        this.provas = response.dados;
      },
      complete: () => {

      },
      error: error => {
      }
    });
  }

  getValueCell(index, item, field) {
    switch (field) {
      case 'id':
        return Utils.padLeft(item.id, "0", 6);
      case 'tipo_prova':
        return (item.tipo_prova == 'DINAMICA') ? 'Dinâmica' : 'Fixa';
        case 'ativo':
        return (item.ativo == '1') ? 'Ativo' : 'Inativo';
    }

    return null;
  }

  addProva() {
    Utils.hideSidebar();
    this.router.navigate(['/admin/provas/register']);
  }

  refresh_grid() {
    this.getProvas();
  }
}
