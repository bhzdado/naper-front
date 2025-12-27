import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { CommonModule, DecimalPipe, formatDate, Location } from '@angular/common';
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
import { NgxMaskDirective, optionsConfig, provideNgxMask } from 'ngx-mask';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableResponsiveModule } from 'src/app/site/shared/mat-table-responsive/mat-table-responsive.module';
import { evaluate, number, parse } from 'mathjs';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { DatepickerMonthYearComponent } from './datepicker-month-year/datepicker-month-year.component';
import { DatepickerFullDateComponent } from './datepicker-full-date/datepicker-full-date.component';
import { NgxCurrencyDirective, NgxCurrencyInputMode, provideEnvironmentNgxCurrency } from "ngx-currency";
import { Parser } from 'expr-eval';

const noop = () => {
};

const maskConfig: optionsConfig = {
  thousandSeparator: ' ', // use space as thousand separator
  decimalMarker: ',',    // use comma as decimal marker
  leadZero: true
};

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
  imports: [CommonModule, SharedModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, AngularMaterialModule, ReactiveFormsModule, NgxMaskDirective,
    MatTableModule,
    MatSortModule,
    MatTableResponsiveModule,
    MatButtonModule,
    MatIconModule, MatDatepickerModule, DatepickerMonthYearComponent,
    DatepickerFullDateComponent, NgxCurrencyDirective

  ],
  providers: [
    provideNgxMask(maskConfig),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculadora.component.html',
  styleUrl: './calculadora.component.scss'
})
export class CalculadoraComponent {
  @ViewChild('titulo') myDivRef!: ElementRef;

  step = signal(0);

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
  labels = [];

  panelDisabled: boolean = true;

