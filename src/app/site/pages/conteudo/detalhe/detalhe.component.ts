import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { ConteudoService } from '../conteudo.service';
import { CommonModule, Location } from '@angular/common';
import { SafeHtmlPipe } from 'src/app/shared/pipes/SafeHtml.pipe';
import { NavegacaoService } from 'src/app/site/services/navegacao.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2pdf from 'html2pdf.js';
import { SharedModule } from 'primeng/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { HeaderService } from 'src/app/site/services/header.service';
import { Item } from '@generic-ui/ngx-grid/core/structure/source/src/api/item/item';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule, SharedModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, AngularMaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.scss'
})
export class DetalheComponent implements AfterViewInit, OnInit {
  @ViewChild('titulo') myDivRef!: ElementRef;
  @Output() setConteudoModal = new EventEmitter<boolean>(false);
  @ViewChildren('.aLinkButtonOpenModal') elementosOpenModal!: QueryList<ElementRef>;

  public id: number = 0;
  public modulo_id: number = 0;
  public titulo: SafeHtml = "";
  public ultima_atualizacao: string = "";
  public conteudo: SafeHtml = "";
  params: any[] = []
  modulo: boolean = false;
  queryValue: string = '';
  query: string = '';
  textoBusca: string = '';
  busca_permitida: boolean = false;
  tipo_conteudo: string = '';
  isModal: boolean = false;
  urlCompleta: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    public cdr: ChangeDetectorRef,
    private location: Location,
    public conteudoService: ConteudoService,
    public navegacaoService: NavegacaoService,
    private sanitizer: DomSanitizer, private router: Router, private renderer: Renderer2,
    private elementRef: ElementRef, private headerService: HeaderService
  ) {
    this.busca_permitida = false;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params) {
          let queryValue = params['qValue'];
          let query = params['q'];
          this.isModal = params['mdl'] ?? false;

          if (query) this.atualizaParams('q', query);
          if (queryValue) this.atualizaParams('qValue', queryValue);

          this.headerService.toggleHeader(!this.isModal);

          this.cdr.detectChanges();
          // let currentPath = window.location.pathname;

          // switch (currentPath) {
          //   case '/conteudo/detalhe/isencao':
          //   case '/conteudo/detalhe/53862':
          //       this.tipo_conteudo = 'isencao';
          //     this.busca_permitida = true;
          //     this.id = 1520;
          //     this.cdr.detectChanges();
          //     break;
          // }
        }
      }
      );

    this.cdr.detectChanges();

    this.urlCompleta = this.router.url;

    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        let tmp = params['id'].split('-');
        this.id = params['id'];

        if (tmp[0] == 'm') {
          this.atualizaParams('m', 1);
          this.id = tmp[1];
        } else {
          switch (this.id.toString()) {
            case 'isencao':
              this.tipo_conteudo = 'isencao';
              this.busca_permitida = true;
              this.id = 1520;
              this.params.push({ campo: 'cbm', valor: 1 });
              this.cdr.detectChanges();
              break;
            case '58290':
            case '33529':
              this.busca_permitida = true;
              this.cdr.detectChanges();
              break;
          }
        }

        this.params.push({ campo: 'mdl', valor: this.isModal ? '1' : '0' });
        this.getConteudo(this.id);
      }
    });

    this.cdr.detectChanges();
  }

  atualizaParams(campo, valor, renovar = false) {
    if (renovar) {
      this.params = [];
    }

    if (this.params.findIndex((item) => item[campo] !== undefined) < 0) {
      this.params.push({ campo: campo, valor: valor });
    }
  }

  buscar() {
    this.atualizaParams('qValue', 'DIGITE', true);
    this.atualizaParams('q', this.textoBusca);

    if (this.modulo_id) {
      //this.atualizaParams('cbm', 1);
    }

    if (this.isModal) {
      this.atualizaParams('mdl', 1);
    }

    let id = (this.tipo_conteudo != '') ? this.tipo_conteudo : this.modulo_id;
    this.getConteudo(id);
  }

  voltar(): void {
    this.location.back();
  }


  getConteudo(id) {
    this.loadingService.setLoading(true);

    const qs =
      '?' +
      Object.values(this.params)
        .map((key, value) => `${key.campo}=${key.valor}`)
        .join('&')

    this.conteudoService.getConteudo(id, qs, (response) => {
      let conteudo = "";

      this.modulo_id = response.dados.id;
      //this.ultima_atualizacao = response.dados.ultima_atualizacao;
      if (response.dados != '') {
        this.busca_permitida = response.dados.buscador ?? 0;
        if (!Array.isArray(response.dados)) {
          this.titulo = this.sanitizer.bypassSecurityTrustHtml(response.dados.titulo);
          conteudo = response.dados.conteudo;
        } else {
          this.titulo = this.sanitizer.bypassSecurityTrustHtml(response.titulo_modulo);
          response.dados.forEach(element => {
            conteudo += element.titulo;
          });
        }
      } else {
        this.titulo = "";
        conteudo = '<p>Conteúdo não encontrado.</p>';
        //this.router.navigate(['/pagina-nao-encontrada'], { skipLocationChange: true });
      }

      this.conteudo = this.sanitizer.bypassSecurityTrustHtml(conteudo);
      this.tratarLinks();

      this.cdr.detectChanges();
      this.atribuirAcaoLink();

      this.cdr.detectChanges();
      this.loadingService.setLoading(false);
    });
  }

  tratarLinks() {
    let elements = this.elementRef.nativeElement.getElementsByTagName('a');

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let url = element.getAttribute('href');
      element.removeAttribute('href');
      element.addEventListener('click', _ => { this.abrirConteudo(url) }, false);
    }
  }

  atribuirAcaoLink(): void {
    const elementos = document.querySelectorAll('.aLinkButtonOpenModal');

    elementos.forEach((element: Element) => {
      this.renderer.listen(element, 'click', (evento) => {
        this.navegacaoService.abrirModalByUrl(element.getAttribute('endereco'));
        this.cdr.detectChanges();
      });
    });

    const elementosAnchor = document.querySelectorAll('.GoToAnchor');

    elementosAnchor.forEach((element: Element) => {
      this.renderer.listen(element, 'click', (evento) => {
        this.navegacaoService.goToAnchor(element.getAttribute('hrefGoToAnchor'), this.urlCompleta);
        this.cdr.detectChanges();
      });
    });
  }

  abrirConteudo(url) {
    this.navegacaoService.abrirConteudo(url);
    this.cdr.detectChanges();
  }

  async gerarPdf() {
    this.loadingService.setLoading(true);
    html2pdf()
      .set({
        margin: 10,
        filename: 'fiscal3-c' + this.id + '.pdf',
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      })
      .from(document.getElementById('element-to-print').innerHTML)
      .toPdf()
      .save();
    this.loadingService.setLoading(false);
  }

  async telaCheia() {
    this.navegacaoService.telaCheia(document.getElementById('element-to-print').innerHTML);
  }
}
