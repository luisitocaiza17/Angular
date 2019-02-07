import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogoDiagnosticoListComponent } from './catalogoDiagnostico.list.component';
import { CatalogoProcedimientoListComponent } from './catalogoProcedimiento.list.component';
import { CatalogoValorPuntoListComponent } from './valorPunto/catalogoValorPunto.list.component';

import { ActivateRoutes } from '../utils/activate.routes';

const catalogoRoutes: Routes = [
    {
        path: 'diagnostico',
        children: [{ path: 'list', component: CatalogoDiagnosticoListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'procedimiento',
        children: [{ path: 'list', component: CatalogoProcedimientoListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'valorPunto',
        children: [{ path: 'list', component: CatalogoValorPuntoListComponent, canActivate: [ActivateRoutes] }]
    }    
];

export const catalogoRouting: ModuleWithProviders = RouterModule.forChild(catalogoRoutes);
