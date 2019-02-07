import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosSbListComponent } from './componentes/porContrato/contratosSb.list.component';
import { ActivateRoutes } from '../utils/activate.routes';

import { ReportarSobreFormComponent } from './componentes/reportes/reporteSobres.form.component';
import { AsignarSobresFormComponent } from './componentes/asignar/asignarSobres.form.component';
import { SbConsultorListComponent } from './componentes/consultor/listadoSbConsultor.list.component';
import { DevolucionSobresListComponent } from './componentes/devolucion/devolucionSobres.list.component';
import { AdministracionFormComponent } from './componentes/autorizar/administracionSobre.form.component';
import { SimuladorReporteConstitucionFormComponent } from './componentes/reportes/reporteSimuladorConstitucion.form.component';


const sobresRoutes: Routes = [
    {
        path: 'sobresPorContrato',
        children: [{ path: 'list', component: ContratosSbListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'reporteSobres',
        children: [{ path: 'form', component: ReportarSobreFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'asignarSobres',
        children: [{ path: 'form', component: AsignarSobresFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'listadoSobresConsultor',
        children: [{ path: 'list', component: SbConsultorListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'devolucionSobres',
        children: [{ path: 'list', component: DevolucionSobresListComponent, canActivate: [ActivateRoutes] }]
    }
    ,
    {
        path: 'autorizarSobres',
        children: [{ path: 'form', component: AdministracionFormComponent, canActivate: [ActivateRoutes] }]
    }
    ,
    {
        path: 'simuladorReporte',
        children: [{ path: 'form', component: SimuladorReporteConstitucionFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const sobresRouting: ModuleWithProviders = RouterModule.forChild(sobresRoutes);