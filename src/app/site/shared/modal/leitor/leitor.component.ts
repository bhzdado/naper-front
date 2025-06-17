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

export interface ModalData {
  url: any,
  tipoConteudo: string,
  conteudo: string
}

@Component({
  selector: 'app-leitor-pdf',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule, MatButtonModule, AngularMaterialModule, MatDialogModule],
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

  constructor(public dialogRef: MatDialogRef<LeitorComponent>,
    public mediaService: MediaService,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {

    this.loadingPdf = true;
    this.tipoConteudo = data.tipoConteudo;

    if (this.tipoConteudo == 'pdf') {
      this.mediaService.getPdf(data.url, (response) => {
        if (response.status) {
          this.url = response.pdf;
          this.loadingPdf = false;
        } else {
          this.dialogRef.close({
            status: 0
          });
        }
      });
    } else {
      this.conteudo = data.conteudo;
      this.loadingPdf = false;
    }
  }

  fechar() {
    this.dialogRef.close(false);
  }
}