  public mask = {
    guide: true,
    showMask: true,
    // keepCharPositions : true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoaderService,
    public cdr: ChangeDetectorRef,
    private location: Location,
    public navegacaoService: NavegacaoService,
    private calculadoraService: CalculadoraService,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {


    this.calculadoraFormulario = new FormGroup({
      //nota_fiscal: new FormControl('', Validators.required),
      nota_fiscal: new FormControl(''),
      ocorrencia: new FormControl(''), //,Validators.required
      emissao: new FormControl(''),
      remetente: new FormControl(''), //, Validators.required
      destinatario: new FormControl(''), //, Validators.required
      remetente_cnpj: new FormControl(''),
      destinatario_cnpj: new FormControl(''),
      ncm: new FormControl(''),
      cest: new FormControl(''),
      itens: this.fb.group({})
    });

  }

  adicionarItem(nomeDoCampo: string) {
    const itensGroup = this.calculadoraFormulario.get('itens') as FormGroup;

    // Verifica se o campo já existe para não sobrescrever
    if (!itensGroup.contains(nomeDoCampo)) {
      itensGroup.addControl(nomeDoCampo, new FormControl('') );
    }
  }

  get itensControls() {
    const itensGroup = this.calculadoraFormulario.get('itens') as FormGroup;
    return Object.keys(itensGroup.controls);
  }

  get itens(): FormArray<FormControl<string | null>> {
    return this.calculadoraFormulario.get('itens') as FormArray<FormControl<string | null>>;
  }

  get ocorrenciaControl() {
    return this.calculadoraFormulario.get('ocorrencia') as FormControl;
  }

  get emissaoControl() {
    return this.calculadoraFormulario.get('emissao') as FormControl;
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
      this.loadingService.setLoading(true);
      this.cdr.detectChanges();

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

        let labelsDinamicos = [];

        this.calculadoraItens.forEach((element, index) => {
          this.valores[element.alias] = 0;

          this.calculadoraItens[index].label = this.sanitizer.bypassSecurityTrustHtml(element.label);

          this.variaveis.push({
            alias: element.alias,
            valor: Number('0')
          });

          this.formulas.push({
            alias: element.alias,
            formula: element.equacao
          });

          this.adicionarItem(element.alias);
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
          //title: "Oops...",
          //footer: '<a href="#">Why do I have this issue?</a>'
        });
      }
      this.cdr.detectChanges();
      //this.loadingService.setLoading(false);

      this.cdr.detectChanges();
    });
  }

  handleDynamicClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the clicked element is an anchor tag or has a specific class/attribute
    if (target.tagName.toLowerCase() === 'a' && target.classList.contains('external-link')) {
      // Prevent default navigation if you want to control the exact window.open parameters
      // event.preventDefault();

      const url = target.getAttribute('href');
      if (url) {
        // Use the native window.open method
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  mostrarMensagem(mensagem) {
    alert(mensagem);
  }

  convertStringToJson(dataString: string): any {
    const result: { [key: string]: any } = {};

    // 1. Dividir a string em pares chave-valor pela vírgula principal
    const pairs = dataString.split(';');

    for (const pair of pairs) {
      // 2. Dividir cada par pela primeira ocorrência de '='
      const [key, valueString] = pair.split('=').map(item => item.trim());

      // 3. Tratar o valor:
      let value: any;

      // Substituir a vírgula decimal (formato europeu) por ponto decimal (formato americano)

      const standardizedValueString = valueString.replace('.', '').replace(',', '.');

      // Tentar converter para número, tratando casos especiais como 'NaN'
      if (standardizedValueString === 'NaN') {
        value = NaN; // O JSON.stringify() converterá NaN para 'null', mas em JS/TS é NaN
      } else if (!isNaN(parseFloat(standardizedValueString))) {
        value = parseFloat(standardizedValueString);
      } else if (standardizedValueString === 'true' || standardizedValueString === 'false') {
        value = Boolean(standardizedValueString);
      } else {
        value = valueString; // Manter como string se não for número ou booleano
      }

      result[key] = value;
    }

    // Retorna o objeto JavaScript. Você pode usar JSON.stringify(result) se precisar da string JSON formatada.
    return result;
  }

  evaluateDynamicExpression(expressionString: string, variables: { [key: string]: number }) {
    // const expressionString = 'a + b * c';
    // const variables = { a: 10, b: 5, c: 2 };

    try {
      // Parse and evaluate immediately
      const result = Parser.evaluate(expressionString, variables);
      // console.log(variables);
      // console.log(`The result of ${expressionString} is: ${result}`); // Output: 20
      return result;
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return null;
    }
  }

  verificarExpressao(data: Record<string, any>, expression: string): boolean {
    try {
      // Extrai os nomes das chaves para servir como nomes de argumentos da função
      const keys = Object.keys(data);
      const values = Object.values(data);

      // Cria uma nova função dinâmica:
      // new Function('a', 'b', 'return a > b && a > 0 && b > 0')
      const dynamicFn = new Function(...keys, `return ${expression}`);

      // Executa a função passando os valores correspondentes
      return dynamicFn(...values);
    } catch (error) {
      console.error("Erro ao avaliar expressão:", error);
      return false;
    }
  }

  calcular(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    let id = (event.target as HTMLInputElement).id;
    let variaveis = '';
    let continuar = true;

    this.variaveis.forEach((element, index) => {
      if (element.alias == id) {
        this.variaveis[index].valor = valor;
        this.valores[element.alias.toLowerCase()] = parseFloat(valor);


      }

      if (variaveis != '') {
        variaveis += ';';
      }

      let valorVariavel = (this.variaveis[index].valor) ?? 0;
      variaveis += this.variaveis[index].alias + '=' + valorVariavel;
    });

    //resultado = this.evaluateDynamicExpression(this.mensagens, vars);

    try {
      let vars = this.convertStringToJson(variaveis); //this.parseVariaveis(variaveis);
      let scope = { ...vars };
      let resultado = 0;
      // console.log(vars);

      // scope = { ...vars };
      // Object.keys(this.valores).forEach((element, valor) => {
      //   console.log("let " + element + "= " + this.valores[element] + ";");
      //     eval("let " + element + " = " + this.valores[element] + ";");
      // });

      // const ast3 = "if(a>b && a>0 && b>0) alert('oi'); ";
      // eval(ast3);

      this.formulas.forEach((element, index) => {
        if (element.formula) {
          // console.log(vars);
          resultado = this.evaluateDynamicExpression(element.formula.toLowerCase(), vars); //evaluate(element.formula, vars);
          // console.log('Resultado ' + element.formula + ': ' + resultado);
          if (resultado) {
            const valorFormatado: string = resultado.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            document.getElementById(element.alias).innerHTML = valorFormatado;
            this.variaveis.forEach((variavel) => {
              if (element.alias == variavel.alias) {
                this.variaveis[index].valor = valorFormatado;
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
          variaveis += ';';
        }

        let valorVariavel = (this.variaveis[index].valor) ?? 0;
        variaveis += this.variaveis[index].alias + '=' + valorVariavel;
      });

      vars = this.convertStringToJson(variaveis);
      scope = { ...vars };
      resultado = evaluate(this.equacaoGeral.formula, scope);
      if (resultado) {
        document.getElementById("equacaoGeral").innerHTML = ((resultado) > 0) ? (resultado).toFixed(2).toString() : '0';
      }


      this.mensagens.forEach((element, index) => {
        if (element.condicao) {
          if (this.verificarExpressao(this.convertStringToJson(variaveis), element.condicao.toLowerCase())) {
            if (this.mensagens[index].acao != '') {
              Swal.fire({
                html: element.mensagem + '<br><br>Caso os valores estejam corretos você será redirecionado, ao contrário, favor preencher com os valores corretos. ',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, estão corretos!',
                cancelButtonText: 'Não, irei preencher novamente.',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.navegacaoService.navigateByLocation(this.mensagens[index].acao);
                } else {
                  const inputs = document.getElementsByClassName('item-calculadora') as HTMLCollectionOf<HTMLInputElement>;
                  for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = '0,00';
                  }

                  (document.getElementById('a') as HTMLInputElement).focus();
                }
              });
            } else {
              Swal.fire({
                icon: "error",
                html: element.mensagem,
                draggable: true,
                confirmButtonColor: "#A9C92F",
                cancelButtonColor: "#d33",
                //title: "Oops...",
                //footer: '<a href="#">Why do I have this issue?</a>'
              }).then((result) => {
                (event.target as HTMLInputElement).value = '0,00';
                (event.target as HTMLInputElement).focus();

              });
            }
          }
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: 'Erro na expressão ou valores inválidos.',
        draggable: true,
        confirmButtonColor: "#A9C92F",
        cancelButtonColor: "#d33",
        //title: "Oops...",
        //footer: '<a href="#">Why do I have this issue?</a>'
      });
    }

    if (valor == '0,00' || valor == '') {
      (event.target as HTMLInputElement).value = '0,00';
    }
  }

  private parseVariaveis(input: string): { [key: string]: number } {
    const vars: { [key: string]: number } = {};
    const entries = input.split(',').map(item => item.trim());

    entries.forEach(entry => {
      const [variavel, valor] = entry.split('=').map(e => e.trim());
      if (variavel && valor) {
        vars[variavel] = parseFloat(valor);
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

  validaProximaEtapa() {
    if (this.calculadoraFormulario.valid) {
      this.panelDisabled = false;
    } else {
      this.panelDisabled = true;
    }
  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.validaProximaEtapa();

    if (!this.panelDisabled) {
      this.step.update(i => i + 1);
    } else {
      Swal.fire({
        icon: "error",
        text: 'Para prosseguir é necessário preencher pelo menos os dados obrigatórios destacados com (*).',
        draggable: true,
        confirmButtonColor: "#A9C92F",
        cancelButtonColor: "#d33",
        //title: "Oops...",
        //footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  }

  private onChangeCallback: (_: any) => void = noop;

  onMonthSelected(normalizedMonthAndYear: DateTime, datepicker: MatDatepicker<DateTime>, campo: string) {
    let ctrlValue = "";
    switch (campo) {
      case 'ocorrencia':
        ctrlValue = DateTime.fromObject({
          month: normalizedMonthAndYear.month,
          year: normalizedMonthAndYear.year,
        });

        const formattedDate = formatDate(ctrlValue, 'MM/yyyy', 'en-US');
        this.calculadoraFormulario.get('ocorrencia').setValue(formattedDate);
        break;
      case 'emissao':
        ctrlValue = DateTime.fromObject({
          month: normalizedMonthAndYear.month,
          year: normalizedMonthAndYear.year,
          day: normalizedMonthAndYear.day
        });

        this.calculadoraFormulario.get('emissao').setValue(ctrlValue);
        break;
    }

    datepicker.close(); // Fecha o seletor após a seleção
  }

  onDateSelected(event: Date, datepicker: MatDatepicker<DateTime>, campo: string) {
    let ctrlValue = "";
    switch (campo) {
      case 'ocorrencia':
        const formattedDate = formatDate(event, 'MM/yyyy', 'en-US');
        this.calculadoraFormulario.get('ocorrencia').setValue(formattedDate);
        break;
      case 'emissao':
        this.calculadoraFormulario.get('emissao').setValue(event);
        break;
    }

    datepicker.close(); // Fecha o seletor após a seleção
  }

  todate(event: Event, campo) {
    let inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length == 6) {
      inputValue = inputValue.substr(0, 2) + '/' + inputValue.substr(-4)
    }

    this.calculadoraFormulario.get(campo).setValue(new DateTime(inputValue));
  }

  prevStep() {
    this.step.update(i => i - 1);
  }

  clearInput(event: any) {
    let valor = (event.target as HTMLInputElement).value;
    let id = (event.target as HTMLInputElement).id;

    if (valor == '0,00')
      (event.target as HTMLInputElement).value = "";

  }
}
