import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { Usuario } from 'src/models/usuario';
import { SnackBarService } from 'src/services/snack-bar.service';
import { Grupo } from 'src/models/grupo';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  msgSair = 'Tem certeza que deseja sair?';
  nome = '';
  email = '';
  sub: Subscription;
  usuarioLogado: Usuario;
  grupo: Grupo;
  constructor(
    private storage: StorageService,
    private router: Router,
    private dialog: MatDialog,
    private auth: AutenticacaoService,
    private api: ApiService,
    private snackService: SnackBarService
    ) { }

  ngOnInit() {
    const token = this.storage.get('token');
    const decoded = this.auth.decode(token);
    this.email = decoded.user.email;
    this.nome = decoded.user.nome;
    this.sub = this.api.buscarUsuario(this.email).subscribe((result) => {
      this.usuarioLogado = result;
      this.grupo = this.usuarioLogado.grupo;
    }, (err) => {
      this.snackService.abreSnackBar(err.error || err.message, 'OK');
    });
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { msg: this.msgSair } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.storage.remove('token');
        this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
