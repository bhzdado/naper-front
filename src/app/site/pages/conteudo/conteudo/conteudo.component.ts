import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConteudoService } from '../conteudo.service';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loader.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NavegacaoService } from 'src/app/site/services/navegacao.service';
import { LeitorComponent } from 'src/app/site/shared/modal/leitor/leitor.component';
import { MediaService } from 'src/app/services/media.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

export interface listagem {
  id: number;
  titulo: string;
}

@Component({
  selector: 'app-conteudo',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTabsModule, MatListModule, MatDividerModule, CommonModule, NgFor, SharedModule, ReactiveFormsModule,
    MatButtonModule, MatProgressBarModule, MatMenuModule, AngularMaterialModule, MatPaginatorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conteudo.component.html',
  styleUrl: './conteudo.component.scss'
})
export class ConteudoComponent implements AfterViewInit, OnInit {
  public target: any = "";
  public id: number = 0;

  public titulo: string = "";
  dataSource: any[] = [];
  listagem: boolean = false;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  goToPageNumber: number;
  sem_registros: boolean = false;
  carregando: boolean = false;

  textoBusca: string = '';
  conteudo: string = '';
  tipo_conteudo: string = 'listagem';

  error: boolean = false;
  mensagem_erro: string = "";

  params: any = null;

  private modalElement: any;

  pdfUrl = '';
  @ViewChild(LeitorComponent) pdfModal!: LeitorComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public navegacaoService: NavegacaoService,
    public conteudoService: ConteudoService
  ) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.params.unsubscribe();
  }

  ngAfterViewInit() {
    this.target = this.activatedRoute.snapshot.paramMap.get('target') ?? "";
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id')) ?? 0;

    this.params = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];

      this.listar(1);
    });


    // let container = document.getElementById('container');
    // let elements = this.myDivRef.nativeElement.getElementsByTagName('a');
    // console.log(elements.length);
  }

  buscar() {
    this.listar(1, this.textoBusca);
  }

  listar(currentPage, texto = "") {
    this.carregando = true;
    this.cdr.detectChanges();
    // switch (this.target) {
    //   case 'm':
    this.conteudoService.getConteudoPorModulo(this.id, { pagina: currentPage, buscar: texto }, (response) => {
      this.error = false;

      if (response.status == 1) {
        this.sem_registros = false;
        if (response.dados.conteudos) {
          let tabela = '';
          let lista = '<table>';
          let url = "url";
          let ds = [];

          response.dados.conteudos.forEach((element, index) => {
            let rest = element.titulo.substr(0, 6);

            if (rest != '<table') {
              this.tipo_conteudo = 'tabela';
              let tag_a = (element.titulo.substr(0, 2) == '<a') ? 1 : 0;
              element.tag_a = tag_a;

              if (tag_a == 1) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(element.titulo, 'text/html');
                const elementFromParser = doc.body.firstChild as HTMLElement;
                let href = elementFromParser.getAttribute('href');

                let novotitulo = "";
                if (href && href.indexOf('.pdf') > -1) {
                  elementFromParser.removeAttribute('href');
                  element.is_pdf = true;
                  element.pdf_url = href.replace('?mdl=1', '&mdl=1');

                  novotitulo = elementFromParser.outerHTML.replace("<a", "<span").replace("</a", "</span");
                  novotitulo = novotitulo.replace('?mdl=1', '&mdl=1');
                  //novotitulo = this.inserirTexto(elementFromParser.outerHTML, " onclick='abrirDetalhe(item)' ", 2);

                } else {
                  novotitulo = this.inserirTexto(element.titulo, " target='_blank' ", 2);
                  novotitulo = novotitulo.replace('?mdl=1', '&mdl=1');
                }
                element.titulo = novotitulo;
              }
              ds.push(element);

              //lista += "<tr><td style=''><mat-icon>add</mat-icon></td><td><a (click)='abrirDetalhe(item)'> " + element.titulo + " </a></td></tr>";
            } else {
              if (this.id == 1665 || this.id == 1667 || this.id == 1520 || this.id == 1610 || this.id == 1611 || this.id == 1615 || this.id == 2320) {
                tabela += "<br>" + element.titulo + " ";
              } else {
                tabela += "<br><a (click)='abrirDetalhe(item)'>" + element.titulo + " </a>";
              }
            }
          });

          //this.conteudo = tabela + lista;

          this.titulo = response.dados.modulo;
          this.dataSource = ds;
          this.listagem = response.dados.listagem;

          this.totalItems = response.totalItems;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
          this.goToPageNumber = this.currentPage;
        } else {
          this.abrirDetalhe(response.dados, true);
        }
      } else {
        // console.log(response.status);
        // Swal.fire({
        //   icon: "error",
        //   text: response.mensagem,
        //   draggable: true,
        //   confirmButtonColor: "#A9C92F",
        //   cancelButtonColor: "#d33",
        // });

        this.sem_registros = true;
        this.error = true;
        this.dataSource = [];
        this.currentPage = 1;
        this.totalPages = 0;
      }

      this.carregando = false;
      this.cdr.detectChanges();
    });
    //     break;
    // }
  }

  inserirTexto(stringOriginal: string, textoAInserir: string, indice: number): string {
    if (indice > 0 && indice < stringOriginal.length) {
      // Pega a parte antes do índice especificado
      const parte1 = stringOriginal.slice(0, indice);
      // Pega a parte depois do índice especificado
      const parte2 = stringOriginal.slice(indice);

      // Concatena as partes com o novo texto
      return parte1 + textoAInserir + parte2;
    } else if (indice === 0) {
      // Caso especial: inserir no início
      return textoAInserir + stringOriginal;
    } else if (indice >= stringOriginal.length) {
      // Caso especial: inserir no final
      return stringOriginal + textoAInserir;
    }
    return stringOriginal; // Retorna original se o índice for inválido
  }

  nextPage(page: number): void {
    page++;
    this.onPageChange(page);
  }

  previousPage(page: number): void {
    page--;
    this.onPageChange(page);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (page >= 1 && page <= this.totalPages) {
      this.listar(page);
    }
  }

  goToPage(): void {
    if (this.goToPageNumber >= 1 && this.goToPageNumber <= this.totalPages) {
      // mat-paginator uses 0-based index
      this.currentPage = this.goToPageNumber;
      this.listar(this.currentPage);
    } else {
      alert('Invalid page number');
    }
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxPages = 5; // Número máximo de botões de página visíveis
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  abrirPdfModal(url: string) {
    this.navegacaoService.abrirPdf(url);
  }

  abrirDetalhe(item, modulo = false) {
    if (item.pdf) {
      this.navegacaoService.abrirPdf(item.pdf_url);
    } else {
      if (modulo) {
        window.location.href = environment.urlSite + 'conteudo/detalhe/m-' + item.id;
      } else {
        this.navegacaoService.navigateTo('conteudo/detalhe/' + item.id);
      }
    }
  }

}
