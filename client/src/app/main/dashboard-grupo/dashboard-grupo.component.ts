import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/services/usuario.service';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/models/usuario';
import { GrupoService } from 'src/services/grupo.service';
import { SnackBarService } from 'src/services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { RestauranteVotacao } from 'src/models/restaurante';
import { Votacao } from 'src/models/votacao';
import { Grupo } from 'src/models/grupo';

@Component({
  selector: 'app-dashboard-grupo',
  templateUrl: './dashboard-grupo.component.html',
  styleUrls: ['./dashboard-grupo.component.css']
})
export class DashboardGrupoComponent implements OnInit, OnDestroy {

  sub: Subscription;
  dataSource: MatTableDataSource<RestauranteVotacao>;
  votacao: Votacao = { status: false, restaurantes: [] };
  displayedColumns = ['#', 'nome', 'votos', 'votar'];
  colunasRestaurantesVisitados = ['nome', 'data'];
  grupo: Grupo = {
    codigo: '',
    nome: '',
    restaurantesEscolhidos: [],
    votacao: { status: false, restaurantes: [] }
  };
  @Input() usuarioLogado: Usuario;
  @Output() atualizarUser = new EventEmitter();

  constructor(
    private usuarioService: UsuarioService,
    private grupoService: GrupoService,
    private snack: SnackBarService
  ) { }

  ngOnInit() {
    this.sub = this.grupoService.buscarGrupoID(this.usuarioLogado.grupo._id).subscribe((result) => {
      this.grupo = result;
      this.atualizarTabela(result.votacao);
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
        this.usuarioLogado.ultimoVoto = new Date();
        this.atualizarTabela(result.votacao);
      }, err => {
        if (err.status === 400) {
          const hoje = new Date();
          const usuarioVoto = new Date(this.usuarioLogado.ultimoVoto);
          if (!this.votacao.status) {
            this.snack.abreSnackBar('A votação não está aberta', 'OK');
          } else if (
            usuarioVoto.getFullYear() === hoje.getFullYear() &&
            usuarioVoto.getMonth() === hoje.getMonth() &&
            usuarioVoto.getDate() === hoje.getDate()
          ) {
            this.snack.abreSnackBar('Você já votou hoje', 'OK');
          } else {
            this.snack.abreSnackBar(err.error || err.message, 'OK');
          }
        }
      });
  }

  novaVotacao() {
    this.sub = this.grupoService.votacaoNova(this.usuarioLogado.grupo._id).subscribe((result) => {
      this.atualizarTabela(result.votacao);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: RestauranteVotacao, filter: string) => {
      const accumalator = (currentTerm, key) => {
        return key === 'restaurante' ? currentTerm + data.restaurante.nome : currentTerm + data[key];
      };
      const dataStr = Object.keys(data).reduce(accumalator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  atualizarTabela(votacaoAtualizada: Votacao) {
    this.votacao = votacaoAtualizada;
    this.dataSource = new MatTableDataSource(this.votacao.restaurantes);
  }

  encerraVotacao() {
    if (this.votacao.restaurantes.length === 0) {
       this.snack.abreSnackBar('Não há nenhum restaurante na votação', 'OK');
    } else {
      this.sub = this.grupoService.buscarGrupoID(this.usuarioLogado.grupo._id).subscribe((result) => {
        this.atualizarTabela(result.votacao);
        this.grupoService.encerrarVotacao(this.usuarioLogado.grupo._id, this.votacao.restaurantes[0].restaurante._id).subscribe(
          (resultado) => {
            this.snack.abreSnackBarVerde('Votação encerrada', 'OK');
            this.atualizarTabela(resultado.votacao);
          }
        );
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
