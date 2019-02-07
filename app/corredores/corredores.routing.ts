import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateRoutes } from '../utils/activate.routes';
import {CorredoresCondicionesListComponent} from './corredoresCondiciones.list.component';
import {CorredoresAdministracionListComponent} from './corredoresAdministracion.list.component';
import {CorredoresGrupoAgentesListComponent} from './corredoresGrupoAgentes.list.component';
import {CorredoresReasignacionListComponent} from './corredoresReasignacion.list.component';
import {CorredoresReporteReasignacionListComponent} from './corredoresReporteReasignacion.list.component';

const corredoresRoutes: Routes = [
    {
        path: 'CorredoresCondicionesListComponent',
        children: [{ path: 'list', component: CorredoresCondicionesListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'CorredoresAdmnistracionListComponent',
        children: [{ path: 'list', component: CorredoresAdministracionListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'CorredoresGrupoAgentesListComponent',
        children: [{ path: 'list', component: CorredoresGrupoAgentesListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'CorredoresReasignacionListComponent',
        children: [{ path: 'list', component: CorredoresReasignacionListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'CorredoresReporteReasignacionListComponent',
        children: [{ path: 'list', component: CorredoresReporteReasignacionListComponent, canActivate: [ActivateRoutes] }]
    }
];

export const CorredoresRouting: ModuleWithProviders = RouterModule.forChild(corredoresRoutes);

