import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { A11yModule } from '@angular/cdk/a11y';

import { AuthInterceptor } from '../services/Auth.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GuardAuthService } from 'src/guards/guard-auth.service';
import { AutenticacaoService } from '../services/autenticacao.service';
import { GuardLoginService } from 'src/guards/guard-login.service';
import { StorageService } from '../services/storage.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ListaGruposComponent } from './main/lista-grupos/lista-grupos.component';
import { DashboardGrupoComponent } from './main/dashboard-grupo/dashboard-grupo.component';
import { UsuarioService } from 'src/services/usuario.service';
import { GrupoService } from 'src/services/grupo.service';
import { DialogFormComponent } from './dialog-form/dialog-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ConfirmDialogComponent,
    ListaGruposComponent,
    DashboardGrupoComponent,
    DialogFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatListModule,
    A11yModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    DialogFormComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
    GuardAuthService,
    AutenticacaoService,
    GuardLoginService,
    StorageService,
    UsuarioService,
    GrupoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
