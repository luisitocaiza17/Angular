import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosAutorizacionListComponent } from './contratosAutorizacion.list.component';
import { ReporteAutorizacionesComponent } from './reporteAutorizaciones.component';
import { ReporteAutorizacionesInSituComponent } from './reporteAutorizacionesInSitu.component';

import { ActivateRoutes } from '../utils/activate.routes';

const autorizacionRoutes: Routes = [
    {
        path: 'autorizacion',
        children: [{ path: 'list', component: ContratosAutorizacionListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'reporteAutorizacionesNormal',
        children: [{ path: 'list', component: ReporteAutorizacionesComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'reporteAutorizacionesInSitu',
        children: [{ path: 'list', component: ReporteAutorizacionesInSituComponent, canActivate: [ActivateRoutes] }]
    }
];

export const autorizacionRouting: ModuleWithProviders = RouterModule.forChild(autorizacionRoutes);