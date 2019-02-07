import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router'
import {ActivateRoutes} from '../utils/activate.routes';

import {BasesListComponent} from './bases/bases.list.component';
import {ErroresListComponent} from './errores/errores.list.component';
import {PolizasListComponent} from './poliza/polizas.list.component';
import {PolizasAdminComponent} from './poliza/polizas.admin.component';

const serviciosAdicionalesRoutes: Routes = [
    {
        path: 'srvAdicBases',
        children: [
            {path: 'list', component: BasesListComponent, canActivate: [ActivateRoutes]},
            {path: 'errores/:id', component: ErroresListComponent, canActivate: [ActivateRoutes]}
        ]
    },
    {
        path: 'srvAdicAdmin',
        children: [
            {path: 'polizas', component: PolizasListComponent, canActivate: [ActivateRoutes]},
            {path: 'poliza', component: PolizasAdminComponent, canActivate: [ActivateRoutes]},
            {path: 'poliza/:id', component: PolizasAdminComponent, canActivate: [ActivateRoutes]}
        ]
    }
];

export const ServiciosAdicionalesRouting: ModuleWithProviders = RouterModule.forChild(serviciosAdicionalesRoutes);