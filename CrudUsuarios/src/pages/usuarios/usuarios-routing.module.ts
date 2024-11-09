import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsuarioListComponent} from "./usuario-list/usuario-list.component";
import {UsuarioFormComponent} from "./usuario-form/usuario-form.component";

const routes: Routes = [
  {path: '', component: UsuarioListComponent},
  {path: 'new', component: UsuarioFormComponent},
  {path: ':id/edit', component: UsuarioFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {
}
