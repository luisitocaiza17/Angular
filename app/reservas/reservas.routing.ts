import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteReservasFormComponent } from './reporteReservas.form.component';

import { ActivateRoutes } from '../utils/activate.routes';
import { ConfiguracionReservasFormComponent } from './configuracionReservas.form.component';

const reservasRoutes: Routes = [
    {
        path: 'reporteReservas',
        children: [{ path: 'form', component: ReporteReservasFormComponent, canActivate: [ActivateRoutes] }]
        
    },
    {
        path: 'configuracionReservas',
        children: [{ path: 'form', component: ConfiguracionReservasFormComponent, canActivate: [ActivateRoutes] }]
        
    }

    
];


export const reservasRouting: ModuleWithProviders = RouterModule.forChild(reservasRoutes);