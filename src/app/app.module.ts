import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLogoComponent } from './theme/layout/admin/nav-bar/nav-logo/nav-logo.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { SharedModule } from './theme/shared/shared.module';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogModalComponent } from './shared/dialog-modal/dialog-modal/dialog-modal.component';
import {MatDividerModule} from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'  
import { InterceptorModule } from './shared/interceptors/interceptor.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RequestInterceptor } from './interceptors/loading.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ErrorInterceptor } from './shared/interceptors/error-interceptor.interceptor';
import { CountdownModule } from 'ngx-countdown';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AreaAlunoLayoutComponent } from './area-aluno/layout/area-aluno-layout/area-aluno-layout.component';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SiteLayoutComponent } from './site/layout/site-layout/site-layout.component';
import { SpinnerComponent } from './site/spinner/spinner.component';
import { MenuPrincipalComponent } from './site/layout/menu/menu-principal/menu-principal.component';
import { MatMenuModule } from '@angular/material/menu';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TokenInterceptor } from './shared/interceptors/tokenInterceptor';
import { ScrollToTopComponent } from './site/shared/scroll/scroll-to-top/scroll-to-top.component';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatDividerModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
];


@NgModule({
  declarations: [
    AppComponent,
    ScrollToTopComponent,
    AdminComponent,
    AreaAlunoLayoutComponent,
    SiteLayoutComponent,
    SpinnerComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavItemComponent,
    NavCollapseComponent,
    ConfigurationComponent,
    DialogModalComponent,
    MenuPrincipalComponent
  ],
  exports: [FlexLayoutModule, MatListModule, ],
  imports: [
    CommonModule,  
    BrowserModule, 
    RouterModule, 
    AppRoutingModule, 
    SharedModule, 
    BrowserAnimationsModule, 
    HttpClientModule, 
    InterceptorModule, 
    materialModules,
    NgxMaskDirective, NgxMaskPipe,
    CountdownModule, 
    CarouselModule,
    FormsModule,
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    FlexLayoutModule, MatListModule, 
    MatButtonModule, MatMenuModule, MatIconModule, 
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true
    }),
    SweetAlert2Module.forRoot()
  ],
  providers: [
    NavigationItem, provideNgxMask(), 
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    //{ provide: LocationStrategy,  useClass: HashLocationStrategy},
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
