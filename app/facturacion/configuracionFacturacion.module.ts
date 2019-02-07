
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { configuracionFacturacionRouting } from './configuracionFacturacion.routing'

import { ConfiguracionFacturacionFormComponent } from './configuracionFacturacion.form.component';
import { LogErroresFormComponent } from './LogErrores/logErrores.form.component';
import { principalProcesoFacturacionComponent } from './PrincipalProcesoFacturacion/principalProcesoFacturacion.view.component';
import { GenerarInformacionComponent } from './PrincipalProcesoFacturacion/generarInformacionFacturacion/generarInformacion.component.view';
import { menuPrincipalFacturacionComponent } from './PrincipalProcesoFacturacion/menuPrincipal/menuPrincipal.component';
import { GeneracionTxtFacturacionComponent } from './PrincipalProcesoFacturacion/generacionArchivosTxtFacturacion/generacionTxtFacturacion.component.view';
import { RecepcionArchivoRespuestaComponent } from './PrincipalProcesoFacturacion/recepcionArchivoRespuesta/recepcionArchivoRespuesta.component.view';
import { ConsultaRespuestasComponent } from './PrincipalProcesoFacturacion/consultaRespuestas/consultaRespuestas.component.view';
import { ConsultaFacturasComponent } from './PrincipalProcesoFacturacion/consultaFacturas/consultaFacturas.component.view';
import { GestionRespuestasComponent } from './PrincipalProcesoFacturacion/GestionRespuestas/gestionRespuestas.component.view';
import { DevSaldosFavorContratoListComponent } from './DevSaldosFavor/devSaldosContrato.list.component';
import { DevSaldosFormComponent } from './DevSaldosFavor/devSaldos.form.component';
import { NotasCreditoContratoListComponent } from './NotasCredito/notasCreditoContrato.list.component';
import { NotasCredito } from './NotasCredito/notasCredito.form.component';
import { NotasCreditoMasivasFormComponent } from './componentes/notasCreditoMasivas/notasCreditoMasivas.form.component';


import { CommonModule } from './common/common.module';
import { SpinnerService } from '../utils/spinner.service';
import { ReporteViewComponent } from './reportes/reporte.form.component';
import { RepContratosCobrarMorososFormComponent } from './reportes/repContratosCobrarMorosos.form.component';
import { ReporteFacturasEmitidasFormComponent } from './reportes/reporteFacturasEmitidas.form.component';
import { ConsultasValidacionComponent } from './PrincipalProcesoFacturacion/consultasValidacion/consultasValidacion.component';
import { TareasProgramadasFacturacionFormComponent } from './componentes/tareasProgamadas/tareasProgramadasFacturacion.form.component';
import { NotasCreditoPCAFormComponent } from './componentes/tareasProgamadas/emisionNotasCreditoPCA/notasCreditoPca.form.component';
import { NotasCreditoLoteForm } from './componentes/tareasProgamadas/emisionNotasLote/notasCreditoLote.form.component';
import { ConsultaDocumentosFacturacionComponent } from './componentes/consultaDocumentos/consultaDocumentosFacturacion.component';
import { CotizacionesPrincipalComponent } from './cotizaciones/cotizacionesPrincipal.form.component';
import { ReprocesoFacturacionEComponent } from './PrincipalProcesoFacturacion/reprocesoFacturacionElectronica/reprocesoFacturacionE.component';
import { ReporteConsultaProblemas } from './reportes/reporteConsultaProblemas.form.component';
import { ConsultaErroresFacturacion } from './PrincipalProcesoFacturacion/logErrores/consultaErroresFacturacion.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ParametroDescuentoComponent } from './descuento/parametroDescuento.component';


@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, configuracionFacturacionRouting, CommonModule, Ng2SmartTableModule],
    declarations: [
        ConfiguracionFacturacionFormComponent,
        LogErroresFormComponent,
        principalProcesoFacturacionComponent,
        GenerarInformacionComponent,
        menuPrincipalFacturacionComponent,
        GeneracionTxtFacturacionComponent,
        RecepcionArchivoRespuestaComponent,
        ConsultaRespuestasComponent,
        ConsultaFacturasComponent,
        GestionRespuestasComponent,
        DevSaldosFavorContratoListComponent,
        DevSaldosFormComponent,
        NotasCreditoContratoListComponent,
        NotasCredito,
        NotasCreditoMasivasFormComponent,
        ReporteViewComponent,
        RepContratosCobrarMorososFormComponent,
        ReporteFacturasEmitidasFormComponent,
        ConsultasValidacionComponent,
        TareasProgramadasFacturacionFormComponent,
        NotasCreditoPCAFormComponent,
        NotasCreditoLoteForm,
        ConsultaDocumentosFacturacionComponent,
        CotizacionesPrincipalComponent,
        ReprocesoFacturacionEComponent,
        ReporteConsultaProblemas,
        ConsultaErroresFacturacion,
        ParametroDescuentoComponent
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SpinnerService]
})
export class ConfiguracionFacturacionModule { }
