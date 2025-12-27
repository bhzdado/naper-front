import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: false,
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss'
})
export class ScrollToTopComponent {
  windowScrolled = false;
  private cdr = inject(ChangeDetectorRef);

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) { 
    this.windowScrolled = window.scrollY > 300; // Exibe o botão após 300px de rolagem
 
    this.cdr.detectChanges();
  }

  scrollToTop() {
    console.log('Scrolling to top');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave

    this.cdr.detectChanges();
  }
}
