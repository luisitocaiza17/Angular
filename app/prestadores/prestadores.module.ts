
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { prestadoresRouting } from './prestadores.routing'

import { AgendarCitaListComponent } from './agendarCita.list.component';
import { PrestadoresListComponent } from './consultaPrestadores/prestadores.list.component';
import { AgendarCitaFormComponent } from './agendarCita.form.component';
import { ContratosAgendarCitaListComponent } from './contratosAgendarCita.list.component';
import { CalificacionPrestadoresListComponent } from './calificacionPrestadores.list.component';

import { AgendarCitaCentroMedicoListComponent } from './agendarCentrosMedicos/agendarCitaCentroMedico.form.component';
import { ConsultasCitasSolicitudFormComponent } from './consultaCitaSolicitud/consultasCS.form.component';
import { ConsultarSolicitudFormComponent } from './consultaCitaSolicitud/consultarSolicitud.form.component';
import { ConsultarCitaFormComponent } from './consultaCitaSolicitud/consultarCita.form.component';
import { SolicitarCitaContratoListComponent } from './solicitarCita/solicitarCitaContrato.list.component';
import { SolicitarCitaFormComponent } from './solicitarCita/solicitarCita.form.component';
import { ActualizarConvenioFormComponent } from './consultaPrestadores/actualizarConvenio.form.component';
import { AgregarConvenioFormComponent } from './consultaPrestadores/agregarConvenio.form.component';


import { AgendarCitaCentroMedicoContratoListComponent } from './agendarCentrosMedicos/agendarCentrMedContrato.list.component'

import { CentroMedicoService } from '../common/servicios/centroMedico.service';
import { PrestadorService } from '../common/servicios/prestador.service';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, prestadoresRouting],
    declarations: [AgendarCitaListComponent, PrestadoresListComponent,
        AgendarCitaFormComponent, ContratosAgendarCitaListComponent,
        CalificacionPrestadoresListComponent,
        AgendarCitaCentroMedicoListComponent, SolicitarCitaFormComponent,
        ConsultasCitasSolicitudFormComponent, ConsultarSolicitudFormComponent, ConsultarCitaFormComponent,
        AgendarCitaCentroMedicoContratoListComponent, SolicitarCitaContratoListComponent, ActualizarConvenioFormComponent, AgregarConvenioFormComponent],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [CentroMedicoService, PrestadorService]
})
export class PrestadoresModule { }
