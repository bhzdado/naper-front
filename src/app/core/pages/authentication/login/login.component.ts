import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthStateService } from 'src/app/services/auth/auth-state.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenService } from 'src/app/services/auth/token.service';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/services/auth/auth.interceptor.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SpinnerComponent } from 'src/app/theme/shared/components/spinner/spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha'
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatProgressBarModule, NgxCaptchaModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
  loginForm: FormGroup;

  public texto_autenticacao = "Validando informações...";
  public formAuthAntigo: any;
  public formControlAuthAntigo = new FormControl();

  processando: boolean = false;
  public logo: string = environment.logo;

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  kepceHidden: boolean = true;
  siteKey: any = environment.recaptcha.siteKey;
  recaptchaError: boolean = false;
  recaptchaVerificado: boolean = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private authState: AuthStateService,
    private token: TokenService,
    private dialog: MatDialog,
    private router: Router,
    private loadingService: LoaderService,
  ) {
    this.loadingService.setLoading(false);
    this.loginForm = this.fb.group({
      email: [],
      password: [],
      recaptcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.formAuthAntigo = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
    });

    this.kepceHidden = false;
    this.loginForm.get('recaptcha').setValidators(Validators.required);
  }

  handleReset() {
    this.recaptchaVerificado = false;
  }

  handleError() {
    this.recaptchaVerificado = false;
  }

  handleLoad() { }

  handleSuccess($event) {
    this.recaptchaVerificado = true;
  }

  onSubmit() {
    this.processando = true;
    this.recaptchaError = false;

    if (!this.recaptchaVerificado) {
      this.recaptchaError = true;
      this.processando = false;

      this.kepceHidden = false;
      this.loginForm.get('recaptcha').setValidators(Validators.required);
      this.captchaElem.resetCaptcha();

      return;
    } else {
      this.recaptchaVerificado = false;
      this.authService.signin(this.loginForm.value).subscribe(
        (result) => {
          localStorage.removeItem('usuario');
          localStorage.removeItem('access_token');
          localStorage.removeItem('api_token');

          localStorage.setItem('usuario', btoa(JSON.stringify(result.user)));
          this.responseHandler(result);

          this.texto_autenticacao = "Credenciais validas.";
        },
        (error) => {
          this.processando = false;
          this.kepceHidden = false;
          this.loginForm.get('recaptcha').setValidators(Validators.required);
          this.captchaElem.resetCaptcha();
          this.loginForm.value.recaptcha = "";
          this.recaptchaVerificado = false;
          //this.loginForm.reset();
        },
        () => {
          this.authState.setAuthState(true);

          this.formAuthAntigo.get('email').setValue(this.loginForm.value.email);
          this.formAuthAntigo.get('password').setValue(this.loginForm.value.password);

          //this.loginForm.reset();

          this.texto_autenticacao = "Buscando suas permissões...";

          this.authService.loadAclUser(this.authService.getUser()?.id).subscribe(
            (resultAcl) => {
              if (resultAcl.status == 1) {
                let acl = {
                  'role': resultAcl.dados.roles,
                  'permissions': resultAcl.dados.permissions
                }

                localStorage.setItem('usuarioAcl', btoa(JSON.stringify(acl)));
              }

              const settimeoutErro = setTimeout(() => {
                this.texto_autenticacao = "Seja bem-vindo...";
                (<HTMLFormElement>document.getElementById('formAutenticarAuthAntigo')).submit();

                // let rota = localStorage.getItem('rota');
                // if (rota) {
                //   try {
                //     this.router.navigate([rota]);
                //     localStorage.removeItem('rota');
                //   } catch (e) {
                //     this.router.navigate(["/"]);
                //   }
                // } else {
                //   this.router.navigate(["/"]);
                // }
              }, 1000);
            });

        }
      );
    }
  }
  // Handle response
  responseHandler(data: any) {
    this.token.handleData(data.authorization.access_token);
    localStorage.setItem('api_token', data.authorization.api_token);
  }

}
