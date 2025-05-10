import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { authGuard } from './shared/auth.guard';
import { LogoutComponent } from './core/pages/authentication/logout/logout.component';
import { AreaAlunoLayoutComponent } from './area-aluno/layout/area-aluno-layout/area-aluno-layout.component';
import { CommonModule } from '@angular/common';
import { SiteLayoutComponent } from './site/layout/site-layout/site-layout.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { RelImportacaoNFComponent } from './site/relatorio/rel-importacao-nf/rel-importacao-nf.component';
import { HomeComponent } from './site/pages/home/home.component';

const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./core/pages/authentication/login/login.component')
  },
  {
    path: 'auth/remote',
    loadComponent: () => import('./core/pages/authentication/remote/remote.component')
  },
  {
    path: 'auth/logout',
    component: LogoutComponent,
  },
  {
    path: 'esqueci-senha',
    component: LogoutComponent,
  },
  {
    path: '',
    loadComponent: () => import('./core/pages/authentication/verifica-acesso/verifica-acesso.component').then((c) => c.VerificaAcessoComponent),
    //canActivate: [authGuard]
  },
  {
    path: 'menu',
    loadComponent: () => import('./core/pages/authentication/grid-menu/grid-menu.component').then((c) => c.GridMenuComponent),
    //canActivate: [authGuard]
  },
  ///// ADMIN
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'turmas',
        loadComponent: () => import('./core/pages/turmas/all-turmas/all-turmas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'turmas/register',
        loadComponent: () => import('./core/pages/turmas/add-turmas/add-turmas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'turmas/register/:id',
        loadComponent: () => import('./core/pages/turmas/add-turmas/add-turmas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./core/pages/usuarios/all-usuarios/all-usuarios.component'),
        //canActivate: [authGuard]
      },
      {
        path: 'categorias',
        loadComponent: () => import('./core/pages/categorias/all-categorias/all-categorias.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'questoes',
        loadComponent: () => import('./core/pages/questoes/all-questoes/all-questoes.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'questoes/register',
        loadComponent: () => import('./core/pages/questoes/register-questoes/register-questoes.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'questoes/register/:id',
        loadComponent: () => import('./core/pages/questoes/register-questoes/register-questoes.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'provas',
        loadComponent: () => import('./core/pages/provas/all-provas/all-provas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'provas/register',
        loadComponent: () => import('./core/pages/provas/add-provas/add-provas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'provas/register/:id',
        loadComponent: () => import('./core/pages/provas/add-provas/add-provas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'liberacao-prova',
        loadComponent: () => import('./core/pages/provas/liberacao-provas/all-liberacao-provas/all-liberacao-provas.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'liberacao-prova/register',
        loadComponent: () => import('./core/pages/provas/liberacao-provas/add-liberacao-provas/add-liberacao-provas.component'),
        //canActivate: [authGuard],
        pathMatch: 'full'
      },
      {
        path: 'liberacao-prova/register/:id',
        loadComponent: () => import('./core/pages/provas/liberacao-provas/add-liberacao-provas/add-liberacao-provas.component'),
        //canActivate: [authGuard],
        pathMatch: 'full'
      },
      {
        path: 'sample',
        redirectTo: '/sample-page',
        pathMatch: 'full'
      },
      {
        path: 'acesso-restrito',
        loadComponent: () => import('./core/default/erros/error403/error403.component'),
      },
      {
        path: 'pagina-nao-encontrada',
        loadComponent: () => import('./core/default/erros/error404/error404.component'),
      },
      {
        path: 'erro-servidor',
        loadComponent: () => import('./core/default/erros/error500/error500.component'),
      },
      {
        path: 'home',
        loadComponent: () => import('./core/default/default.component').then((c) => c.DefaultComponent),
        //canActivate: [authGuard]
      },
      {
        path: '',
        loadComponent: () => import('./core/default/default.component').then((c) => c.DefaultComponent),
        //canActivate: [authGuard]
      },
      {
        path: 'menus',
        children: [
          {
            path: '',
            loadComponent: () => import('./core/pages/menus/all-menus/all-menus.component'),
            canActivate: [authGuard],
          },
          {
            path: 'configurar',
            loadComponent: () => import('./core/pages/menus/configurar-menu/configurar-menu.component'),
            canActivate: [authGuard],
          },
        ]
      },

    ]
  },
  ////AREA ALUNO
  {
    path: 'areaAluno',
    component: AreaAlunoLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./area-aluno/pages/home/home.component'),
        //canActivate: [authGuard],
      },
      {
        path: 'avaliacao/:prova_liberada_id',
        loadComponent: () => import('./area-aluno/pages/avaliacao/avaliacao.component'),
      },
    ]
  },
  ////CALCULADORA
  {
    path: 'site',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => HomeComponent,
        //canActivate: [authGuard],
      },
      {
        path: 'avaliacao/:prova_liberada_id',
        loadComponent: () => import('./area-aluno/pages/avaliacao/avaliacao.component'),
      },
    ]
  },
  {
    path: 'relatorio/rel-importacao-nf',
    component: RelImportacaoNFComponent,
    //canActivate: [authGuard],
  },
];  

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule,
    RouterModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
