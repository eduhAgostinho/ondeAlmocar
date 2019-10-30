import { Injectable } from '@angular/core';
import { AutenticacaoService } from '../../../../Projeto/incubadora-2019-front/src/app/servicos/autenticacao.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardAuthService {

  constructor(private servicoAutenticacao: AutenticacaoService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.servicoAutenticacao.estaAutenticado()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;

  }
}
