import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/auth/token.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutenticarComponent } from '../site/shared/modal/autenticar/autenticar.component';
import * as myJsFunctions from '../../assets/site-layout/assets/js/snap-dialog.min.js';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);
  const dialog: MatDialog = inject(MatDialog);

  if (!tokenService.isLoggedIn()) {
    // if (router.url != '/') {
      const dialogRef = dialog.open(AutenticarComponent, {
        width: '350px',
      });
      dialogRef.afterClosed().toPromise()
        .then(result => {
          if(result){
            router.navigate(['/auth/login']);
          //router.navigate(['/site']); 
          }
          return Promise.resolve(result);
        });
    // } else {
    //   router.navigate(['/auth/login']);
    //   //router.navigate(['/site']);
    // }
    return false;
    //
  }
  return true;
};
