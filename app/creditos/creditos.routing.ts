import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ContratosSbListComponent } from './componentes/porContrato/contratosSb.list.component';
import { ActivateRoutes } from '../utils/activate.routes';
import { ContratosCrListComponent } from './componentes/porContrato/contratosCrList.list.component';

import { CrConsultorListComponent } from './componentes/consultor/listadoCrConsultor.list.component';
import { AsignarCreditosFormComponent } from './componentes/asignar/asignarCreditos.form.component';
//import { DevolucionCreditosListComponent } from './componentes/devolucion/devolucionCreditos.list.component';
import { ReportarCreditoFormComponent } from './componentes/reportes/reporteCredito.form.component';
import { AdministracionFormComponent } from './componentes/autorizar/administracionCredito.form.component';
/*import { AsignarSobresFormComponent } from './componentes/asignar/asignarSobres.form.component';
import { SbConsultorListComponent } from './componentes/consultor/listadoSbConsultor.list.component';
import { DevolucionSobresListComponent } from './componentes/devolucion/devolucionSobres.list.component';
import { AdministracionFormComponent } from './componentes/autorizar/administracionSobre.form.component';*/

const creditosRoutes: Routes = [
   {
        path: 'creditoPorContrato',
        children: [{ path: 'list', component: ContratosCrListComponent, canActivate: [ActivateRoutes] }]
    },
   {
        path: 'reporteCredito',
        children: [{ path: 'form', component: ReportarCreditoFormComponent, canActivate: [ActivateRoutes] }]
    },
   {
        path: 'asignarCredito',
        children: [{ path: 'form', component: AsignarCreditosFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'listadoCreditoConsultor',
        children: [{ path: 'list', component: CrConsultorListComponent, canActivate: [ActivateRoutes] }]
    },  
    {
        path: 'autorizarCreditos',
        children: [{ path: 'form', component: AdministracionFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const creditosRouting: ModuleWithProviders = RouterModule.forChild(creditosRoutes);