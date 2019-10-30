import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/services/storage.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  msgSair = 'Tem certeza que deseja sair?';
  constructor(private storage: StorageService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
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

}
