import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import {InicioComponent} from './pages/inicio/inicio.component'
import { VersaoComponent } from './pages/versao/versao.component'
import { AddNovaVersaoComponent } from './pages/add-nova-versao/add-nova-versao.component'
import { PerfilComponent } from './pages/perfil/perfil.component'
import { UsuariosComponent } from './pages/usuarios/usuarios.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'versao', component: VersaoComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'add-versao', component: AddNovaVersaoComponent },
  { path: 'add-versao/:id', component: AddNovaVersaoComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
