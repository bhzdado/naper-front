import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { TokenService } from './services/auth/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Painela Administrativo';

  constructor(private router: Router, public authService: AuthService, private token: TokenService) { }

  ngOnInit() {
    // clear alerts on location change
    this.router.events.subscribe(event => {
      
      if (event instanceof NavigationStart) {
        if (event.url.indexOf("/auth/logout") < 0 && event.url.indexOf("/auth/login") < 0) {
          localStorage.setItem('rota', event.url);
          // setTimeout(() => {
              // this.authService.refreshToken();
          // }, 2000);
        }
      }

      if (event instanceof NavigationEnd) {
        if (event.url.indexOf("/auth/logout") < 0 && event.url.indexOf("/auth/login") < 0) {
          localStorage.setItem('rota', event.url);
          // setTimeout(() => {
               //this.authService.refreshToken();
          // }, 2000);
        }
      }
    });
  }

}
