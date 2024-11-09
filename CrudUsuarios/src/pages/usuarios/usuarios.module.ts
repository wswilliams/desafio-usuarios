import {NgModule} from '@angular/core';
import {UsuariosRoutingModule} from './usuarios-routing.module';
import {UsuarioListComponent} from './usuario-list/usuario-list.component';
import {UsuarioFormComponent} from './usuario-form/usuario-form.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
    declarations: [
        UsuarioListComponent,
        UsuarioFormComponent
    ],
    imports: [
        SharedModule,
        UsuariosRoutingModule
    ]
})
export class UsuariosModule {
}
