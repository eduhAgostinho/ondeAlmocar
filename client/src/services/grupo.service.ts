import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { tratadorError } from './tratador-de-erros';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Grupo, GrupoBusca } from 'src/models/grupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private http: HttpClient) { }

  buscarTodosGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(environment.urlGrupo).pipe(
      catchError(tratadorError([]))
    );
  }

  novoGrupo(grupo: Grupo): Observable<GrupoBusca> {
    return this.http.put<GrupoBusca>(environment.urlGrupo, grupo, this.httpOptions);
  }
}
