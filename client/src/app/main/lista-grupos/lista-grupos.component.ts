import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit, OnDestroy {
  sub: Subscription;
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
