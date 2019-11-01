import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tratadorError } from './tratador-de-erros';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Usuario, UsuarioBusca } from 'src/models/usuario';
import { Grupo, GrupoBusca } from 'src/models/grupo';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) { }

  buscarUsuario(email: string): Observable<any> {
    return this.http.get(`${environment.urlUsuario}/${email}`).pipe(
      catchError(tratadorError())
    );
  }

  novoUsuario(usuario: Usuario) {
    return this.http.put(`${environment.urlUsuario}`, usuario, this.httpOptions).pipe(
      catchError(tratadorError())
    );
  }

  entrarSairGrupo(email: string, grupo: Grupo | null): Observable<UsuarioBusca> {
    return this.http.post<UsuarioBusca>(`${environment.urlUsuario}/${email}`, { grupo }, this.httpOptions).pipe(
      catchError(tratadorError(null))
    );
  }

}
