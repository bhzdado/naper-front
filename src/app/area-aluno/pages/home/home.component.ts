import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { Observable } from '@ckeditor/ckeditor5-utils';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AreaAlunoService } from 'src/app/core/pages/provas/area-aluno.service';
import { ProvaLiberada } from 'src/app/core/pages/provas/prova-liberada';
import { LoaderService } from 'src/app/services/loader.service';
import Utils from 'src/app/shared/utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule, AngularMaterialModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, CommonModule, NgFor, CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})

@Injectable()

export default class HomeComponent implements OnInit, OnDestroy {
  provas_liberadas: BehaviorSubject<ProvaLiberada[]> = new BehaviorSubject<ProvaLiberada[]>([]);
  ultimas_avalaiacoes: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  total_avalaiacoes_realizadas: number = 0;
  aproveitamento: number = 0;

  provas: ProvaLiberada[] = [];

  pesquisando: boolean = false;
  qtd_provas_liberadas: number = 0;
  qtd_atual_de_provas: number = 0;
  verifica_provas_liberadas_id: any = null;
  verifica_tempo_id: any = null;
  tempo_para_bloqueio_prova: any = [];
  intervalTotalAvaliacoes: any;

  constructor(
    private loadingService: LoaderService,
    private areaAlunoService: AreaAlunoService,
    private toastr: ToastrService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.getProvasLiberadas();
    this.getUltimasAvalaiacoes();
    this.getTotalAvalaiacoesRealizadas();
    this.getAproveitamento();

    this.verifica_provas_liberadas_id = setInterval(() => {
      this.getProvasLiberadas(false);
    }, 60000);

    this.verifica_tempo_id = setInterval(() => {
      this.provas.forEach((element: any, index: any) => {
        this.calculaTempoBloqueioProva(index);
      });

    }, 1000);
  }

  ngOnDestroy() {
    if (this.verifica_provas_liberadas_id) {
      clearInterval(this.verifica_provas_liberadas_id);
    }

    if (this.verifica_tempo_id) {
      clearInterval(this.verifica_tempo_id);
    }
  }

  arredondar(numero) {
    if (!numero) return numero;
    return Math.trunc(numero.replace(',', '.'));
  }

  getValueCell(id, quantidade = 6) {
    return Utils.padLeft(id, "0", quantidade);
  }

  getTotalAvalaiacoesRealizadas() {
    this.areaAlunoService.getTotalAvalaiacoesRealizadas().subscribe(function (response) {
      this.total_avalaiacoes_realizadas = this.getValueCell(response.dados.total_avalaiacoes_realizadas, 4);
    }.bind(this));
  }

  getAproveitamento() {
    this.areaAlunoService.aproveitamento().subscribe(function (response) {
      this.aproveitamento = response.dados.aproveitamento;
    }.bind(this));
  }

  getUltimasAvalaiacoes() {
    this.areaAlunoService.getUltimasAvalaiacoes().subscribe(function (response) {
      this.ultimas_avalaiacoes.next(response.dados);
    }.bind(this));
  }

  getProvasLiberadas(inicial: boolean = true) {
    this.areaAlunoService.minhasProvasLiberadas().subscribe(function (response) {
      if (response.length) {
        this.provas = response;
        this.provas_liberadas.next(response);
        this.qtd_provas_liberadas = response.length;

        if (!inicial) {
          if (this.qtd_atual_de_provas < this.qtd_provas_liberadas) {
            this.toastr.info("Uma nova prova foi liberada para você.");
          }
        }
        this.qtd_atual_de_provas = this.qtd_provas_liberadas;
      } else {
        this.provas = [];
        this.provas_liberadas.next([]);
        this.qtd_provas_liberadas = 0;
        this.qtd_atual_de_provas = 0;
      }
    }.bind(this));
  }

  calculaTempoBloqueioProva(index: any) {
    if (this.provas[index].range.end) {
      this.provas[index].tempo_ate_expiracao_formatado = Utils.msToTime(Utils.dateDifference(new Date(), new Date(this.provas[index].range.end)).diffInMilliseconds);
      this.tempo_para_bloqueio_prova[index] = Utils.msToTime(Utils.dateDifference(new Date(), new Date(this.provas[index].range.end)).diffInMilliseconds);

      this.provas_liberadas.next(this.provas);
    }
  }


  gerarPdf() {
    this.areaAlunoService.getTermoConclusaoProva(1).subscribe(function (response) {
      console.log(response);
    }.bind(this));
  }
}
