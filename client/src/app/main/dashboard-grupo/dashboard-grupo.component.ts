import { Component, OnInit, Input } from '@angular/core';
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
  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  sairGrupo() {
    this.sub = this.usuarioService.entrarSairGrupo(this.usuarioLogado.email, null).subscribe(() => {
      alert('Fora do grupo');
    });
  }

}
