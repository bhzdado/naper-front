import { AsyncPipe, CommonModule, DOCUMENT, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import * as $ from 'jquery';
import { LoaderService } from '../../services/loader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/services/auth/auth.service';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-site-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.scss',
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
  usuarioLogado = null;
  public cumprimento: string = 'Bom dia';
  public environment = environment;
  showHeader: boolean = true;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private elementRef: ElementRef<HTMLElement>,
    private router: Router, private headerService: HeaderService
  ) {
    this.loading = true;
    this.usuarioLogado = authService.getUser();

    interval(1000)
      .subscribe({
        next: (value) => {
          this.cumprimento = this.setCumprimento(new Date().getHours());
        }
      })
  }

  private setCumprimento(hora: number): string {
    if (hora >= 0 && hora < 12) return 'Bom dia'
    if (hora >= 12 && hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  abrirRouteInNovaAba(routePath: string, params = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([routePath])
    );
    window.open(url + params, '_blank');
  }

  ngOnInit() {
    this.headerService.showHeader$.subscribe(show => {
      this.showHeader = show;
    });
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
              scriptElement = this.loadJsScript(this.renderer, "/assets/site-layout/assets/js/jquery.dlmenu.js");
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


  }

  navegacaoService(url) {

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
