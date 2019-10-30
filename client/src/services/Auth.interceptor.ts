import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AutenticacaoService } from './autenticacao.service';
import { StorageService } from './storage.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private loginServ: AutenticacaoService,
        private storageService: StorageService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.loginServ.estaAutenticado()) {
            const authRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.storageService.get('token')}`,
                }
            });
            return next.handle(authRequest);
        } else {
            return next.handle(req);
        }

    }
}
