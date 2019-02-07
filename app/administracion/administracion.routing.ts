import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosListComponent } from './usuarios.list.component';
import { RolUsuarioComponent } from './rolUsuario.component';
import { RolesListComponent } from './roles.list.component';
import { RolFuncionalidadComponent } from './rolFuncionalidad.component';

import { ActivateRoutes } from '../utils/activate.routes';

const administracionRoutes: Routes = [
    {
        path: 'usuarios',
        children: [{ path: 'list', component: UsuariosListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'rolUsuarios',
        children: [{ path: 'list', component: RolUsuarioComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'roles',
        children: [{ path: 'list', component: RolesListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'rolFuncionalidades',
        children: [{ path: 'list', component: RolFuncionalidadComponent, canActivate: [ActivateRoutes] }]
    }     
];

export const administracionRouting: ModuleWithProviders = RouterModule.forChild(administracionRoutes);