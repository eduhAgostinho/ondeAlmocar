import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Grupo } from 'src/models/grupo';
import { GrupoService } from 'src/services/grupo.service';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/services/usuario.service';
import { StorageService } from 'src/services/storage.service';
import { AutenticacaoService } from 'src/services/autenticacao.service';

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
    votacao: { status: false, restaurantes: [] },
    nome: ''
  };
  decoded;
  erro: boolean;
  sub: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    private grupoService: GrupoService,
    private usuarioService: UsuarioService,
    private storage: StorageService,
    private auth: AutenticacaoService,

  ) { }

  ngOnInit() {
    this.data[0] ? this.entrarGrupo = true : this.entrarGrupo = false;
    const token = this.storage.get('token');
    this.decoded = this.auth.decode(token);
  }

  submit() {
    if (this.entrarGrupo) {
      if (this.novoGrupo.nome === this.data[1].codigo) {
        this.usuarioService.entrarSairGrupo(this.decoded.user.email, this.data[1]).subscribe((result) => {
          this.dialogRef.close(result);
        });
      } else {
        this.erro = true;
      }
    } else {
      this.sub = this.grupoService.novoGrupo(this.novoGrupo).subscribe((result) => {
        this.usuarioService.entrarSairGrupo(this.decoded.user.email, result).subscribe((usuarioAtualizado) => {
          this.dialogRef.close(usuarioAtualizado);
        });
      });
    }
  }
}
