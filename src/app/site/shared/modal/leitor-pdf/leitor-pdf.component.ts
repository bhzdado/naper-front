import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-leitor-pdf',
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  templateUrl: './leitor-pdf.component.html',
  styleUrl: './leitor-pdf.component.scss'
})
export class LeitorPdfComponent implements AfterViewInit {

  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  
  ngAfterViewInit(): void {
  }

  closeModal() {
  }
}