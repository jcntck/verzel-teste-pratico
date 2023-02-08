import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLoginComponent } from './admin/pages/login/login.component';
import { AdminUsersComponent } from './admin/pages/users/users.component';
import { AdminVehiclesComponent } from './admin/pages/vehicles/vehicles.component';
import { HomeComponent } from './public/pages/home.component';

import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    title: 'Carros Usados Kavak | Comprar Carros Usados no Brasil',
    component: HomeComponent,
  },
  {
    path: 'admin/login',
    title: 'Painel Administrativo - Login',
    component: AdminLoginComponent,
  },
  {
    path: 'admin/usuarios',
    title: 'Painel Administrativo - Usuários',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/veiculos',
    title: 'Painel Administrativo - Veículos',
    component: AdminVehiclesComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
