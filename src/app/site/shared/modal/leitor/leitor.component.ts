import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { MediaService } from 'src/app/services/media.service';
import { environment } from 'src/environments/environment';
import { PdfViewerModule } from 'ng2-pdf-viewer';

export interface ModalData {
  url: any,
  tipoConteudo: string,
  conteudo: string
}

@Component({
  selector: 'app-leitor-pdf',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule, MatButtonModule, AngularMaterialModule, MatDialogModule, PdfViewerModule],
  templateUrl: './leitor.component.html',
  styleUrl: './leitor.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LeitorComponent {
  public url = "";
  public loadingPdf = false;
  public errorTemplate = false;
  public tipoConteudo = '';
  public conteudo = '';
  safeUrl: SafeResourceUrl | undefined;
  isModal: boolean = false;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  pageSizeOptions: number[] = [];

  constructor(public dialogRef: MatDialogRef<LeitorComponent>,
    public mediaService: MediaService,
    private dialog: MatDialog,
    private http: HttpClient, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {

    //this.loadingPdf = true;
    this.tipoConteudo = data.tipoConteudo;
    this.isModal = false;

    if (this.tipoConteudo == 'load') {
      this.loadingPdf = true;
      this.isModal = true;

      let url = data.url;
      if (data.url.includes('?')) {
        url += "&mdl=true";
      } else {
        url += "?mdl=true";
      }

      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.loadingPdf = false;
    } else {
      this.conteudo = data.conteudo;
      if (data.tipoConteudo == 'pdf') {
        this.loadingPdf = true;
        this.isModal = false;
      }
      this.url = data.url;
    }
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.pageSizeOptions = Array(this.totalPages).fill(null).map((x, i) => i + 1);
    this.isLoaded = true;
    this.loadingPdf = false;
  }

  onSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.toPage(Number(target.value));
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  toPage(pageNumber: number) {
    this.page = pageNumber;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  fechar() {
    this.dialogRef.close(false);
  }
}