import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { GuardAuthService } from '../guards/guard-auth.service';
import { GuardLoginService } from '../guards/guard-login.service';

const routes: Routes = [
  { path: 'login', resolve: [GuardLoginService], component: LoginComponent },
  { path: '', resolve: [GuardAuthService], component: MainComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
