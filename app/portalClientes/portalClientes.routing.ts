import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalClientesFormComponent } from './portalClientes.form.component';

import { ActivateRoutes } from '../utils/activate.routes';

const portalClientesRoutes: Routes = [
    {
        path: 'portalClientes',
        children: [{ path: 'form', component: PortalClientesFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const portalClientesRouting: ModuleWithProviders = RouterModule.forChild(portalClientesRoutes);