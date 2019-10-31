import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Grupo } from 'src/models/grupo';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css']
})
export class DialogFormComponent implements OnInit {
  codigoUsuario = '';
  entrarGrupo: boolean;
  novoGrupo: Grupo = {
    restaurantesEscolhidos: [],
    votacao: [],
    nome: ''
  };

  erro: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogFormComponent>
  ) { }

  ngOnInit() {
    this.data[0] ? this.entrarGrupo = true : this.entrarGrupo = false;
  }

  submit() {
    if (this.entrarGrupo) {
      if (this.codigoUsuario === this.data[1].codigo) {
        this.dialogRef.close(true);
      } else {
        this.erro = true;
      }
    } else {
      this.dialogRef.close(this.novoGrupo);
    }
  }
}
