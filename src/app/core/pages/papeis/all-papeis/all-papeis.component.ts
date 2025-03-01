import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PapelService } from '../papel.service';
import { AuthService, User } from 'src/app/services/auth/auth.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { GuiColumn, GuiPaging } from '@generic-ui/ngx-grid';
import { Actions } from 'src/app/interfaces/actions';
import AddPapeisComponent from 'src/app/core/pages/papeis/add-papeis/add-papeis.component';
import Utils from 'src/app/shared/utils';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-all-papeis',
  templateUrl: './all-papeis.component.html',
  styleUrls: ['./all-papeis.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule, MatIconModule, MatListModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AllPapeisComponent implements OnInit {
  public usuarioSource: MatTableDataSource<any> = new MatTableDataSource<any>([])
  public usuarioLogado: any;

  columns: Array<GuiColumn> = [
    {
      header: 'Código',
      field: 'id',
      width: 100,
    },
    {
      header: 'Nome',
      field: 'nome',
    },
  ];

  actions: Array<Actions> = [
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        const dialogRef = this.dialog.open(AddPapeisComponent, {
          width: '650px',
          height: '300px',
          data: {
            titulo: 'Edição de Papel',
            acao: 'edicao',
            item: item
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          this.get();
        });
      },
      disabled: (item: any): boolean => {
        if (item.id == 1 || this.usuarioLogado.papel.id == item.id) {
          return true;
        }
        return false;
      }
    },
    {
      name: "remove",
      label: "Remover",
      icon: "delete",
      click: (item: any): void => {
        this.excluirPapel(item);
      },
      disabled: (item: any): boolean => {
        if (item.id == 1 || this.usuarioLogado.papel.id == item.id) {
          return true;
        }
        return false;
      }
    },
  ];
  source: Array<any> = null;
  loading: boolean = false;
  paging: GuiPaging;


  constructor(private papelService: PapelService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
  ) {
    this.usuarioLogado = authService.getUser();
    this.get();
  }

  ngOnInit(): void {

  }

  getValueCell(index, item, field) {
    switch (field) {
      case 'id':
        return Utils.padLeft(item.id, "0", 6);
    }

    return null;
  }


  addPapel() {
    const dialogRef = this.dialog.open(AddPapeisComponent, {
      width: '650px',
      height: '300px',
      data: {
        titulo: 'Criar Novo Papel',
        acao: 'adicao'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.get();
      }
    });
  }

  excluirPapel(item: any) {
    let id = Number(item.id);
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '400px',
      data: {
        titulo: 'EXCLUÇÃO DE PAPEL',
        conteudo: "Você tem certeza que deseja EXCLUIR o papel de código '" + this.getValueCell(0, item, 'id') + "'?",
        tipo: "confirmacao",
        confirmText: 'Sim'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadingService.setLoading(true);
        this.papelService.excluir(id, (response) => {
          this.loadingService.setLoading(false);
          this.get();
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

    this.papelService.getAll(data)
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

  changePaging(pe: PageEvent) {
    this.get({
      i: pe.pageIndex ?? 0,
      s: pe.pageSize ?? 0,
      l: pe.length ?? 3
    });
  }


}
