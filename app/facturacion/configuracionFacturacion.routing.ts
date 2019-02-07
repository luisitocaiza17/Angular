import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionFacturacionFormComponent } from './configuracionFacturacion.form.component';
import { LogErroresFormComponent } from './LogErrores/logErrores.form.component';
import { principalProcesoFacturacionComponent } from './PrincipalProcesoFacturacion/principalProcesoFacturacion.view.component';
import { GenerarInformacionComponent } from './PrincipalProcesoFacturacion/generarInformacionFacturacion/generarInformacion.component.view';
import { DevSaldosFavorContratoListComponent } from './DevSaldosFavor/devSaldosContrato.list.component';

import { ActivateRoutes } from '../utils/activate.routes';
import { GeneracionTxtFacturacionComponent } from './PrincipalProcesoFacturacion/generacionArchivosTxtFacturacion/generacionTxtFacturacion.component.view';
import { RecepcionArchivoRespuestaComponent } from './PrincipalProcesoFacturacion/recepcionArchivoRespuesta/recepcionArchivoRespuesta.component.view';
import { ConsultaRespuestasComponent } from './PrincipalProcesoFacturacion/consultaRespuestas/consultaRespuestas.component.view';
import { GestionRespuestasComponent } from './PrincipalProcesoFacturacion/GestionRespuestas/gestionRespuestas.component.view';
import { ConsultaFacturasComponent } from './PrincipalProcesoFacturacion/consultaFacturas/consultaFacturas.component.view';
import { NotasCreditoContratoListComponent } from './NotasCredito/notasCreditoContrato.list.component';
import { NotasCreditoMasivasFormComponent } from './componentes/notasCreditoMasivas/notasCreditoMasivas.form.component';
import { ReporteViewComponent } from './reportes/reporte.form.component';
import { ConsultasValidacionComponent } from './PrincipalProcesoFacturacion/consultasValidacion/consultasValidacion.component';
import { TareasProgramadasFacturacionFormComponent } from './componentes/tareasProgamadas/tareasProgramadasFacturacion.form.component';
import { ConsultaDocumentosFacturacionComponent } from './componentes/consultaDocumentos/consultaDocumentosFacturacion.component';
import { CotizacionesPrincipalComponent } from './cotizaciones/cotizacionesPrincipal.form.component';
import { ReporteConsultaProblemas } from './reportes/reporteConsultaProblemas.form.component';
import { ReprocesoFacturacionEComponent } from './PrincipalProcesoFacturacion/reprocesoFacturacionElectronica/reprocesoFacturacionE.component';
import { ConsultaErroresFacturacion } from './PrincipalProcesoFacturacion/logErrores/consultaErroresFacturacion.component';
import { ParametroDescuentoComponent } from './descuento/parametroDescuento.component';

const configuracionFacturacionRoutes: Routes = [
    {
        path: 'configuracionFacturacion',
        children: [{ path: 'form', component: ConfiguracionFacturacionFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'logErrores',
        children: [{ path: 'form', component: LogErroresFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'procesoFacturacion',
        children: [{
            path: 'principal', component: principalProcesoFacturacionComponent, canActivate: [ActivateRoutes],
            children: [{ path: 'generarInformacion', component: GenerarInformacionComponent, canActivate: [ActivateRoutes] },
            { path: 'generarTxt', component: GeneracionTxtFacturacionComponent, canActivate: [ActivateRoutes] },
            { path: 'recepcionRespuesta', component: RecepcionArchivoRespuestaComponent, canActivate: [ActivateRoutes] },
            { path: 'consultaRespuesta', component: ConsultaRespuestasComponent, canActivate: [ActivateRoutes] },
            { path: 'consultaFacturas', component: ConsultaFacturasComponent, canActivate: [ActivateRoutes] },
            { path: 'gestionRespuestas', component: GestionRespuestasComponent, canActivate: [ActivateRoutes] },
            { path: 'logErroresFacturacion', component: ConsultaErroresFacturacion, canActivate: [ActivateRoutes] },
            { path: 'consultasValidacion', component: ConsultasValidacionComponent, canActivate: [ActivateRoutes] },
            { path: 'reprocesoFacturacion', component: ReprocesoFacturacionEComponent, canActivate: [ActivateRoutes] }
            ]
        }]
    },
    {
        path: 'devolucionSaldoFavor',
        children: [{ path: 'list', component: DevSaldosFavorContratoListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'notasCredito',
        children: [{ path: 'list', component: NotasCreditoContratoListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'notasCreditoMasivas',
        children: [{ path: 'form', component: NotasCreditoMasivasFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'tareasProgramadasFacturacion',
        children: [{ path: 'form', component: TareasProgramadasFacturacionFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'reportesFacturacion',
        children: [{ path: 'form', component: ReporteViewComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'consultaDocumentosFacturacion', component: ConsultaDocumentosFacturacionComponent, canActivate: [ActivateRoutes]
    },
    {
        path: 'cotizacionesPrincipal',
        children: [{
            path: 'form', component: CotizacionesPrincipalComponent, canActivate: [ActivateRoutes]

        }]
    },
    { path: 'descuentoParametrizacion', component: ParametroDescuentoComponent }

];

export const configuracionFacturacionRouting: ModuleWithProviders = RouterModule.forChild(configuracionFacturacionRoutes);
