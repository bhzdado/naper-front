import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { AuthStateService } from 'src/app/services/auth/auth-state.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { environment } from 'src/environments/environment';
import { EsqueciSenhaComponent } from '../esqueci-senha/esqueci-senha.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-autenticar',
  standalone: true,
  imports: [NgxCaptchaModule, CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './autenticar.component.html',
  styleUrl: './autenticar.component.scss'
})
export class AutenticarComponent implements OnInit {
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  kepceHidden: boolean = true;
  siteKey: any = environment.recaptcha.siteKey;
  recaptchaError: boolean = false;
  recaptchaVerificado: boolean = false;

  public formControlAuthAntigo = new FormControl();

  public texto_autenticacao = "Validando informações...";
  processando: boolean = false;
  submited: boolean = false;

  public formAuthAntigo: any;

  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private authState: AuthStateService,
    private token: TokenService,
    private router: Router,
    public dialogRef: MatDialogRef<AutenticarComponent>,
    private dialog: MatDialog
  ) {

    let fiscal3_usuario_email = localStorage.getItem('fiscal3.usuario.email');
    let user_email = '';

    if (fiscal3_usuario_email) {
      user_email = atob(fiscal3_usuario_email);
    }

    this.loginForm = this.fb.group({
      email: [user_email, Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required],
      remember: [user_email ? true : false]
    });
  }

  ngOnInit() {
    this.formAuthAntigo = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
      remember: new FormControl(''),
    });

    this.kepceHidden = false;
    this.loginForm.get('recaptcha').setValidators(Validators.required);

  }

  
  esqueciSenha() {
    let dialogRef = this.dialog.open(EsqueciSenhaComponent, {
      width: '35vw',
      maxWidth: '55vw',
      height: '25vw',
    });
  }

  onSubmit() {
    this.submited = true;

    this.processando = true;
    this.recaptchaError = false;

    // if (!this.recaptchaVerificado) {
    //   this.recaptchaError = true;
    //   this.processando = false;

    //   this.kepceHidden = false;
    //   this.loginForm.get('recaptcha').setValidators(Validators.required);
    //   this.captchaElem.resetCaptcha();

    //   return;
    // } else {
      this.recaptchaVerificado = false;

      this.authService.signin(this.loginForm.value).subscribe(
        (result) => {
          localStorage.removeItem('usuario');
          localStorage.removeItem('access_token');
          localStorage.removeItem('api_token');

          localStorage.setItem('usuario', btoa(JSON.stringify(result.user)));
          this.responseHandler(result);

          this.texto_autenticacao = "Credenciais validas.";

          if (this.loginForm.value.remember) {
            localStorage.setItem('fiscal3.usuario.email', btoa(result.user.email));
          }
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
                //(<HTMLFormElement>document.getElementById('formAutenticarAuthAntigo')).submit();

                this.dialogRef.close(false);
                //window.location.href = "/auth/login";
                let rota = localStorage.getItem('rota');
                
                if (rota) {
                  window.location.href = environment.urlSite + rota.split('#')[0];
                  // try {
                  //   this.router.navigate([rota]);
                  //   localStorage.removeItem('rota');
                  // } catch (e) {
                  //   this.router.navigate(["/"]);
                  // }
                } else {
                  window.location.href = environment.urlSite;
                  //this.router.navigate(["/"]);
                }
              }, 1000);
            });

        }
      );
    // }
  }
  // Handle response
  responseHandler(data: any) {
    this.token.handleData(data.authorization.access_token);
    localStorage.setItem('api_token', data.authorization.api_token);
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
}
