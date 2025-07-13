import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule, SharedModule,FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, AngularMaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.scss'
})
export class DetalheComponent implements AfterViewInit, OnInit {
  @ViewChild('titulo') myDivRef!: ElementRef;

  public id: number = 0;
  public titulo: SafeHtml = "";
  public ultima_atualizacao: string = "";
  public conteudo: SafeHtml = "";
  params: string = '';
  modulo: boolean = false;
  queryValue: string = '';
  query: string = '';
  textoBusca: string = '';
  busca_permitida: boolean = false;
  tipo_conteudo: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    public cdr: ChangeDetectorRef,
    private location: Location,
    public conteudoService: ConteudoService,
    public navegacaoService: NavegacaoService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef,
    private router: Router
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

          if( query) this.atualizaParams('q', query);
          if(queryValue) this.atualizaParams('qValue', queryValue);

          let currentPath = window.location.pathname;

          switch (currentPath) {
            case '/conteudo/detalhe/isencao':
              this.tipo_conteudo = 'isencao';
              this.busca_permitida = true;
              this.id = 1520;
              this.cdr.detectChanges();
              break;
          }
        }
      }
    );

    this.cdr.detectChanges();
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        let tmp = params['id'].split('-');
        this.id = params['id'];
        if (tmp[0] == 'm') {
          this.atualizaParams('m', 1);
          this.id = tmp[1];
        }

        this.getConteudo(this.id, this.params);
      }
    });
    this.cdr.detectChanges();
  }

  atualizaParams(campo, valor, renovar = false) {
    if(renovar){
      this.params = '';
    }

    if (this.params == '') {
      this.params = "?" + campo + "=" + valor;
    } else {
      this.params += "&" + campo + "=" + valor;
    }
  }

  buscar() {
    this.atualizaParams('qValue', 'DIGITE');
    this.atualizaParams('q', this.textoBusca);

    //?qValue=DIGITE&q=4911.10.10
    this.getConteudo(this.tipo_conteudo, this.params);
  }

  voltar(): void {
    this.location.back();
  }

  getConteudo(id, params = '') {
    this.loadingService.setLoading(true);
    
    this.conteudoService.getConteudo(id, params, (response) => {
      this.ultima_atualizacao = response.dados.ultima_atualizacao;
      this.titulo = this.sanitizer.bypassSecurityTrustHtml(response.dados.titulo);
      this.conteudo = this.sanitizer.bypassSecurityTrustHtml(response.dados.conteudo);

      this.tratarLinks();
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
