import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { tratadorError } from './tratador-de-erros';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Usuario } from 'src/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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
}
