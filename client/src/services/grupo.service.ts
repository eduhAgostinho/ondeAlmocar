import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  buscarGrupoID(id: string): Observable<Grupo> {
    return this.http.get<Grupo>(`${environment.urlGrupo}/${id}`).pipe(
      map( g => this.tratarRestaurantesVotacao(g) ),
      catchError(tratadorError(null))
    );
  }

  tratarRestaurantesVotacao(grupo: Grupo) {
    grupo.votacao.sort((data1, data2) => {
      if (data1.curtidas < data2.curtidas) {
        return 1;
      }
      if (data1.curtidas > data2.curtidas) {
        return -1;
      }
      return 0;
    });
    return grupo;
  }

  votarRestaurante(idGrupo: string, idRestaurante: string, idUsuario: string): Observable<Grupo> {
    return this.http.post<Grupo>(`${environment.urlGrupo}/${idGrupo}/${idRestaurante}/${idUsuario}`, null).pipe(
      map( g => this.tratarRestaurantesVotacao(g) ),
      catchError(tratadorError(null))
    );
  }
}
