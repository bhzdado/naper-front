import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/auth/token.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutenticarComponent } from '../site/shared/modal/autenticar/autenticar.component';
import * as myJsFunctions from '../../assets/site-layout/assets/js/snap-dialog.min.js';
import { AuthService } from '../services/auth/auth.service';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tokenService: TokenService = inject(TokenService);
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const dialog: MatDialog = inject(MatDialog);

  if (!tokenService.isLoggedIn()) {
    authService.refreshToken().pipe(map((response: any) => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('api_token');
          localStorage.setItem('api_token', response?.authorization.api_token);
          localStorage.setItem('access_token', response.authorization.access_token);
          return response.authorization;
        }),
      catchError((err: any) => {
        const dialogRef = dialog.open(AutenticarComponent, {
          width: '350px',
        });
        dialogRef.afterClosed().toPromise()
          .then(result => {
            if (result) {
              router.navigate(['/auth/login']);
            }
            return Promise.resolve(result);
          });
        return throwError(err);
      }));

    return false;
  }
  return true;
};
