import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from 'src/pages/home/home.component';


const routes: Routes = [
  { path: 'usuarios', loadChildren: () => import('../pages/usuarios/usuarios.module').then(m => m.UsuariosModule) },
  // { path: 'home', component: HomeComponent },
  { path: 'home', loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule) },
  { path: '', loadChildren: () => import('../pages/login/login.module').then(m => m.LoginModule) },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
