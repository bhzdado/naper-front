import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiColumn, GuiPaging } from '@generic-ui/ngx-grid';
import { Actions } from 'src/app/interfaces/actions';
import { LoaderService } from 'src/app/services/loader.service';
import { ResponseService } from 'src/app/services/response.service';
import Utils from 'src/app/shared/utils';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProvaService } from '../../prova.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';

@Component({
  selector: 'app-all-liberacao-provas',
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule, MatIconModule, MatListModule],
  templateUrl: './all-liberacao-provas.component.html',
  styleUrl: './all-liberacao-provas.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AllLiberacaoProvasComponent implements OnInit {
  public provas_liberadas: Array<any> = []

  columns: Array<GuiColumn> = [
    {
      header: 'Código',
      field: 'id',
      width: 100,
    },
    {
      header: 'Prova',
      field: 'prova',
    },
    {
      header: 'Descrição',
      field: 'descricao',
    },
    {
      header: 'Periodo de liberação',
      field: 'expiracao'
    }
  ];

  //columnMatcher = (item: any) => item.nome;

  getValueCell(index, item, field) {
    switch (field) {
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
        const current = new Date();
        this.router.navigate(['admin/liberacao-prova/register/' + item.id], { queryParams: { view: current.getTime() }});
      },
    },
    {
      name: "edit",
      label: "Editar",
      icon: "edit",
      click: (item: any): void => {
        this.router.navigate(['admin/liberacao-prova/register/' + item.id]);
      }
    },
    {
      name: "delete",
      label: "Excluir",
      icon: "delete",
      click: (item: any): void => {
        this.removerLiberacao(item);
      }
    },
  ];

  source: Array<any> = null;
  loading: boolean = false;
  paging: GuiPaging;
  usuario: any;
  id: any;

  constructor(private loadingService: LoaderService, private router: Router,
    private dialog: MatDialog, private response: ResponseService, private route: ActivatedRoute,
    private provaService: ProvaService, private authService: AuthService
  ) {
    
  }

  ngOnInit(): void {
    Utils.showSidebar();
    this.get();

    this.route.queryParams.subscribe(params => {
      let id_perfil = params['u'] || null;
      if (id_perfil) {
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
    this.provaService.getAllProvaLiberadas(data)
      .subscribe({
        next: (response) => {
          if (!response || !response.dados) return;
          this.provas_liberadas = response.dados as any[]
        },
        complete: () => {
          this.loading = false;
        }
      })
  }

  LiberarProva() {
    this.router.navigate(['admin/liberacao-prova/register']);
  }

  refresh_grid() {
    this.get();    
  }

  removerLiberacao(item) {
    let id = Number(item.id);
        const dialogRef = this.dialog.open(DialogModalComponent, {
          width: '460px',
          data: {
            titulo: 'EXCLUSÃO',
            conteudo: "Você tem certeza que deseja EXCLUIR a liberação de código '" + item.id + "'?",
            tipo: "confirmacao",
            confirmText: 'Sim'
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
              let dataResponse = this.provaService.excluirLiberacao(item.id, (response) => {
                this.get();    
                this.loadingService.setLoading(false);
              });
          }
        });
  }
}
