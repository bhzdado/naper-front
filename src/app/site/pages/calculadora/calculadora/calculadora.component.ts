import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonModule, Location } from '@angular/common';
import { SafeHtmlPipe } from 'src/app/shared/pipes/SafeHtml.pipe';
import { NavegacaoService } from 'src/app/site/services/navegacao.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2pdf from 'html2pdf.js';
import { SharedModule } from 'primeng/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CalculadoraService } from '../calculadora.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableResponsiveModule } from 'src/app/site/shared/mat-table-responsive/mat-table-responsive.module';
import { evaluate, parse } from 'mathjs';
import Swal from 'sweetalert2';

export interface Estados {
  nome: string;
  sigla: string;
}

const Estados = [
  { nome: "Acre", sigla: "AC" },
  { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" },
  { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" },
  { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" },
  { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" },
  { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" },
  { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" },
  { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" },
  { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" },
  { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" },
  { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" },
  { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" },
  { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" },
  { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" }
];

@Component({
  selector: 'app-calculadora',
  standalone: true,
  imports: [SafeHtmlPipe, CommonModule, SharedModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, AngularMaterialModule, ReactiveFormsModule, NgxMaskDirective,
    MatTableModule,
    MatSortModule,
    MatTableResponsiveModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [
    provideNgxMask(), // Provide the service
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculadora.component.html',
  styleUrl: './calculadora.component.scss'
})
export class CalculadoraComponent {
  @ViewChild('titulo') myDivRef!: ElementRef;

  liberar_calculadora: boolean = false;
  public id: number = 0;
  public titulo: SafeHtml = "";
  public conteudo: string = "";
  calculadoraFormulario: FormGroup;
  estados = Estados;
  calculadoraItens: any[];
  equacaoGeral: any;
  formulas: { alias: string, formula: string }[] = [];
  variaveis: { alias: string, valor: any }[] = [];
  mensagens: { condicao?: string, mensagem?: string, acao?: string, label_acao?: string, tipo_acao?: string }[] = [];
  valores = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    public cdr: ChangeDetectorRef,
    private location: Location,
    public navegacaoService: NavegacaoService,
    private calculadoraService: CalculadoraService,
    private elementRef: ElementRef
  ) {

  }

  ngOnInit() {


    this.calculadoraFormulario = new FormGroup({
      //nota_fiscal: new FormControl('', Validators.required),
      nota_fiscal: new FormControl(''),
      ocorrencia: new FormControl(''),
      emissao: new FormControl(''),
      remetente: new FormControl(''),
      destinatario: new FormControl(''),
      remetente_cnpj: new FormControl(''),
      destinatario_cnpj: new FormControl(''),
      ncm: new FormControl(''),
      cest: new FormControl(''),
    });

  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.getCalculadora(params['id']);
      }
    });
    this.cdr.detectChanges();
  }

  onSubmit() {
    console.log(this.calculadoraFormulario.value);
    if (this.calculadoraFormulario.valid) {
      console.log(this.calculadoraFormulario.value);
      // Lógica para enviar os dados do formulário
    }
  }

  voltar(): void {
    this.location.back();
  }

  getCalculadora(id) {
    this.loadingService.setLoading(true);

    this.calculadoraService.getCalculadora(id, (response) => {
      this.titulo = response.dados.titulo;
      if (response.status) {
        this.calculadoraItens = response.dados.itens;

        response.dados.mensagens.forEach((element, index) => {
          this.mensagens.push({
            condicao: element.condicao,
            mensagem: element.mensagem,
            acao: element.acao,
            label_acao: element.label_acao,
            tipo_acao: element.tipo_acao
          });
        });

        this.calculadoraItens.forEach((element, index) => {
          this.valores[element.alias] = 0;

          this.variaveis.push({
            alias: element.alias,
            valor: Number('0')
          });

          this.formulas.push({
            alias: element.alias,
            formula: element.equacao
          });
        });

        this.equacaoGeral = response.dados.equacao;
        this.liberar_calculadora = true;
      } else {
        Swal.fire({
          icon: "error",
          text: response.message,
          draggable: true,
          confirmButtonColor: "#A9C92F",
          cancelButtonColor: "#d33",
          title: "Oops...",
          //footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
      this.loadingService.setLoading(false);
      this.cdr.detectChanges();
    });
  }

  mostrarMensagem(mensagem) {
alert(mensagem);
  }

  calcular(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    let id = (event.target as HTMLInputElement).id;
    let variaveis = '';
    

    this.variaveis.forEach((element, index) => {
      if (element.alias == id) {
        this.variaveis[index].valor = valor;
        this.valores[element.alias] = Number(valor);
      }

      if (variaveis != '') {
        variaveis += ',';
      }

      let valorVariavel = (this.variaveis[index].valor) ? this.variaveis[index].valor : 0;
      variaveis += this.variaveis[index].alias + '=' + valorVariavel;
    });

    try {
      let vars = this.parseVariaveis(variaveis);
      let scope = { ...vars };
      let resultado = '';
    
       
      // scope = { ...vars };
      // Object.keys(this.valores).forEach((element, valor) => {
      //   console.log("let " + element + "= " + this.valores[element] + ";");
      //     eval("let " + element + " = " + this.valores[element] + ";");
      // });

      // const ast3 = "if(a>b && a>0 && b>0) alert('oi'); ";
      // eval(ast3);

      this.formulas.forEach((element, index) => {
        if (element.formula) {
          resultado = evaluate(element.formula, scope);
          if (resultado) {
            document.getElementById(element.alias).innerHTML = parseFloat(resultado).toFixed(2).toString();
            this.variaveis.forEach((variavel) => {
              if (element.alias == variavel.alias) {
                this.variaveis[index].valor = Number(resultado.toString()).toFixed(2);
              }
            });
          }
        }
      });

      this.variaveis.forEach((element, index) => {
        if (element.alias == id) {
          this.variaveis[index].valor = valor;
        }

        if (variaveis != '') {
          variaveis += ',';
        }

        let valorVariavel = (this.variaveis[index].valor) ? this.variaveis[index].valor : 0;
        variaveis += this.variaveis[index].alias + '=' + valorVariavel;
      });

      vars = this.parseVariaveis(variaveis);
      scope = { ...vars };
      resultado = evaluate(this.equacaoGeral.formula, scope);
      if (resultado) {
        document.getElementById("equacaoGeral").innerHTML = (parseFloat(resultado) > 0) ? parseFloat(resultado).toFixed(2).toString() : '0';
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: 'Erro na expressão ou valores inválidos.',
        draggable: true,
        confirmButtonColor: "#A9C92F",
        cancelButtonColor: "#d33",
        title: "Oops...",
        //footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  }

  private parseVariaveis(input: string): { [key: string]: number } {
    const vars: { [key: string]: number } = {};
    const entries = input.split(',').map(item => item.trim());

    entries.forEach(entry => {
      const [variavel, valor] = entry.split('=').map(e => e.trim());
      if (variavel && valor) {
        vars[variavel] = Number(valor);
      }
    });
    return vars;
  }

  // tratarLinks() {
  //   let elements = this.elementRef.nativeElement.getElementsByTagName('a');

  //   for (let i = 0; i < elements.length; i++) {
  //     let element = elements[i];
  //     let url = element.getAttribute('href');
  //     element.removeAttribute('href');
  //     element.addEventListener('click', _ => { this.abrirConteudo(url) }, false);
  //   }
  // }

  async telaCheia() {
    this.navegacaoService.telaCheia(document.getElementById('element-to-print').innerHTML);
  }
}
