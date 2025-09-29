import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { GuiGridModule } from '@generic-ui/ngx-grid';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import Utils from 'src/app/shared/utils';
import { MenuService } from '../menu.service';
import { ResponseService } from 'src/app/services/response.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';

export interface Menu {
  id: number;
  titulo: string;
  ordem: number;
  classe: number;
}

@Component({
  selector: 'app-all-menus',
  standalone: true,
  imports: [AngularMaterialModule, SharedModule, GuiGridModule, CdkDropList, CdkDrag, MatTableModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './all-menus.component.html',
  styleUrl: './all-menus.component.scss'
})
export default class AllMenusComponent implements OnInit {
  @ViewChild('table', { static: true }) table: MatTable<Menu>;

  displayedColumns: string[] = ['ordem', 'titulo', 'classe', 'acao'];
  ELEMENT_DATA: Menu[] = [];
  dataSource = [];

  constructor(private loadingService: LoaderService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private response: ResponseService,
    private menuService: MenuService
  ) {
  }

  drop(event: CdkDragDrop<string>) {
    const previousIndex = this.dataSource.findIndex(d => d === event.item.data);

    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);

    let novaOrdem = [];

    this.dataSource.forEach((x: any, i: number) => {
      x.ordem = Number(i) + 1;
      novaOrdem.push({
        id: x.id,
        ordem: i
      })
    });

    this.table.renderRows();

    this.menuService.alterarOrdem((novaOrdem)).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
      },
      (error) => {
        this.response.treatResponseError(error);
        return false;
      });
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    Utils.showSidebar();

    this.carregarMenus();
  }

  carregarMenus() {
    this.menuService.getTodosMenus((response) => {
      let data = [];

      response.dados.forEach((x: any, i: number) => {
        data.push({
          id: x.id,
          titulo: x.titulo,
          ordem: Number(i) + 1,
          classe: x.classe
        })
      });

      this.dataSource = data;
      this.loadingService.setLoading(false);
    });
  }

  editarMenu(id: number) {
    this.router.navigate(['/admin/menus/configurar/' + id]);
  }

  removerMenu(id: number) {
    const dialogRef = this.dialog.open(DialogModalComponent, {
      width: '460px',
      data: {
        titulo: "EXCLUSÃO DE MENU",
        conteudo: "Você tem certeza que deseja EXCLUIR este menu?",
        tipo: "confirmacao",
        confirmText: 'Sim'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuService.removerMenu(id).subscribe(
          (response: any) => {
            this.carregarMenus();
            this.response.treatResponse(response, response.mensagem);
          },
          (error) => {
            this.response.treatResponseError(error);
            return false;
          });
      }
    });


  }

  criarNovoMenu() {
    Utils.hideSidebar();
    this.router.navigate(['/admin/menus/configurar']);
  }
}
