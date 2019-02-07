import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditoriaSistemaListComponent } from './auditoriaSistema.list.component';

import { ActivateRoutes } from '../utils/activate.routes';

const auditoriaSistemaRoutes: Routes = [
    {
        path: 'auditoria',
        children: [
            { path: 'list', component: AuditoriaSistemaListComponent, canActivate: [ActivateRoutes] }
        ]
    }
];

export const auditoriaSistemaRouting: ModuleWithProviders = RouterModule.forChild(auditoriaSistemaRoutes);
