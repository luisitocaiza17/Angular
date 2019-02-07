import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateRoutes } from '../utils/activate.routes';

import {ProcesoMasivoFormComponent} from './componentes/procesoMasivo.form.component'


const masivosRoutes: Routes = [
    {
        path: 'masivos',
        children: [{ path: 'form', component: ProcesoMasivoFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const masivosRouting: ModuleWithProviders = RouterModule.forChild(masivosRoutes);