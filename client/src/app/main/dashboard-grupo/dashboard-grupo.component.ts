import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuarioService } from 'src/services/usuario.service';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/models/usuario';

@Component({
  selector: 'app-dashboard-grupo',
  templateUrl: './dashboard-grupo.component.html',
  styleUrls: ['./dashboard-grupo.component.css']
})
export class DashboardGrupoComponent implements OnInit {

  sub: Subscription;
  @Input() usuarioLogado: Usuario;
  @Output() atualizarUser = new EventEmitter();

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  sairGrupo() {
    this.sub = this.usuarioService.entrarSairGrupo(this.usuarioLogado.email, null).subscribe((result) => {
      if (result) {
        this.atualizar(result);
      }
    });
  }

  atualizar(usuario: Usuario) {
    this.atualizarUser.emit(usuario);
  }
}
