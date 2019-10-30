import { Component, OnInit } from '@angular/core';
import { Usuario, UsuarioLogin } from 'src/models/usuario';
import { Subscription } from 'rxjs';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { StorageService } from '../../services/storage.service';

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
  constructor(private auth: AutenticacaoService) { }
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
    }

  }

  erroFalso() {
    this.erro = false;
  }

  erroCadFalso() {
    this.erroCad = false;
  }

}
