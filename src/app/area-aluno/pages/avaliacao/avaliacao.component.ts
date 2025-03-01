import { AsyncPipe, CommonModule, DOCUMENT, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProvaLiberada } from 'src/app/core/pages/provas/prova-liberada';
import { AreaAlunoService } from 'src/app/core/pages/provas/area-aluno.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { MatDialog } from '@angular/material/dialog';
import Utils from 'src/app/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatStepperIntl, MatStepperModule } from '@angular/material/stepper';
import { MatRadioChange } from '@angular/material/radio';
import { SafeHtmlPipe } from 'src/app/shared/pipes/SafeHtml.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';

export interface QuestaoAtual {
  id?: number,
  enunciado: any,
  peso?: any,
  alternativas?: any
}

@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule, AngularMaterialModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, CommonModule, CommonModule, MatSlideToggleModule, RouterLink, MatStepperModule, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avaliacao.component.html',
  styleUrl: './avaliacao.component.scss',
  providers: [{ provide: MatStepperIntl }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class AvaliacaoComponent implements OnInit, AfterViewInit, OnDestroy {
  FULL_DASH_ARRAY = 283;
  TIME_LIMIT = 20;
  WARNING_THRESHOLD = 10;
  ALERT_THRESHOLD = 5;

  COLOR_CODES = {
    info: {
      color: "green"
    },
    warning: {
      color: "orange",
      threshold: this.WARNING_THRESHOLD
    },
    alert: {
      color: "red",
      threshold: this.ALERT_THRESHOLD
    }
  };

  timeLeft = 0;
  timePassed = 0;
  timerInterval = null;
  remainingPathColor = this.COLOR_CODES.info.color;
  contador_style_image = 0;
  style = null;

  avaliacao: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  //_avaliacao = Observable<any[]>
  _avaliacao: any = null;
  prova_liberada_id: number = 0;
  quantidade_total_questao: number = 0;

  _questoes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  questoesObs: Observable<any> = this._questoes.asObservable();

  _questaoAtual: BehaviorSubject<QuestaoAtual> = new BehaviorSubject<QuestaoAtual>(null);
  questaoAtualObs: Observable<QuestaoAtual> = this._questaoAtual.asObservable();

  gabaritos: any[] = [];

  respostas: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  _avaliacao_iniciada: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  avaliacao_iniciadaObs: Observable<boolean> = this._avaliacao_iniciada.asObservable();

  _carregando: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  carregandoObs: Observable<boolean> = this._carregando.asObservable();

  atualizaSessao: any = null;

  prova_usuario_id: number = 0;

  constructor(
    private areaAlunoService: AreaAlunoService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private elRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    public authService: AuthService
  ) {
  }

  ngOnInit() {
    this.prova_liberada_id = Number(this.activatedRoute.snapshot.paramMap.get('prova_liberada_id')) ?? 0;
    if (!this.prova_liberada_id) {
      const dialogRef = this.dialog.open(DialogModalComponent, {
        width: '400px',
        data: {
          titulo: '',
          conteudo: 'Nenhuma prova encontrada.',
          tipo: "erro"
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/areaAluno']);
      });
    } else {
      this.getProvaLiberada(this.prova_liberada_id);
    }
  }

  ngAfterViewInit() {
    let mt =
      (document.getElementsByClassName('mat-tab-labels'))[0] as HTMLElement;
    mt.style.display = 'grid';
    mt.style.gridTemplateColumns = 'repeat(auto-fit, minmax(3em, 1fr))'
  }

  public ngOnDestroy(): void {
    if (this.atualizaSessao) {
      clearInterval(this.atualizaSessao);
    }
  }

  getProvaLiberada(id: number) {
    this.areaAlunoService.getAvaliacao(id).subscribe(function (response) {
      if (response.status) {
        //this.avaliacao.next(response.dados);
        this._avaliacao = response.dados;
        this.TIME_LIMIT = this._avaliacao.tempo_execucao * 60;

        this.WARNING_THRESHOLD = (this.TIME_LIMIT * 30) / 100;
        this.ALERT_THRESHOLD = (this.TIME_LIMIT * 10) / 100;

        this.COLOR_CODES.warning.threshold = this.WARNING_THRESHOLD;
        this.COLOR_CODES.alert.threshold = this.ALERT_THRESHOLD;

        this.timeLeft = this.TIME_LIMIT;
        //this.startTimer();
      }
    }.bind(this));
  }

  finalizarAvaliacao() {
    let nao_respondido = "";

    if (this._avaliacao.quantidade_total_questoes != this.gabaritos.length) {
      this.questoesObs.forEach((questoes) => {
        questoes.forEach((element, index) => {
          let found = this.gabaritos.find((gab) => gab.questao_id == element.id);

          if (found === undefined) {
            nao_respondido += (nao_respondido) ? ", " : "";
            nao_respondido += (index + 1);
          }
        });
      });

      if (nao_respondido) {
        const dialogRef = this.dialog.open(DialogModalComponent, {
          width: '460px',
          data: {
            titulo: "Finalizar Avaliação",
            conteudo: "As questões <b>" + nao_respondido + "</b> não foram respondidas.<br>Deseja realmente finalizar essa avaliação?",
            tipo: "confirmacao",
            cancelText: 'Continuar Respondendo',
            confirmText: 'Finalizar Avaliação'
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.finalizar();
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(DialogModalComponent, {
        width: '460px',
        data: {
          titulo: "Finalizar Avaliação",
          conteudo: "Deseja realmente finalizar essa avaliação?",
          tipo: "confirmacao",
          cancelText: 'Continuar Respondendo',
          confirmText: 'Finalizar Avaliação'
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.finalizar();
        }
      });
    }
  }

  finalizar() {
    this._avaliacao_iniciada.next(false);
    this._carregando.next(true);

    this.areaAlunoService.finalizarAvaliacao(this.prova_usuario_id, { gabarito: this.gabaritos }).subscribe(
      (resp) => {
        clearInterval(this.atualizaSessao);
        const dialogRef = this.dialog.open(DialogModalComponent, {
          width: '400px',
          data: {
            titulo: 'PROVA FINALIZADA',
            conteudo: 'A sua nota nesta avaliação foi de ' + resp.dados.nota + '/' + resp.dados.valor + '.',
            tipo: "sucesso"
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['/areaAluno']);
        });
      });
  }

  iniciarAvaliacao() {
    this._avaliacao_iniciada.next(false);
    this._carregando.next(true);

    this.areaAlunoService.getQuestoesAvaliacao(this.prova_liberada_id).subscribe(
      (response) => {
        this._questoes.next(response.dados);

        this.areaAlunoService.iniciarAvaliacao(this.prova_liberada_id).subscribe(
          (resp) => {
            this.prova_usuario_id = resp.dados.id;
            this._carregando.next(false);
            this._avaliacao_iniciada.next(true);

            setTimeout(() => {
              this.startTimer();
            }, 2000);

            this.atualizaSessao = setInterval(() => {
              this.authService.refreshToken();
            }, 300000);
          });
      });
  }

  mostrarQuestao(questao) {
    this._questaoAtual.next(questao);
  }

  alternativaMarcada(questao, $event: MatRadioChange) {
    this.gabaritos = this.gabaritos.filter(item => item.questao_id !== questao.id);

    this.gabaritos.push({
      'questao_id': questao.id,
      'alternativa_selecionada_id': $event.value,
      'dados': {
        'enunciado': questao.enunciado,
        'alternativas': questao.alternativas
      },
    });

    document.getElementById("respondido_" + questao.id).style.visibility = "visible";
  }

  getImageSize(url: string): Observable<any> {
    return new Observable(observer => {
      var image = new Image();
      image.src = url;

      image.onload = function (event) {
        let loadedImage: any = event.currentTarget;
        let width = loadedImage.width;

        observer.next(width);
        observer.complete();
      }
    });
  }

  getConteudoHtml(html: any): Observable<any> {
    return new Observable(observer => {
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(html, "text/html");

      var figure = htmlDoc.querySelector('figure');
      if (figure) {
        var img = figure.querySelector('img');

        if (img) {
          this.style = figure.getAttribute('style');

          let width = 0;
          var image = new Image();
          image.src = img.getAttribute('src');

          this.getImageSize(img.getAttribute('src')).subscribe(width => {

            let style = this.style.split(':');

            let newWidth = Number((width * Number(style[1].replace('%', '').replace(';', ''))) / 100);
            console.log(newWidth);

            let oldImage = '<img src="' + img.getAttribute('src') + '">';
            let newImage = '<img src="' + img.getAttribute('src') + '" ' + style[0] + '="' + newWidth + '">';

            html = html.toString().replace(oldImage, newImage);

            observer.next(this.sanitizer.bypassSecurityTrustHtml(html));
            observer.complete();
          });
        }
      } else {
        observer.next(this.sanitizer.bypassSecurityTrustHtml(html));
        observer.complete();
      }
    });
  }

  getHtml(html, indice) {
    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(html, "text/html");

    var figure = htmlDoc.querySelector('figure');
    if (figure) {
      var img = figure.querySelector('img');

      if (img) {
        this.style = figure.getAttribute('style');

        var image = new Image();
        image.src = img.getAttribute('src');


        this.getImageSize(img.getAttribute('src')).subscribe(width => {

          let style = this.style.split(':');

          let newWidth = Number((width * (Number(style[1].replace('%', '').replace(';', '')))) / 100);

          let oldImage = '<img src="' + img.getAttribute('src') + '">';
          let newImage = '<img src="' + img.getAttribute('src') + '" ' + style[0] + '="' + newWidth + '">';

          html = html.toString().replace(oldImage, newImage);
          document.getElementById(indice).innerHTML = html;
        });
      }
    }

    let htmlString = this.sanitizer.bypassSecurityTrustHtml(html);
    return htmlString;
  }

  getValueCell(id: any) {
    return Utils.padLeft(id, "0", 6);
  }

  onTimesUp() {
    clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      document.getElementById("base-timer-label").innerHTML = this.formatTime(
        this.timeLeft
      );
      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);

      if (this.timeLeft === 0) {
        this.onTimesUp();
      }
    }, 1000);
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds: any = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = this.COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      document.getElementById("btn-finalizar").classList.remove("border-orange");
      document.getElementById("btn-finalizar").classList.add("border-red");

      document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
      document.getElementById("base-timer-path-remaining").classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document.getElementById("btn-finalizar").classList.remove("border-green");
      document.getElementById("btn-finalizar").classList.add("border-orange");

      document.getElementById("base-timer-path-remaining").classList.remove(info.color);
      document.getElementById("base-timer-path-remaining").classList.add(warning.color);
    }
  }

  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * this.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }

}
