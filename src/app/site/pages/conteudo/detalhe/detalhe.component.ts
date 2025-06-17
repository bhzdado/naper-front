import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { ConteudoService } from '../conteudo.service';
import { CommonModule, Location } from '@angular/common';
import { SafeHtmlPipe } from 'src/app/shared/pipes/SafeHtml.pipe';
import { NavegacaoService } from 'src/app/site/services/navegacao.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-detalhe',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule],
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    public cdr: ChangeDetectorRef,
    private location: Location,
    public conteudoService: ConteudoService,
    public navegacaoService: NavegacaoService,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id')) ?? 0;

    this.getConteudo();
  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    // let container = document.getElementById('container');
    // let elements = this.myDivRef.nativeElement.getElementsByTagName('a');
    // console.log(elements.length);
  }

  voltar(): void {
    this.location.back();
  }

  getConteudo() {
    this.loadingService.setLoading(true);

    this.conteudoService.getConteudo(this.id, (response) => {
      this.ultima_atualizacao = response.dados.ultima_atualizacao;
      this.titulo = this.sanitizer.bypassSecurityTrustHtml(response.dados.titulo);
      this.conteudo = this.sanitizer.bypassSecurityTrustHtml(response.dados.conteudo);

      this.cdr.detectChanges();
      this.tratarLinks();
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
  }

  async gerarPdf() {
    html2pdf()
      .set({
        margin: 10, 
        filename: 'fiscal3-c'+this.id+'.pdf',
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      })
      .from(document.getElementById('element-to-print').innerHTML)
      .toPdf()
      .save();
  }

  async telaCheia() {
    this.navegacaoService.telaCheia(document.getElementById('element-to-print').innerHTML);
  }
}
