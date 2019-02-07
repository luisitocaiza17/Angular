import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendarCitaListComponent } from './agendarCita.list.component';
import { PrestadoresListComponent } from './consultaPrestadores/prestadores.list.component';
import { ContratosAgendarCitaListComponent } from './contratosAgendarCita.list.component';
import { CalificacionPrestadoresListComponent } from './calificacionPrestadores.list.component';
import { AgendarCitaCentroMedicoContratoListComponent } from './agendarCentrosMedicos/agendarCentrMedContrato.list.component';
import { SolicitarCitaContratoListComponent } from './solicitarCita/solicitarCitaContrato.list.component';
import { ConsultasCitasSolicitudFormComponent } from './consultaCitaSolicitud/consultasCS.form.component';


import { ActivateRoutes } from '../utils/activate.routes';

const prestadoresRoutes: Routes = [
    {
        path: 'consultarPrestadores',
        children: [{path: 'list', component: PrestadoresListComponent, canActivate: [ActivateRoutes]}]
    },
    {
        path: 'agendarCitaPrestador',
        children: [{ path: 'list', component: ContratosAgendarCitaListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'calificacionPrestador',
        children: [{ path: 'list', component: CalificacionPrestadoresListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'agendarCitasSalud',
        children: [{ path: 'list', component: AgendarCitaCentroMedicoContratoListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'solicitarCita',
        children: [{ path: 'list', component: SolicitarCitaContratoListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'consultaCitasSolicitud',
        children: [{ path: 'form', component: ConsultasCitasSolicitudFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const prestadoresRouting: ModuleWithProviders = RouterModule.forChild(prestadoresRoutes);