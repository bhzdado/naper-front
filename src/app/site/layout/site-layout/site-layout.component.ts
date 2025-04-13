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
import { LoaderService } from '../../services/loader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MobileSubmenuComponent } from '../mobile-submenu/mobile-submenu.component';

@Component({
  selector: 'app-site-layout',
  //standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss',
  // providers: [{ provide: MatStepperIntl }],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('hamburguerX', [
      /*
        state hamburguer => is the regular 3 lines style.
        states topX, hide, and bottomX => used to style the X element
      */
      state('hamburguer', style({})),
      // style top bar to create the X
      state(
        'topX',
        style({
          transform: 'rotate(45deg)',
          transformOrigin: 'left',
          margin: '6px',
        })
      ),
      // hides element when create the X (used in the middle bar)
      state(
        'hide',
        style({
          opacity: 0,
        })
      ),
      // style bottom bar to create the X
      state(
        'bottomX',
        style({
          transform: 'rotate(-45deg)',
          transformOrigin: 'left',
          margin: '6px',
        })
      ),
      transition('* => *', [
        animate('0.2s'), // controls animation speed
      ]),
    ]),
  ],
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {
  loading: boolean;
  isMenuOpen = false;


  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private loadingService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.loading = true;
  }

  isHamburguer = true;
  isHamburguer_menu = true;
  mostra_telefone() {
    if (!this.isHamburguer_menu) {
      this.mostra_menu();
    }
    let elementRef: ElementRef<HTMLElement>
    const element = document.getElementById("mat-icon-phone");

    if (element.style.display === "none") {
      $('.icon-bar-telefone').removeClass("icon-bar");
      element.style.display = "block";
    } else {
      $('.icon-bar-telefone').addClass("icon-bar");
      element.style.display = "none";
    }

    this.isHamburguer = !this.isHamburguer;
  }

  mostra_menu() {
    if (!this.isHamburguer) {
      this.mostra_telefone();
    }
    this.isHamburguer_menu = !this.isHamburguer_menu;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

    let scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/jquery.min.js");
    scriptElement.onload = () => {
      scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/bootstrap.bundle.min.js");
      scriptElement.onload = () => {
        scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/easing.min.js");
        scriptElement.onload = () => {
          scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/waypoints.min.js");
          scriptElement.onload = () => {
            scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/owl.carousel.min.js");
            scriptElement.onload = () => {
              scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/main.js");

              scriptElement.onload = () => {
                this.loading = false;
                this.changeDetectorRef.detectChanges();
              }
            }
          }
        }
      }
    }


  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public loadJsScript(renderer: Renderer2, src: string): HTMLScriptElement {
    const script = renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    renderer.appendChild(this.document.body, script);
    return script;
  }
}
