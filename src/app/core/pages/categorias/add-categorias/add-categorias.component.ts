import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from '@angular/core';
import { Categoria } from '../categoria';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalData } from 'src/app/interfaces/modalData';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CategoriaService } from '../categoria.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-add-categorias',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-categorias.component.html',
  styleUrl: './add-categorias.component.scss'
})
export class AddCategoriasComponent implements OnInit {
  public categoria_id = null; 
  public titulo = "Novo Categoria";
  public acao: any = "adicao";
  public disabled: boolean = false;
  public categoria: any;

  public categoriaForm: Categoria = {
    nome: ''
  };

  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private loadingService: LoaderService
  ) {
    this.titulo = data.titulo;
    this.acao = data.acao ?? "adicao";
    this.categoria_id = data?.item?.id ?? 0;
  }

  ngOnInit() {
    if (this.categoria_id && this.acao != "addSubCategoria") {
      this.carregaDados();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  isAdd(){
    return (this.acao == "addSubCategoria"  || this.acao == "adicao") ? true : false;
  }

  carregaDados() {
    this.loadingService.setLoading(true);

    let isSubcategoria = false;
    if(this.acao == 'edicaoSubCategoria'){
      isSubcategoria = true;
    }

    this.categoriaService.getCategoria(this.categoria_id,isSubcategoria, (response)=>{
      if(response.status == 0){
        this.dialogRef.close(false);
      } else {
        this.categoriaForm.nome = response.dados.nome;
      }
      this.loadingService.setLoading(false);
    });
  }

  create(): void {
    let service = this.categoriaService;
    let retorno = null;

    switch (this.acao) {
      case 'addSubCategoria':
        retorno = this.categoriaService.createSubCategory(this.categoria_id, this.categoriaForm);
        break;
      case 'edicaoSubCategoria':
        retorno = this.categoriaService.updateSubcategory(this.categoria_id, this.categoriaForm);
        break;
      case 'edicaoCategoria':
        retorno = this.categoriaService.updateCategory(this.categoria_id, this.categoriaForm);
        console.log('retorno: ', retorno);
        break;
      default:
        retorno = this.categoriaService.createCategory(this.categoriaForm);
        break;
    }
    this.dialogRef.close(true);
  }
}
