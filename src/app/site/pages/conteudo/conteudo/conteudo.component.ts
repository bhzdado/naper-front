import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConteudoService } from '../conteudo.service';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loader.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NavegarService } from 'src/app/site/services/navegar.service';

export interface listagem {
  id: number;
  titulo: string;
}

@Component({
  selector: 'app-conteudo',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatTabsModule, MatListModule, MatDividerModule, CommonModule, NgFor, SharedModule, ReactiveFormsModule,
    MatButtonModule, MatProgressBarModule, MatMenuModule, AngularMaterialModule, MatPaginatorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conteudo.component.html',
  styleUrl: './conteudo.component.scss'
})
export class ConteudoComponent implements OnInit, AfterViewInit {
  public target: any = "";
  public id: number = 0;

  public titulo: string = "";
  dataSource: any[] = [];

  currentPage = 1;
  totalPages = 10;
  carregando: boolean= false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private loadingService: LoaderService,
    public navegar: NavegarService,
    public conteudoService: ConteudoService
  ) {
    this.target = this.activatedRoute.snapshot.paramMap.get('target') ?? "";
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id')) ?? 0;

    this.listar(this.currentPage);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  getPages() {
    let pages = [];
    for(let i=1; i<=this.totalPages; i++){
      pages.push(i);
    }

    return pages;
  }

  listar(currentPage) {
    this.carregando = true;
    switch (this.target) {
      case 'm':
        this.conteudoService.getConteudoPorModulo(this.id, { pagina: currentPage}, (response) => {
          this.titulo = response.dados.modulo;
          this.dataSource = response.dados.conteudos.data;
          this.currentPage = response.dados.conteudos.current_page;
          this.totalPages = response.dados.conteudos.last_page;
          this.carregando = false;
          this.cdr.detectChanges();
        });
        break;
    }
  }
}
