import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario, UsuarioLogin } from 'src/models/usuario';
import { Subscription } from 'rxjs';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { UsuarioService } from 'src/services/usuario.service';
import { SnackBarService } from 'src/services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  sub: Subscription;
  senhaConfirmada: string;
  constructor(
    private auth: AutenticacaoService,
    private api: UsuarioService,
    private snackService: SnackBarService
  ) { }
  usuario: UsuarioLogin = {
    username: '',
    password: ''
  };

  novoUsuario: Usuario = {
    nome: '',
    email: '',
    grupo: null,
    ultimoVoto: null,
    senha: ''
  };

  ngOnInit() {
  }

  login() {
    this.sub = this.auth.login(this.usuario).subscribe((result) => {
      this.auth.setLocalStorage(result);
    }, (err) => {
      this.snackService.abreSnackBar(err.error.message || err.message, 'OK');
    });
  }

  cadastrar() {
    if (this.novoUsuario.senha !== this.senhaConfirmada) {
      this.novoUsuario.senha = '';
      this.senhaConfirmada = '';
      this.snackService.abreSnackBar('Senhas não combinam', 'OK');
    } else {
      this.sub = this.api.novoUsuario(this.novoUsuario).subscribe((result) => {
        this.auth.setLocalStorage(result);
      }, (err) => {
        if (err.status === 400) {
          this.snackService.abreSnackBar(err.error, 'OK');
        } else {
          this.snackService.abreSnackBar(err.error.message || err.message, 'OK');
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
