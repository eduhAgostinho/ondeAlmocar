import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Grupo } from 'src/models/grupo';
import { GrupoService } from 'src/services/grupo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';
import { Usuario } from 'src/models/usuario';
import { SnackBarService } from 'src/services/snack-bar.service';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit, OnDestroy {
  sub: Subscription;
  grupos: Grupo[];
  displayedColumns = ['nome', 'codigo'];
  dataSource = new MatTableDataSource(this.grupos);
  @Output() atualizarUser = new EventEmitter();

  constructor(
    private grupoService: GrupoService,
    private dialog: MatDialog,
    private snack: SnackBarService
  ) { }


  ngOnInit() {
    this.sub = this.grupoService.buscarTodosGrupos().subscribe((result) => {
      this.grupos = result;
      this.dataSource = new MatTableDataSource(this.grupos);
    }, err => {
      this.snack.abreSnackBar(err.error || err.message, 'OK');
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  entrarGrupo(grupo) {
    const dialogRef = this.dialog.open(DialogFormComponent, { data: [true, grupo] });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.atualizar(result);
      }
    });
  }

  criarGrupo() {
    const dialogRef = this.dialog.open(DialogFormComponent, { data: [false] });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.atualizar(result);
      }
    });
  }

  atualizar(usuario: Usuario) {
    this.atualizarUser.emit(usuario);
  }

  submit() { }

}
