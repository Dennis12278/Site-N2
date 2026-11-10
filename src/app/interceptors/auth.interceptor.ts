import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessaoService } from '../services/sessao.service';

const API_URL = 'http://localhost:5031';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = SessaoService.token();


  const requisicao = token && req.url.startsWith(API_URL)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {

   
      const ehLogin = req.url.includes('/Auth/');

      if (erro.status === 401 && req.url.startsWith(API_URL) && !ehLogin) {
        SessaoService.sair();
        router.navigate(['/login']);
      }

      return throwError(() => erro);
    })
  );
};