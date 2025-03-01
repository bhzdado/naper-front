import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ModalData } from 'src/app/interfaces/modalData';
import { LoaderService } from 'src/app/services/loader.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import Utils from 'src/app/shared/utils';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import customBuild from '@haifahrul/ckeditor5-build-rich';
import { Alternativa } from '../alternativa';
import { CKEditorModule, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { UploadAdapter } from 'src/app/adapters/upload-adapter';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-alternativas',
  standalone: true,
  imports: [AngularMaterialModule, FormsModule, SharedModule, NgxMaskDirective, NgxMaskPipe, CKEditorModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './register-alternativas.component.html',
  styleUrl: './register-alternativas.component.scss'
})
export class RegisterAlternativasComponent {
  public titulo = "Nova Alternativa";
  public acao: any = "adicao";
  public Editor = customBuild;

  public dataEditor: any = ``;
  public alternativaForm: Alternativa = {
    questao_id: 0,
    alternative: ''
  };

  public defaultConfig = {
    language: {
      ui: 'pt-br',
      content: 'pt-br'
    },
    removePlugins: ['Title'],
    placeholder: '',
    plugin: ['SourceEditing', 'FullPage', 'GeneralHtmlSupport', 'ImageInsert', 'ImageUpload', 'Base64UploadAdapter', 'ImageResizeEditing', 'ImageResizeHandles'],
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
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DialogModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private loadingService: LoaderService
  ) {
    this.titulo = data.titulo;
    this.acao = data.acao ?? "adicao";
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    Utils.hideSidebar();
  }

  onReady(editor: customBuild): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, this.httpClient);
    };
  }

  onChange({ editor }: ChangeEvent) {
    this.dataEditor = editor.getData();
  }

  create() {
    this.dialogRef.close(this.dataEditor);
    //Utils.showHideSidebar();
  }

  onNoClick() {
    this.dialogRef.close(false);
    //Utils.showHideSidebar();
  }
}
