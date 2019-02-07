import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfRetVerComponent } from './infRet.ver.component';
import { InfRetGestionarComponent } from './infRet.gestionar.component';
import { ActivateRoutes } from '../utils/activate.routes';

const InformacionRetencionRoutes: Routes = [
    {
        path: 'informacionRetencion',
        children: [
            { path: 'ver/:categoria', component: InfRetVerComponent },
            { path: 'gestionar/:categoria', component: InfRetGestionarComponent }
        ]
    }
];

export const InformacionRetencionRouting: ModuleWithProviders = RouterModule.forChild(InformacionRetencionRoutes);
