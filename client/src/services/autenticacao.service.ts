import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioLogin } from '../models/usuario';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { map, catchError } from 'rxjs/operators';
import { tratadorError } from './tratador-de-erros';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  public token: string;

  constructor(private router: Router, private http: HttpClient, private storageService: StorageService) { }

  estaAutenticado(): boolean {
    return this.storageService.get('token') != null && !this.tokenExpirado();
  }

  tokenExpirado() {
    const token = this.storageService.get('token');
    const decoded = this.decode(token);
    const payload = decoded.exp;
    const nowTimestamp = Math.floor(+new Date() / 1000);
    if (payload > nowTimestamp) {
      return false;
    }
    return true;
  }

  login(usuario: UsuarioLogin) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(`${environment.urlUsuario}/login`, usuario, httpOptions).pipe(map(res => res || null),
      catchError(tratadorError()));
  }

  limpa(): void {
    this.storageService.remove('token');
  }

  setLocalStorage(data) {
    this.storageService.set('token', data.token);
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.limpa();
    this.router.navigate(['/login']);
  }

  decode(token) {
    return jwt_decode(token) as any;
  }

}
