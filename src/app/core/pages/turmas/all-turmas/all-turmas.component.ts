import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiColumn, GuiInfoPanel, GuiLocalization, GuiPaging, GuiSearching, GuiSorting } from '@generic-ui/ngx-grid';
import { LoaderService } from 'src/app/services/loader.service';
import { GridLocalization } from 'src/app/shared/grid/grid-localization';
import { Turma } from '../turma';
import { Actions } from 'src/app/interfaces/actions';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import Utils from 'src/app/shared/utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TurmaService } from '../turma.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import AddTurmasComponent from '../add-turmas/add-turmas.component';

@Component({
  selector: 'app-all-turmas',
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule, MatIconModule, MatListModule],
  templateUrl: './all-turmas.component.html',
  styleUrl: './all-turmas.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AllTurmasComponent implements OnInit {
  columns: Array<GuiColumn> = [
    {
      header: 'Código',
      field: 'id',
      width: 100,
    },
    {
      header: 'Turma',
      field: 'nome',
    },
  ];

  actions: Array<Actions> = [
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        this.router.navigate(['admin/turmas/register/' + item.id]);
      }
    },
    {
      name: "remove",
      label: "Remover",
      icon: "delete",
      click: (item: any): void => {
        this.excluirTurma(item);
      }
    },
  ];
  source: Array<any> = null;
  loading: boolean = false;
  paging: GuiPaging;


  constructor(private turmaService: TurmaService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
  ) {
    this.get();
  }

  ngOnInit() {
    Utils.showSidebar();
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

    this.turmaService.getAll(data)
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;
          this.source = response.dados;
          this.loading = false;
        },
        complete: () => {
        }
      })
  }

  excluirTurma(item: any) {
    let id = Number(item.id);
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '400px',
      data: {
        titulo: 'EXCLUÇÃO DE Turma',
        conteudo: "Você tem certeza que deseja EXCLUIR a turma de código '" + this.getValueCell(0, item, 'id') + "'?",
        tipo: "confirmacao",
        confirmText: 'Sim'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.setLoading(true);
        this.turmaService.excluir(id, (response) => {
          this.loadingService.setLoading(false);
          this.get();
        });
      }
    });

  }

  refresh_grid() {
    this.get();
  }

  getValueCell(index, item, field) {
    switch (field) {
      case 'id':
        return Utils.padLeft(item.id, "0", 6);
    }

    return null;
  }

  addTurma() {
    this.router.navigate(['admin/turmas/register']);
  }
}
