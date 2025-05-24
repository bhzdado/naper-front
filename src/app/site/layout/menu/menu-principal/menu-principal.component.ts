import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuService } from 'src/app/core/pages/menus/menu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ResponseService } from 'src/app/services/response.service';
import { LoaderService } from 'src/app/site/services/loader.service';

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
  styleUrl: './menu-principal.component.scss'
})
export class MenuPrincipalComponent {
  ELEMENT_DATA: Menu[] = [];

  dataSource = [];
  usuarioLogado = null;

  constructor(private loadingService: LoaderService, private router: Router,
    private dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private response: ResponseService,
    public cdr: ChangeDetectorRef,
    private menuService: MenuService
  ) {
    this.usuarioLogado = authService.getUser();
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.carregarMenus();
  }

  carregarMenus() {
    this.menuService.getTodosMenus((response) => {
      let data = [];

      response.dados.forEach((x: any, i: number) => {
        data.push({
          id: x.id,
          titulo: x.titulo,
          ordem: Number(i) + 1,
          classe: x.classe
        })
      });

      this.dataSource = data;
      this.cdr.detectChanges();
      //this.loadingService.setLoading(false);
    });


    // this.menuService.getTodosMenus((response) => {
    //   let data = [];
    //   console.log(response);

    //   if (response.status == 0) {

    //   } else {
    //     response.dados.forEach((menu: any, iMenu: number) => {
    //       let submenus = [];
    //       if (menu.submenus) {
    //         menu.submenus.forEach((submenu: any, iSubmenu: number) => {
    //           let submenuItens = [];
    //           if (submenu.submenuItens) {
    //             submenu.submenuItens.forEach((submenuItem: any, iSubmenuItem: number) => {
    //               submenuItens.push({
    //                 id: submenuItem.id,
    //                 titulo: submenuItem.titulo,
    //                 descricao: submenuItem.descricao,
    //                 ordem: Number(iSubmenuItem) + 1,
    //                 link: submenuItem.link,
    //                 icone: submenuItem.icone
    //               });
    //             });
    //           }
    //           submenus.push({
    //             id: submenu.id,
    //             titulo: submenu.titulo,
    //             ordem: Number(iSubmenu) + 1,
    //             tipo: submenu.tipo,
    //             link: submenu.link,
    //             submenuItens: submenuItens
    //           });
    //         });
    //       }
    //       data.push({
    //         id: menu.id,
    //         titulo: menu.titulo,
    //         ordem: Number(iMenu) + 1,
    //         classe: menu.classe,
    //         link: menu.link,
    //         submenus: submenus
    //       })
    //     });

    //     this.dataSource = data;
    //     this.loadingService.hide();
    //   }
    // });
  }
}
