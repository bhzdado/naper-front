import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-leitor-pdf',
  standalone: true,
  imports: [BrowserModule],
  templateUrl: './leitor-pdf.component.html',
  styleUrl: './leitor-pdf.component.scss'
})
export class LeitorPdfComponent implements AfterViewInit {

  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  
  ngAfterViewInit(): void {
  }

  closeModal() {
  }
}