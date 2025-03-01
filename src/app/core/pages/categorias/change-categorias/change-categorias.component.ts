import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ModalData } from 'src/app/interfaces/modalData';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Categoria, Subcategoria } from '../categoria';
import { CategoriaService } from '../categoria.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-change-categorias',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, SharedModule],
  templateUrl: './change-categorias.component.html',
  styleUrl: './change-categorias.component.scss'
})
export class ChangeCategoriasComponent implements OnInit {
  public novaCategoriaForm: Subcategoria = { id: '', nome: '' };
  public categorias: any = [];
  public categoria_atual: Categoria = null;
  public subCategoriaId: number = 0;
  public subCategoria: Categoria = null;

  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private categoriaService: CategoriaService,
    private loadingService: LoaderService,
    private dialog: MatDialog,
  ) {
    this.subCategoriaId = data.item.id;
    this.categoriaService.getCategoria(data.item.categoria_atual, false, (response)=> {
      this.categoria_atual = response.dados;
    });
    this.categoriaService.getCategoria(data.item.id, false, (response)=> {
      this.subCategoria = response.dados;
      console.log(this.subCategoria);
    });
  }

  ngOnInit(): void {
    this.carregaDadosUsuario();
  }

  carregaDadosUsuario() {
      this.loadingService.setLoading(true);
      this.categoriaService.getAll().subscribe(
        (response: any) => {
          if (response.errors) {
            const dialogRef = this.dialog.open(DialogModalComponent, {
              width: '400px',
              data: {
                titulo: 'ERRO',
                conteudo: response.message,
                tipo: "erro"
              },
            });
          } else {
            this.categorias = response.dados as Categoria[];
          }
          this.loadingService.setLoading(false);
        });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  change(): void {
        const dialogRef = this.dialog.open(DialogModalComponent, {
          width: '460px',
          data: {
            titulo: "Mudança de Categoria",
            conteudo: "Ao efetuar a mudança de categoria todas as questões associadas a esta Subcategoria serão migradas automaticamente para essa nova categoria. Você tem certeza que deseja realmente efetuar essa mudança?'",
            tipo: "confirmacao",
            confirmText: 'Sim'
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.categoriaService.changeCategory(this.subCategoriaId, this.novaCategoriaForm, (response) => {
                this.dialogRef.close(true);
            })
          }
        });

    
  }
}
