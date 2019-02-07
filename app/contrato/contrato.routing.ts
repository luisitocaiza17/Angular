import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratoListComponent } from './contrato.list.component';

import { ActivateRoutes } from '../utils/activate.routes';

const contratoRoutes: Routes = [
    {
        path: 'contratos',
        children: [
            { path: 'list', component: ContratoListComponent, canActivate: [ActivateRoutes] }
        ]
    }
];

export const contratoRouting: ModuleWithProviders = RouterModule.forChild(contratoRoutes);