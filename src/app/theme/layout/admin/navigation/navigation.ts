import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: '',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/home',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'controle_acesso',
    title: 'Controle de Acesso',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      /*
      {
        id: 'minha_conta',
        title: 'Minha Conta',
        type: 'item',
        url: '/profile',
        classes: 'nav-item',
        icon: 'ti ti-user',
        breadcrumbs: true
      },
      
      {
        id: 'papeis',
        title: 'Papeis',
        type: 'item',
        url: '/papeis',
        classes: 'nav-item',
        //target: true,
        icon: 'ti ti-ruler',
        breadcrumbs: true
      },
      */
      {
        id: 'usuarios',
        title: 'Usuários',
        type: 'item',
        url: '/admin/usuarios',
        classes: 'nav-item',
        icon: 'ti ti-users',
        breadcrumbs: true
      }
    ]
  },
  {
    id: 'elements',
    title: 'Simulado',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'turmas',
        title: 'Turmas',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/turmas',
        icon: 'ti ti-school',
        breadcrumbs: true
      },
      {
        id: 'categorias',
        title: 'Categorias',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/categorias',
        icon: 'ti ti-category',
        breadcrumbs: true
      },
      {
        id: 'questoes',
        title: 'Questões',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/questoes',
        icon: 'ti ti-list-numbers',
        breadcrumbs: true
      },
      {
        id: 'provas',
        title: 'Provas',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/provas',
        icon: 'ti ti-notes',
        breadcrumbs: true
      },
      {
        id: 'liberacao_provas',
        title: 'Liberar Provas',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/liberacao-prova',
        icon: 'ti ti-lock-open',
        breadcrumbs: true
      },
      /*
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://tabler-icons.io/',
        icon: 'ti ti-plant-2',
        target: true,
        external: true
      }
      */
    ]
  },
  // {
  //   id: 'other',
  //   title: 'Relátorios',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/admin/sample-page',
  //       classes: 'nav-item',
  //       icon: 'ti ti-brand-chrome'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/berry-angular/',
  //       icon: 'ti ti-vocabulary',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
