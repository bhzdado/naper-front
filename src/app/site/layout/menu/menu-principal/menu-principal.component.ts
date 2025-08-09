import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuService } from 'src/app/core/pages/menus/menu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ResponseService } from 'src/app/services/response.service';
import { LoaderService } from 'src/app/site/services/loader.service';
import { NavegacaoService } from 'src/app/site/services/navegacao.service';

export interface SubmenuItem {
  id: number;
  titulo: string;
  ordem: number;
  descricao: string;
  icone: string;
  link: string;
}

export interface Submenu {
  id: number;
  titulo: string;
  ordem: number;
  tipo: string;
  link: string;
  submenuItem?: SubmenuItem
}

export interface Menu {
  id: number;
  titulo: string;
  ordem: number;
  classe: string;
  link: string;
  submenu?: Submenu
}

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MenuPrincipalComponent implements OnInit, AfterViewInit {
  ELEMENT_DATA: Menu[] = [];

  dataSource = [];
  usuarioLogado = null;
  currentRoute = '';

  constructor(private loadingService: LoaderService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private response: ResponseService,
    public cdr: ChangeDetectorRef,
    public navegacaoService: NavegacaoService,
    private menuService: MenuService,
    private elRef: ElementRef
  ) {
    this.usuarioLogado = authService.getUser();
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.loadingService.show();
    this.carregarMenus();
  }

  ngAfterViewInit() {

  }

  abrirConteudo(url, event: any) {
    const clickedElement = event.target as HTMLElement;
    const parentElement = clickedElement.closest('.dropdown-menu');

    if (parentElement) {
      parentElement.classList.remove('show');
    }

    if (url) {
      this.navegacaoService.navigateTo(url);
    }

    this.cdr.detectChanges();
  }

  carregarMenus() {
    this.loadingService.show();
    this.cdr.detectChanges();

    this.menuService.getTodosMenus((response) => {
      let data = [];

      if (response.status == 0) {

      } else {
        response.dados.forEach((menu: any, iMenu: number) => {
          let submenus = [];
          if (menu.submenus) {
            menu.submenus.forEach((submenu: any, iSubmenu: number) => {
              let submenuItens = [];
              if (submenu.submenuItens) {
                submenu.submenuItens.forEach((submenuItem: any, iSubmenuItem: number) => {
                  submenuItens.push({
                    id: submenuItem.id,
                    titulo: submenuItem.titulo,
                    descricao: submenuItem.descricao,
                    ordem: Number(iSubmenuItem) + 1,
                    link: submenuItem.link,
                    icone: submenuItem.icone
                  });
                });
              }
              submenus.push({
                id: submenu.id,
                titulo: submenu.titulo,
                ordem: Number(iSubmenu) + 1,
                tipo: submenu.tipo,
                link: submenu.link,
                submenuItens: submenuItens
              });
            });
          }
          data.push({
            id: menu.id,
            titulo: menu.titulo,
            ordem: Number(iMenu) + 1,
            classe: menu.classe,
            link: menu.link,
            submenus: submenus
          })
        });

        this.dataSource = data;
        this.loadingService.hide();
        this.cdr.detectChanges();
      }
    });
  }
}
