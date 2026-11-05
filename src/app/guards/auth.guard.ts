import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessaoService } from '../services/sessao.service';

export const authGuard: CanActivateFn = () => {

  if (SessaoService.estaLogado()) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};