import { Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-area-aluno-layout',
  templateUrl: './area-aluno-layout.component.html',
  styleUrl: './area-aluno-layout.component.scss'
})
export class AreaAlunoLayoutComponent  {

  public logo: string = environment.logo;

  public usuario: any = [];

  constructor(private renderer: Renderer2) {
    this.usuario = JSON.parse(atob(localStorage.getItem('usuario')));

    let script = this.renderer.createElement('script'); script.src = `/assets/js/jquery-3.4.1.min.js`; this.renderer.appendChild(document.head, script);
    script = this.renderer.createElement('script'); script.src = `/assets/js/bootstrap.js`; this.renderer.appendChild(document.head, script);
    
    script = this.renderer.createElement('script'); 
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/js/jquery.nice-select.min.js`; 
    script.integrity="sha256-Zr3vByTlMGQhvMfgkQ5BtWRSKBGa2QlspKYJnkjZTmo=";
    script.crossorigin="anonymous";
    this.renderer.appendChild(document.head, script);
    
    //script = this.renderer.createElement('script'); script.src = `https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js`; this.renderer.appendChild(document.head, script);
    script = this.renderer.createElement('script'); script.src = `https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.js`; this.renderer.appendChild(document.head, script);
    //script = this.renderer.createElement('script'); script.src = `/assets/js/custom.js`; this.renderer.appendChild(document.head, script);
   }

}