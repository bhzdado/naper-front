import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
    //localStorage.removeItem('rota');
    this.authService.stopRefreshTokenTimer();
    localStorage.removeItem('usuario');
    localStorage.removeItem('rota');
    localStorage.removeItem('usuarioAcl');
    localStorage.removeItem('access_token');
    localStorage.removeItem('api_token');
    this.router.navigate(["/auth/login"]);
    window.location.href = "/auth/login";
  }
  ngOnInit() { }
}
