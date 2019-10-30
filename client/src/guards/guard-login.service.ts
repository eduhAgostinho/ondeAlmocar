import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AutenticacaoService } from '../../../../Projeto/incubadora-2019-front/src/app/servicos/autenticacao.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardLoginService {

  constructor(private servicoAutenticacao: AutenticacaoService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.servicoAutenticacao.estaAutenticado()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
