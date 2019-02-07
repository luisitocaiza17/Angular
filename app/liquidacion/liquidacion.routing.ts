import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosLiquidacionListComponent } from './contratosLiquidacion.list.component';


import { ActivateRoutes } from '../utils/activate.routes';

const liquidacionRoutes: Routes = [
    {
        path: 'liquidacion',
        children: [{ path: 'list', component: ContratosLiquidacionListComponent, canActivate: [ActivateRoutes] }]
    }
];

export const liquidacionRouting: ModuleWithProviders = RouterModule.forChild(liquidacionRoutes);