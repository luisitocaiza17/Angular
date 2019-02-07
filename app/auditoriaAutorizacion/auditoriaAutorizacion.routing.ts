import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditoriaAutorizacionListComponent } from './auditoriaAutorizacion.list.component';

import { ActivateRoutes } from '../utils/activate.routes';

const auditoriaAutorizacionRoutes: Routes = [
    {
        path: 'movimientos',
        children: [
            { path: 'list', component: AuditoriaAutorizacionListComponent, canActivate: [ActivateRoutes] }
        ]
    }
];

export const auditoriaAutorizacionRouting: ModuleWithProviders = RouterModule.forChild(auditoriaAutorizacionRoutes);
