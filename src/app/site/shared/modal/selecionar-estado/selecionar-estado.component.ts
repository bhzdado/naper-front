import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, model, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

interface estado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-selecionar-estado',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatIconModule,
    MatDialogClose, ReactiveFormsModule, CommonModule, MatDividerModule, MatCardModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './selecionar-estado.component.html',
  styleUrl: './selecionar-estado.component.scss'
})


export class SelecionarEstadoComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  allColors: string[];
  defaultSelections: string[];
  estadoSelecionado: string;

  estados: estado[] = [
    { value: "Acre", viewValue: "acre" },
    { value: "Alagoas", viewValue: "alagoas" },
    { value: "Amapá", viewValue: "amapa" },
    { value: "Amazonas", viewValue: "amazonas" },
    { value: "Bahia", viewValue: "bahia" },
    { value: "Ceará", viewValue: "ceara" },
    { value: "Distrito Federal", viewValue: "distritofederal" },
    { value: "Espírito Santo", viewValue: "espiritosanto" },
    { value: "Goiás", viewValue: "goias" },
    { value: "Maranhão", viewValue: "maranhao" },
    { value: "Mato Grosso", viewValue: "matogrosso" },
    { value: "Mato Grosso do Sul", viewValue: "matogrossodosul" },
    { value: "Minas Gerais", viewValue: "minasgerais" },
    { value: "Pará", viewValue: "para" },
    { value: "Paraíba", viewValue: "paraiba" },
    { value: "Paraná", viewValue: "parana" },
    { value: "Pernambuco", viewValue: "pernambuco" },
    { value: "Piauí", viewValue: "piaui" },
    { value: "Rio de Janeiro", viewValue: "riodejaneiro" },
    { value: "Rio Grande do Norte", viewValue: "riograndedonorte" },
    { value: "Rio Grande do Sul", viewValue: "riograndedosul" },
    { value: "Rondônia", viewValue: "rondonia" },
    { value: "Roraima", viewValue: "roraima" },
    { value: "Santa Catarina", viewValue: "santacatarina" },
    { value: "São Paulo", viewValue: "saopaulo" },
    { value: "Sergipe", viewValue: "sergipe" },
    { value: "Tocantins", viewValue: "tocantins" }
  ];

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SelecionarEstadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    
  }

  onClick(event: MouseEvent) {
    const target = event.target as SVGPathElement;
    const estadoId = target.parentElement.id;

    if (estadoId) {
      this.selecionarEstado(estadoId);
    }
  }

  submit(form) {
    //this.dialogRef.close(form.value);
  }

  selecionarEstado(estado) {
    this.estadoSelecionado = estado;

    const estadoElement = document.getElementById(this.estadoSelecionado);
    let todos = estadoElement.parentElement.querySelectorAll('a');

    todos.forEach((element, indice) => {
      let estadoTmp = document.getElementById(element.id);
      estadoTmp.firstElementChild.classList.remove('marcado');
      estadoTmp.lastElementChild.classList.remove('text-marcado');
      estadoTmp.children[1].classList.remove('marcado');
    });

    if (estadoElement) {
      estadoElement.firstElementChild.classList.add('marcado');
      estadoElement.lastElementChild.classList.add('text-marcado');
      estadoElement.querySelector('.circle')?.classList.add('marcado');
    }

    console.log(`Estado clicado: ${this.estadoSelecionado}`);
  }
}
