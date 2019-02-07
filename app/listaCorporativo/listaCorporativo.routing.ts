import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaCorporativoFormComponent } from './listaCorporativo.form.component';

import { ActivateRoutes } from '../utils/activate.routes';

const listaCorporativoRoutes: Routes = [
    {
        path: 'listaCorporativo',
        children: [{ path: 'form', component: ListaCorporativoFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const listaCorporativoRouting: ModuleWithProviders = RouterModule.forChild(listaCorporativoRoutes);