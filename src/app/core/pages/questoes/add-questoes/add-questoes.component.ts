import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Questao } from '../questao';

import { CKEditorModule, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@haifahrul/ckeditor5-build-rich';
import { UploadAdapter } from 'src/app/adapters/upload-adapter';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuestaoService } from '../questao.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { HttpClient } from '@angular/common/http';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ModalData } from 'src/app/interfaces/modalData';
import { ResponseService } from 'src/app/services/response.service';
import { LoaderService } from 'src/app/services/loader.service';


// import 'ckeditor5/ckeditor5.css';
// import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

@Component({
  selector: 'app-add-questoes',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, SharedModule, NgxMaskDirective, NgxMaskPipe, CKEditorModule],
  providers: [provideNgxMask()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-questoes.component.html',
  styleUrls: ['./add-questoes.component.scss']
})

export default class AddQuestoesComponent implements OnInit {
  public questao_id = null;
  public titulo = "Nova Questão";
  public acao: any = "adicao";
  public Editor = ClassicEditor;

  public dataEditor: any = `<p>Hello, world!</p>`;

  public defaultConfig = {
    language: {
      ui: 'pt-br',
      content: 'pt-br'
    },
    removePlugins: ['Title'],
    placeholder: '',
    plugin: ['ImageInsert', 'ImageUpload', 'Base64UploadAdapter'],
    toolbar: [
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
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    },
  }

  public questaoForm: Questao = {
    enunciado: '',
    ativo: 1,
    categoria: [],
    peso_padrao: 1,
    alternativas: [],
    correta: 0
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questaoService: QuestaoService,
    private httpClient: HttpClient,
    private loadingService: LoaderService,
    private response: ResponseService
  ) {
  }

  onReady(editor: ClassicEditor): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, this.httpClient);
    };
  }

  public onChange({ editor }: ChangeEvent) {
    this.dataEditor = editor.getData();
  }

  ngOnInit(): void {
    if (this.questao_id) {
      this.carregaDadosQuestao();
    }
  }

  carregaDadosQuestao() {
    this.loadingService.setLoading(true);
    this.questaoService.getQuestao(this.questao_id).subscribe(
      (response: any) => {
        this.response.treatResponseWithoutMessage(response, response.mensagem, (response, result) => {
          this.questaoForm.enunciado = response.dados.nome;
        });
        this.loadingService.setLoading(false);
      });
  }

  create() {
    // this.questaoService.create(this.questaoForm).subscribe(
    //   (response: any) => {
    //     this.response.treatResponse(response, response.mensagem);
    //   },
    //   (error) => {
    //     this.response.treatResponseError(error);
    //     return false;
    //   });
  }

  editar() {
    this.questaoService.update(this.questao_id, this.questaoForm).subscribe(
      (response: any) => {
        this.response.treatResponse(response, response.mensagem);
      },
      (error) => {
        this.response.treatResponseError(error);
        return false;
      });
  }

  cancelar() {

  }

}
