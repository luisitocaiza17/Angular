
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { autorizacionRouting } from './autorizacion.routing'
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { BeneficiarioService } from '../common/servicios/beneficiario.service';
import { DiagnosticoService } from '../common/servicios/diagnostico.service';
import { EjecutivoCuentaService } from '../common/servicios/ejecutivoCuenta.service';
import { PlanService } from '../common/servicios/plan.service';
import { ProcedimientoService } from '../common/servicios/procedimiento.service';
import { ParentescoService } from '../common/servicios/parentesco.service';
import { MotivoDiagnosticoNoCubiertoService } from '../common/servicios/motivoDiagnostivoNoCubierto.service';
import { ObservacionAutorizacionService } from '../common/servicios/observacionAutorizacion.service';

import { ContratosAutorizacionListComponent } from './contratosAutorizacion.list.component';
import { AutorizacionListComponent } from './autorizacion.list.component';
import { AutorizacionFormComponent } from './autorizacion.form.component';
import { AutorizacionEditFormComponent } from './autorizacion.edit.form.component';
import { EncabezadoFormComponent } from './components/encabezado.form.component';
import { HistorialObservacionForm } from './components/historialObservacion.form.component';
import { EmailFtpFormComponent } from './components/emailFtp.form.component';
import { CoberturaDiagnosticoFormComponent } from './components/coberturaDiagnostico.form.component';
import { ProcedimientoFormComponent } from './components/procedimiento.form.component';
import { ReporteAutorizacionesComponent } from './reporteAutorizaciones.component';
import { ReporteAutorizacionesInSituComponent } from './reporteAutorizacionesInSitu.component';

import { ExclusionComponentModule } from '../components/common/exclusiones/exclusiones.module';
import { AutorizacionComponentModule } from '../components/common/autorizaciones/autorizaciones.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, ExclusionComponentModule,
        AutorizacionComponentModule, autorizacionRouting, NgxPaginationModule, NKDatetimeModule,
        CustomFormsModule],
    declarations: [ContratosAutorizacionListComponent, AutorizacionListComponent,
        AutorizacionFormComponent, AutorizacionEditFormComponent, EncabezadoFormComponent,
        CoberturaDiagnosticoFormComponent, HistorialObservacionForm, EmailFtpFormComponent,
        ProcedimientoFormComponent, ReporteAutorizacionesComponent, ReporteAutorizacionesInSituComponent],
    exports: [AutorizacionListComponent, AutorizacionFormComponent, AutorizacionEditFormComponent,
        EncabezadoFormComponent, CoberturaDiagnosticoFormComponent, HistorialObservacionForm,
        EmailFtpFormComponent, ProcedimientoFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [AutorizacionService, BeneficiarioService, DiagnosticoService, EjecutivoCuentaService,
        PlanService, ProcedimientoService, ParentescoService, MotivoDiagnosticoNoCubiertoService,
        ObservacionAutorizacionService]
})
export class AutorizacionModule { }
