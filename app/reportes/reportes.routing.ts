import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportesComponent } from './reportes.component';
import { ActivateRoutes } from '../utils/activate.routes';

const ReportesRoutes: Routes = [
    {
        path: 'reportes',
        children: [
            { path: 'filtro', component: ReportesComponent }
        ]
    }
];

export const ReportesRouting: ModuleWithProviders = RouterModule.forChild(ReportesRoutes);
