
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { administracionRouting } from './administracion.routing'

import { UsuariosListComponent } from './usuarios.list.component';
import { RolUsuarioComponent } from './rolUsuario.component';
import { RolesListComponent } from './roles.list.component';
import { RolFuncionalidadComponent } from './rolFuncionalidad.component';


@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, administracionRouting],
    declarations: [UsuariosListComponent, RolUsuarioComponent, RolesListComponent, RolFuncionalidadComponent],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: []
})
export class AdministracionModule { }
