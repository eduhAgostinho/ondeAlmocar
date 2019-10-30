import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  erro: boolean;
  mensagem: string;

  constructor() { }
  usuario: { email: string, senha: string } = {
    email: '',
    senha: ''
  };

  novoUsuario: Usuario = {
    nome: '',
    email: '',
    grupo: null,
    ultimoVoto:  null
  };

  ngOnInit() {
  }

  login() {
    alert('logou');
  }

  cadastrar() {}

  erroFalso() {
    this.erro = false;
  }

}
