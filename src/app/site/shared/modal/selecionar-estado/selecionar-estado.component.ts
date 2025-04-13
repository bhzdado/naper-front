import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    MatRadioButton,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, ReactiveFormsModule, CommonModule, MatDividerModule, MatCardModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './selecionar-estado.component.html',
  styleUrl: './selecionar-estado.component.scss'
})


export class SelecionarEstadoComponent implements OnInit {

  form: FormGroup;
  allColors: string[];
  defaultSelections: string[];
  selectedValue: string;

  estados: estado[] = [
    { value: "Acre", viewValue: "AC" },
    { value: "Alagoas", viewValue: "AL" },
    { value: "Amapá", viewValue: "AP" },
    { value: "Amazonas", viewValue: "AM" },
    { value: "Bahia", viewValue: "BA" },
    { value: "Ceará", viewValue: "CE" },
    { value: "Distrito Federal", viewValue: "DF" },
    { value: "Espírito Santo", viewValue: "ES" },
    { value: "Goiás", viewValue: "GO" },
    { value: "Maranhão", viewValue: "MA" },
    { value: "Mato Grosso", viewValue: "MT" },
    { value: "Mato Grosso do Sul", viewValue: "MS" },
    { value: "Minas Gerais", viewValue: "MG" },
    { value: "Pará", viewValue: "PA" },
    { value: "Paraíba", viewValue: "PB" },
    { value: "Paraná", viewValue: "PR" },
    { value: "Pernambuco", viewValue: "PE" },
    { value: "Piauí", viewValue: "PI" },
    { value: "Rio de Janeiro", viewValue: "RJ" },
    { value: "Rio Grande do Norte", viewValue: "RN" },
    { value: "Rio Grande do Sul", viewValue: "RS" },
    { value: "Rondônia", viewValue: "RO" },
    { value: "Roraima", viewValue: "RR" },
    { value: "Santa Catarina", viewValue: "SC" },
    { value: "São Paulo", viewValue: "SP" },
    { value: "Sergipe", viewValue: "SE" },
    { value: "Tocantins", viewValue: "TO" }
  ];

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SelecionarEstadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.allColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    this.defaultSelections = ['red', 'green', 'blue'];

    this.form = this.formBuilder.group({
      selectedColors: []
    });
  }

  submit(form) {
    this.dialogRef.close(form.value);
  }

  selecionarEstado(estado) {
    alert(estado);
  }
}
