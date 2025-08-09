import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SelecionarEstadoComponent } from '../../shared/modal/selecionar-estado/selecionar-estado.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavegacaoService } from '../../services/navegacao.service';


interface Imposto {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTabsModule, MatListModule, MatDividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  selectedValue: string;

  impostos: Imposto[] = [
    { value: 'icms', viewValue: 'ICMS' },
    { value: 'ipi', viewValue: 'IPI' },
    { value: 'iss', viewValue: 'ISS' },
  ];

  constructor(public dialog: MatDialog, public navegacaoService: NavegacaoService) { }

  abrirSelecaoEstado() {
    let dialogRef = this.dialog.open(SelecionarEstadoComponent, {
      panelClass: 'painel-seleciona-estado',
      // width: '40vw',
      // maxWidth: '40vw',
    });
    dialogRef.afterClosed().subscribe(result => {
      //alert('chosen colors: ' + JSON.stringify(result.selectedColors));
    });
  }

  abrirConteudo(id) {
    this.navegacaoService.navigateTo('conteudo/' + id);
  }

}
