import { Component, HostListener, OnInit } from '@angular/core';
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
import { AtualizacaoComponent } from './atualizacao/atualizacao/atualizacao.component';
import { ExplicaComponent } from './explica/explica/explica.component';
import { CommonModule } from '@angular/common';
import { CarrosselComponent } from '../../shared/carrossel/carrossel/carrossel.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTabsModule, MatListModule, 
    MatDividerModule, AtualizacaoComponent, ExplicaComponent, CarrosselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  isMobile: boolean = false;

  constructor(public dialog: MatDialog, public navegacaoService: NavegacaoService) { }

  ngOnInit(): void {
    this.isMobile = false;

    if(window.innerWidth < 1201){
      this.isMobile = true;
    }
  }

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
