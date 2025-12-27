// Angular Import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { BajajChartComponent } from './bajaj-chart/bajaj-chart.component';
import { ChartDataMonthComponent } from './chart-data-month/chart-data-month.component';
import { DefaultService } from './default.service';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  // public method
  ListGroup = [
    {
      name: 'Bajaj Finery',
      profit: '10% Profit',
      invest: '$1839.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'TTML',
      profit: '10% Loss',
      invest: '$100.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Reliance',
      profit: '10% Profit',
      invest: '$200.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success'
    },
    {
      name: 'ATGL',
      profit: '10% Loss',
      invest: '$189.00',
      bgColor: 'bg-light-danger',
      icon: 'ti ti-chevron-down',
      color: 'text-danger'
    },
    {
      name: 'Stolon',
      profit: '10% Profit',
      invest: '$210.00',
      bgColor: 'bg-light-success',
      icon: 'ti ti-chevron-up',
      color: 'text-success',
      space: 'pb-0'
    }
  ];

  public total_provas_liberadas = 0;
  public total_provas_executadas_mes = 0;
  public total_provas_questoes_cadastradas = 0;

  constructor(
    private defaultService: DefaultService
  ) {

  }

  ngOnInit() {
    this.defaultService.getTotalAvaliacoesLiberadas().subscribe(function (response) {
      this.total_provas_liberadas = response.total_avaliacoes_liberadas;
    }.bind(this));

    this.defaultService.getTotalAvaliacoesExecutadasMes().subscribe(function (response) {
      this.total_provas_executadas_mes = response.total_provas_executadas_mes;
    }.bind(this));

    this.defaultService.getTotalQuestoesCadastradas().subscribe(function (response) {
      this.total_provas_questoes_cadastradas = response.total_provas_questoes_cadastradas;
    }.bind(this));
  }
}
