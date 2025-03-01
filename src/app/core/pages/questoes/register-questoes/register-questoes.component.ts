import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Questao } from '../questao';
import ClassicEditor from '@haifahrul/ckeditor5-build-rich';
import { UploadAdapter } from 'src/app/adapters/upload-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestaoService } from '../questao.service';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from 'src/app/services/loader.service';
import { ResponseService } from 'src/app/services/response.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterAlternativasComponent } from '../../alternativas/register-alternativas/register-alternativas.component';
import Utils from 'src/app/shared/utils';
import { CategoriaService } from '../../categorias/categoria.service';
import { Categoria } from '../../categorias/categoria';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-register-questoes',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, SharedModule, CKEditorModule, MatAutocompleteModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register-questoes.component.html',
  styleUrl: './register-questoes.component.scss'
})
export default class RegisterQuestoesComponent implements OnInit {
  public id: any = 0;
  public Editor = ClassicEditor;
  public existeAlternativas = false;
  public alternativas = [];
  public alternativaCorreta = null;
  public alfabeto = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  public view: boolean = false;

  public arrayCategorias = [];
  public categorias = [];

  public dataEditor: any = ``;

  formControl = new FormControl('');

  public questaoForm: Questao = {
    enunciado: '',
    ativo: 1,
    categoria: null,
    peso_padrao: 1,
    alternativas: [],
    correta: null
  };

  public defaultConfig = {
    language: {
      ui: 'pt-br',
      content: 'pt-br'
    },
    removePlugins: ['Title'],
    placeholder: '',
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: 'http://example.com',

      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: true,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        'X-CSRF-TOKEN': 'CSRF-Token',
        Authorization: 'Bearer <JSON Web Token>'
      }
    },
    plugin: ['FullPage', 'GeneralHtmlSupport'],
    toolbar: [
      'sourceEditing',
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'fontFamily',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      'underline',
      'highlight',
      '|',
      'resizeImage',
      'link',
      'imageUpload',
      'mediaEmbed',
      '|',
      'alignment',
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
      'specialCharacters'
    ],
    image: {
      resizeOptions: [
        {
          name: 'resizeImage:original',
          value: null,
          label: 'Original'
        },
        {
          name: 'resizeImage:custom',
          label: 'Custom',
          value: 'custom'
        },
        {
          name: 'resizeImage:40',
          value: '40',
          label: '40%'
        },
        {
          name: 'resizeImage:60',
          value: '60',
          label: '60%'
        }
      ],
      resizeUnit: '%',
      toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
      styles: [
        'full',
        'alignLeft',
        'alignRight'
      ],
    },
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questaoService: QuestaoService,
    private httpClient: HttpClient,
    private loadingService: LoaderService,
    private response: ResponseService,
    private dialog: MatDialog,
    private categoriaService: CategoriaService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id') ?? 0;
    if (this.id) {
      this.carregaQuestao(this.id);
    }

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.view = (params['view']) ? true : false;
      }
    )
  }

  ngOnInit(): void {
    this.getCategorias();
  }

  ngAfterViewInit(): void {
    Utils.hideSidebar();
  }

  onReady(editor: ClassicEditor): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, this.httpClient);
    };
  }

  onChange({ editor }: ChangeEvent) {
    this.dataEditor = editor.getData();
  }
  
  salvar() {
    this.loadingService.setLoading(true);

    let data = {
      enunciado: this.dataEditor,
      ativo: this.questaoForm.ativo,
      categoria: this.questaoForm.categoria,
      peso_padrao: this.questaoForm.peso_padrao,
      alternativas: this.alternativas,
      correta: this.questaoForm.correta
    };

    if (this.id) {
      this.questaoService.update(this.id, data).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/questoes']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    } else {
      this.questaoService.create(data).subscribe(
        (response: any) => {
          this.response.treatResponse(response, response.mensagem);
          this.loadingService.setLoading(false);
          this.router.navigate(['/admin/questoes']);
        },
        (error) => {
          this.response.treatResponseError(error);
          this.loadingService.setLoading(false);
        });
    }
  }

  carregaQuestao(id) {
    this.questaoService.getQuestao(id).subscribe(
      (response: any) => {
        if (response.status) {
          this.questaoForm.id = response.dados.id;
          this.questaoForm.enunciado = response.dados.nome;
          this.questaoForm.categoria = response.dados.categoria.id;
          this.questaoForm.peso_padrao = response.dados.peso_padrao;
          this.questaoForm.ativo = response.dados.ativo;
          this.questaoForm.alternativas = response.dados.alternativas;


          response.dados.alternativas.forEach((alternativa, index) => {
            this.existeAlternativas = true;
            this.alternativas.push(alternativa.alternativa);
            
            if (alternativa.correta) {
              this.alternativaCorreta = index;
              this.questaoForm.correta = index;
            }
          });
        }
      },
      (error) => {
        this.response.treatResponseError(error);
      });
  }

  isAlternativaCorreta(i){
    return (Number(this.alternativaCorreta) == Number(i)) ? true : false;
  }

  getCategorias() {
    this.categoriaService.getAll().subscribe({
      next: (response) => {
        if (!response || !response.dados) return;

        this.categorias = response.dados;
      },
      complete: () => {

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

  getQuestao() {
    return this.dataEditor;
  }

  isTabAlternativasActive() {
    if (this.view) {
      return true;
    }
    return this.dataEditor ? true : false;
  }

  visualizarQuestaoAtivo() {
    return this.existeAlternativas;
  }

  configuraExistenciaAlternativas() {
    if (this.alternativas.length > 0) {
      this.existeAlternativas = true;
    } else {
      this.existeAlternativas = false;
    }
  }

  armazenaAlternativa(alternativa: string) {
    if (alternativa != '') {
      this.alternativas.push(alternativa);
    }

    this.configuraExistenciaAlternativas();
  }

  removeAlternativa(index: number) {
    this.alternativas.splice(index, 1);
    this.configuraExistenciaAlternativas();
  }

  adicionarAlternativa() {
    Utils.showHideSidebar();
    const dialogRef = this.dialog.open(RegisterAlternativasComponent, {
      maxWidth: '100vw',
      width: '85%',
      maxHeight: '80vh',
      height: '65%',
      position: { right: '50px' },
      data: {
        titulo: 'Aidiconar Alternativa ',
        acao: 'addSubCategoria',
        //item: item
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.armazenaAlternativa(result);
      // if (result) {
      //   this.carregarCategorias();
      // }
      // Utils.showHideSidebar();
    });
  }

  voltar() {
    this.router.navigate(['admin/questoes']);
  }
}
