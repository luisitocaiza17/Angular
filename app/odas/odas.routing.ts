import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosOdasListComponent } from './contratosOdas.list.component';
import { ReporteOdasComponent} from './reporteOdas.component';

import { ActivateRoutes } from '../utils/activate.routes';

const odasRoutes: Routes = [
    {
        path: 'odas',
        children: [{ path: 'list', component: ContratosOdasListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'reporteOdas',
        children: [{ path: 'list', component: ReporteOdasComponent, canActivate: [ActivateRoutes] }]
    }
];

export const odasRouting: ModuleWithProviders = RouterModule.forChild(odasRoutes);