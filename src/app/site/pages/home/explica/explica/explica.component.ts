import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavegacaoService } from 'src/app/site/services/navegacao.service';
import { SelecionarEstadoComponent } from 'src/app/site/shared/modal/selecionar-estado/selecionar-estado.component';
import { AtualizacaoComponent } from '../../atualizacao/atualizacao/atualizacao.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

interface Imposto {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-explica',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTabsModule, MatListModule, MatDividerModule],
  templateUrl: './explica.component.html',
  styleUrl: './explica.component.scss'
})
export class ExplicaComponent {
  selectedValue: string;

  impostos: Imposto[] = [
    { value: 'icms', viewValue: 'ICMS' },
    { value: 'ipi', viewValue: 'IPI' },
    { value: 'iss', viewValue: 'ISS' },
  ];

}
