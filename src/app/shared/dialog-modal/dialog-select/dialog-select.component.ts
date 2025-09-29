import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { GuiColumn, GuiPaging } from '@generic-ui/ngx-grid';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Utils from '../../utils';
import { Actions } from 'src/app/interfaces/actions';
import { DialogModalComponent, ModalData } from '../dialog-modal/dialog-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GridComponent } from '../../grid/grid/grid.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-select',
  standalone: true,
  imports: [MatTableModule, MatProgressBarModule, MatMenuModule, SharedModule, MatPaginatorModule, MatIconModule, MatListModule, GridComponent],
  templateUrl: './dialog-select.component.html',
  styleUrl: './dialog-select.component.scss'
})
export class DialogSelectComponent {
  titulo: string = '';
  dataModalSelect: any = '';
  source: Array<any> = null;
  loading: boolean = false;
  paging: GuiPaging;
  totalRecords = 0;
  selecionados = [];

  columns: Array<GuiColumn> = [];

  //columnMatcher = (item: any) => item.nome;

  getValueCell(index, item, field) {
    switch (field) {
      case 'id':
        return Utils.padLeft(item.id, "0", 6);
    }

    return null;
  }
  name?: string;
  label?: string;
  icon?: string;
  click?: Function;
  disabled?: Function = (item?: any): boolean => {
    return false;
  };
  restricao?: any;
  hidden?: Function = (item?: any): boolean => {
    return false;
  };

  actions: Array<Actions> = [
    {
      icon: "download",
      click: (item: any): void => {
        this.data.dataModalSelect.selectedItem(item);
        this.selecionados.push(item.id);
        console.log(this.selecionados);
        //this.toastr.success("item " + Utils.padLeft(item.id, "0", 6) + " Selecionado com sucesso", 'Tudo certo!');

        this.carregaDados();
      },
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<DialogModalComponent>,
    private toastr: ToastrService
  ) {
    this.titulo = data.titulo;
    this.dataModalSelect = data.dataModalSelect;
    this.columns = data.dataModalSelect.campos;
    this.selecionados = data.dataModalSelect.selecionados;
    console.log(this.selecionados);

    this.carregaDados();
  }

  carregaDados() {
    this.loading = true;

    let p = null;
    if (this.selecionados.length > 0) {
      p = { 
        wni: JSON.stringify(this.selecionados),
        modal: 1
      };
    }

    this.httpClient.get<any>(environment.urlApi + this.dataModalSelect.rota, { params: p }).subscribe({
      next: (response: any) => {
        if (!response || !response.dados) return;

        switch (this.dataModalSelect.rota) {
          case 'categorias':
            let dados = [];
            response.dados.forEach((element) => {
              if(element.subcategorias){
                element.subcategorias.forEach((elementSub) => {
                  dados.push(elementSub);
                });
              } else {
                dados.push(element);
              }
            });

            this.source = dados;
            this.totalRecords = dados.length;
            break;
          default:
            this.source = response.dados;
            this.totalRecords = response.dados.length;
            break;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.dialogRef.close(true);
      }
    })
  }

  editItem(entity: any, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    //this.onItemEdit.emit(entity);
  }

  deleteItem(entity: any, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }
    //this.onItemDelete.emit(entity);
  }

  fechar() {
    this.dialogRef.close(true);
  }

  refresh_grid() {

  }
}
