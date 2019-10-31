import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioLogin } from 'src/models/usuario';
import { Subscription } from 'rxjs';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { StorageService } from '../../services/storage.service';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  erro: boolean;
  erroCad: boolean;
  mensagem: string;
  sub: Subscription;
  senhaConfirmada: string;
  constructor(private auth: AutenticacaoService, private api: ApiService ) { }
  usuario: UsuarioLogin = {
    username: '',
    password: ''
  };

  novoUsuario: Usuario = {
    nome: '',
    email: '',
    grupo: null,
    ultimoVoto:  null,
    senha: ''
  };

  ngOnInit() {
  }

  login() {
    this.sub = this.auth.login(this.usuario).subscribe((result) => {
      this.auth.setLocalStorage(result);
      this.erro = false;
    }, (err) => {
      this.erro = true;
      this.mensagem = err.error.message || err.message;
    });
  }

  cadastrar() {
    if (this.novoUsuario.senha !== this.senhaConfirmada) {
      this.erroCad = true;
      this.mensagem = 'Senhas não combinam';
    } else {
      this.sub = this.api.novoUsuario(this.novoUsuario).subscribe((result) => {
        this.auth.setLocalStorage(result);
        this.erroCad = false;
      }, (err) => {
        this.erroCad = true;
        if (err.status === 400) {
          this.mensagem = err.error;
        } else {
          this.mensagem = err.error.message || err.message;
        }
      });
    }

  }

  erroFalso() {
    this.erro = false;
  }

  erroCadFalso() {
    this.erroCad = false;
  }

}
