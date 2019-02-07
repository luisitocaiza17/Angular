import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivateRoutes } from '../utils/activate.routes';
import { CargarArchivosPichinchaComponent } from './facturarCobros/cargaArchivos.componente/cargaArchivos.component';
import { FacturarCobrosPichinchaComponent } from './facturarCobros/facturarCobrosPichincha/facturarCobrosPichincha.component';
import { menuFacturarCobrosCompomnent } from './facturarCobros/menuFacturarCobros.component';
import { FacturarBotonPagoComponent } from './botonPago/facturarBotonPago/facturarBotonPago.component';
import { CargarArchivosBotonPagoComponent } from './botonPago/cargarArchivosBotonPago/cargaArchivosBotonPago.component';
import { menuBotonPagoComponent } from './botonPago/menuBotonPago.component';
import { CuadreCajaPichComponent } from './botonPago/cuadreCaja/cuadreCajaPich.component';
import { GenerarArchivosCajaPichComponent } from './botonPago/generarArchivos/generarArchivosCajaPich.component';
import { menuGenerarArchivosDebitosInstitucionesComponent } from './envioDebitosInstituciones/menuGenerarArchivosDebitosInstituciones.component';
import { primerEnvioComponent } from './envioDebitosInstituciones/primerEnvio/primerEnvio.component';
import { ConsultaRemesasComponent } from './envioDebitosInstituciones/Remesas/consultaRemesas.component';
import { IngresoCajaFormComponent } from './componentes/ingresoCaja/ingresoCaja.form.component';
import { ConsultaDetallesRemesaComponent } from './envioDebitosInstituciones/DetallesRemesa/consultaDetallesRemesa.component';
import { ReprocesoDebitosComponent } from './envioDebitosInstituciones/Reproceso/reprocesoDebitos.component';
import { menuCargaRespuestasComponent } from './menuCargaRespuestas/menuCargaRespuestas.component';
import { configuracionCargaRespuestasComponent } from './menuCargaRespuestas/configuracionCargaRespuestas/configuracionCargaRespuestas.component';
import { cargaRespuestasComponent } from './menuCargaRespuestas/cargaRespuestas/cargaRespuestas.component';

const recaudosRoutes: Routes = [
    {
        path: 'facturarCobros', component: menuFacturarCobrosCompomnent, canActivate: [ActivateRoutes], 
        children: [
            {
                path: 'cobrosPichincha', component: FacturarCobrosPichinchaComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'cargaArchivosPichincha', component: CargarArchivosPichinchaComponent, canActivate: [ActivateRoutes]
            }
        ]
    }, 
    {
        path: 'botonPago', component: menuBotonPagoComponent, canActivate: [ActivateRoutes], 
        children: [
            {
                path: 'facturarBotonPago', component: FacturarBotonPagoComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'cargarArchivosBotonPago', component: CargarArchivosBotonPagoComponent, canActivate: [ActivateRoutes]
            }, 
            {
                path: 'cuadreCajaPichincha', component: CuadreCajaPichComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'generarArchivosCajaPichincha', component: GenerarArchivosCajaPichComponent, canActivate: [ActivateRoutes]
            }
        ], 
    },
    {
        path: 'genearArchivosDebitosInstituciones', component: menuGenerarArchivosDebitosInstitucionesComponent, canActivate: [ActivateRoutes], 
        children: [
            {
                path: 'consultaRemesas', component: ConsultaRemesasComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'consultaDetallesRemesa', component: ConsultaDetallesRemesaComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'primerEnvio', component: primerEnvioComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'reproceso', component: ReprocesoDebitosComponent, canActivate: [ActivateRoutes]
            }
        ]
    },
    {
        path: 'ingresoCaja',
        children: [{ path: 'form', component: IngresoCajaFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'menuCargaRespuestas', component: menuCargaRespuestasComponent, canActivate: [ActivateRoutes], 
        children: [
            {
                path: 'configuracionCargaRespuestas', component: configuracionCargaRespuestasComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'cargaRespuestas', component: cargaRespuestasComponent, canActivate: [ActivateRoutes]
            }
        ]
    },
];

export const recaudosRouting: ModuleWithProviders = RouterModule.forChild(recaudosRoutes);
