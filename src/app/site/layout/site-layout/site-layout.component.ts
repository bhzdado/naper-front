import { AsyncPipe, CommonModule, DOCUMENT, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProvaLiberada } from 'src/app/core/pages/provas/prova-liberada';
import { AreaAlunoService } from 'src/app/core/pages/provas/area-aluno.service';
import { DialogModalComponent } from 'src/app/shared/dialog-modal/dialog-modal/dialog-modal.component';
import { MatDialog } from '@angular/material/dialog';
import Utils from 'src/app/shared/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatStepperIntl, MatStepperModule } from '@angular/material/stepper';
import { MatRadioChange } from '@angular/material/radio';
import { SafeHtmlPipe } from 'src/app/shared/pipes/SafeHtml.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatProgressBarModule, MatMenuModule, SharedModule, AngularMaterialModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, CommonModule, CommonModule, MatSlideToggleModule, RouterLink, MatStepperModule, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss',
  providers: [{ provide: MatStepperIntl }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {
  public preloader = true;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

    let scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/bootstrap/js/bootstrap.bundle.min.js");
    scriptElement.onload = () => {
      scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/php-email-form/validate.js");
      scriptElement.onload = () => {
        scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/site-layout/assets/vendor/aos/aos.js");
        scriptElement.onload = () => {
          scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/glightbox/js/glightbox.min.js");
          scriptElement.onload = () => {
            scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/waypoints/noframework.waypoints.js");
            scriptElement.onload = () => {
              scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/purecounter/purecounter_vanilla.js");
              scriptElement.onload = () => {
                scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/swiper/swiper-bundle.min.js");
                scriptElement.onload = () => {
                  scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js");
                  scriptElement.onload = () => {
                    scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/vendor/isotope-layout/isotope.pkgd.min.js");
                    scriptElement.onload = () => {
                      scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/main.js");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    this.preloader = false;
  }

  public loadJsScript(renderer: Renderer2, src: string): HTMLScriptElement {
    const script = renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    renderer.appendChild(this.document.body, script);
    return script;
  }
}
