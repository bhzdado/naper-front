import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from '../services/auth/auth-state.service';
import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from './dialog-modal/dialog-modal/dialog-modal.component';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tokenService: TokenService = inject(TokenService);
  const router: Router = inject(Router);
  const dialog: MatDialog = inject(MatDialog);

  if (!tokenService.isLoggedIn()) {
    if (router.url != '/') {
      const dialogRef = dialog.open(DialogModalComponent, {
        width: '400px',
        data: {
          titulo: 'ACESSO NEGADO',
          conteudo: 'Para acessar essa área há a necessidade de está autenticado.',
          tipo: "erro"
        },
      });
      dialogRef.afterClosed().toPromise()
        .then(result => {
          router.navigate(['/auth/login']);
          return Promise.resolve(result);
        });
    } else {
      router.navigate(['/auth/login']);
    }
    return false;
    //
  }
  return true;
};
