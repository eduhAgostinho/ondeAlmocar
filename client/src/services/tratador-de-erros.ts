import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export function tratadorError<T>(resultado ?: T) {
    return (erro: HttpErrorResponse): Observable<T> => {
        if (!navigator.onLine) {
            throw new Error('Sem conexão de internet');

        } else if (erro.status === 422) {
            throw erro;

        } else if (erro.status === 404 || erro.status === 400) {
            throw erro;

        } else if (erro.status === 500) {
            throw new Error('Erro interno, tente novamente mais tarde');

        } else if (erro.status === 401) {
            throw new Error('Não autorizado');

        } else {
            return of(resultado as T);
        }
    };
}
