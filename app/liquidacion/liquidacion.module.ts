
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { liquidacionRouting } from './liquidacion.routing'
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { BeneficiarioService } from '../common/servicios/beneficiario.service';
import { DiagnosticoService } from '../common/servicios/diagnostico.service';
import { EjecutivoCuentaService } from '../common/servicios/ejecutivoCuenta.service';
import { PlanService } from '../common/servicios/plan.service';
import { ProcedimientoService } from '../common/servicios/procedimiento.service';
import { ParentescoService } from '../common/servicios/parentesco.service';
import { MotivoDiagnosticoNoCubiertoService } from '../common/servicios/motivoDiagnostivoNoCubierto.service';
import { ObservacionAutorizacionService } from '../common/servicios/observacionAutorizacion.service';

import { ContratosLiquidacionListComponent } from './contratosLiquidacion.list.component';
import { LiquidacionListComponent } from './liquidacion.list.component';
import { LiquidacionFormComponent } from './liquidacion.form.component';
import { EncabezadoLiquidacionFormComponent } from './components/encabezadoLiquidacion.form.component';
import { EmailFtpFormComponent } from './components/emailFtp.form.component';
import { CoberturaDiagnosticoLiquidacionFormComponent } from './components/coberturaDiagnosticoLiquidacion.form.component';
import { ProcedimientoFormComponent } from './components/procedimiento.form.component';

import { ExclusionComponentModule } from '../components/common/exclusiones/exclusiones.module';
import { AutorizacionComponentModule } from '../components/common/autorizaciones/autorizaciones.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, ExclusionComponentModule,
        AutorizacionComponentModule, liquidacionRouting, NgxPaginationModule, NKDatetimeModule,
        CustomFormsModule],
    declarations: [ContratosLiquidacionListComponent, LiquidacionListComponent,
        LiquidacionFormComponent, EncabezadoLiquidacionFormComponent,
        CoberturaDiagnosticoLiquidacionFormComponent, EmailFtpFormComponent,
        ProcedimientoFormComponent ],
    exports: [LiquidacionListComponent, LiquidacionFormComponent, 
        EncabezadoLiquidacionFormComponent, CoberturaDiagnosticoLiquidacionFormComponent,
        EmailFtpFormComponent, ProcedimientoFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [AutorizacionService, BeneficiarioService, DiagnosticoService, EjecutivoCuentaService,
        PlanService, ProcedimientoService, ParentescoService, MotivoDiagnosticoNoCubiertoService,
        ObservacionAutorizacionService]
})
export class LiquidacionModule { }
