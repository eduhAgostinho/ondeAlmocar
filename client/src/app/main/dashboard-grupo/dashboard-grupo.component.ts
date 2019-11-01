import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/services/usuario.service';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/models/usuario';
import { GrupoService } from 'src/services/grupo.service';
import { SnackBarService } from 'src/services/snack-bar.service';

@Component({
  selector: 'app-dashboard-grupo',
  templateUrl: './dashboard-grupo.component.html',
  styleUrls: ['./dashboard-grupo.component.css']
})
export class DashboardGrupoComponent implements OnInit, OnDestroy {

  sub: Subscription;
  dataSource;
  displayedColumns = ['#', 'nome', 'votos', 'votar'];
  @Input() usuarioLogado: Usuario;
  @Output() atualizarUser = new EventEmitter();

  constructor(
    private usuarioService: UsuarioService,
    private grupoService: GrupoService,
    private snack: SnackBarService
  ) { }

  ngOnInit() {
    this.sub = this.grupoService.buscarGrupoID(this.usuarioLogado.grupo._id).subscribe((result) => {
      this.dataSource = result.votacao;
    });
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

  votar(votacao) {
    this.sub = this.grupoService.votarRestaurante(this.usuarioLogado.grupo._id, votacao.restaurante._id, this.usuarioLogado._id)
    .subscribe((result) => {
      this.dataSource = result.votacao;
    }, err => {
      if (err.status === 400) {
        this.snack.abreSnackBar('Você já votou hoje', 'OK');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
