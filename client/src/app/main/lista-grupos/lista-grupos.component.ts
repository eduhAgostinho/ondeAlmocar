import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Grupo } from 'src/models/grupo';
import { GrupoService } from 'src/services/grupo.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/dialog-form/dialog-form.component';

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
  constructor(
    private grupoService: GrupoService,
    private dialog: MatDialog
  ) { }


  ngOnInit() {
    this.sub = this.grupoService.buscarTodosGrupos().subscribe((result) => {
      this.grupos = result;
      this.dataSource = new MatTableDataSource(this.grupos);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  entrarGrupo(grupo) {
    const dialogRef = this.dialog.open(DialogFormComponent, { data: grupo });
  }

  submit() {}

}
