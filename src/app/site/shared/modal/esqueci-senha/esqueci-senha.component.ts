import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, inject, model, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AuthStateService } from 'src/app/services/auth/auth-state.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatDialogClose, ReactiveFormsModule, CommonModule, MatDividerModule, MatCardModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './esqueci-senha.component.html',
  styleUrl: './esqueci-senha.component.scss'
})
export class EsqueciSenhaComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authState: AuthStateService,
    public authService: AuthService,
    private loadingService: LoaderService,
    public dialogRef: MatDialogRef<EsqueciSenhaComponent>) {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    
  }

  recuperarSenha() {
    this.loadingService.setLoading(true);

    if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.loadingService.setLoading(false);
        return;
    }

    console.log(this.form.value);
    this.authService.enviaEmailRecuperarSenha(this.form.value).subscribe(
      (result) => {
        alert('oi 2');
        console.log(result);
        this.loadingService.setLoading(false);
      },
      (error) => {
        console.log(error);
        this.loadingService.setLoading(false);
        //this.processando = false;
      }
    );
  }

  cancelar() {
    this.dialogRef.close();
  }
}
