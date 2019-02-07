
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { SpinnerService } from '../utils/spinner.service';
import { FacturarCobrosPichinchaComponent } from './facturarCobros/facturarCobrosPichincha/facturarCobrosPichincha.component';
import { CargarArchivosPichinchaComponent } from './facturarCobros/cargaArchivos.componente/cargaArchivos.component';
import { menuFacturarCobrosCompomnent } from './facturarCobros/menuFacturarCobros.component';
import { recaudosRouting } from './recaudos.routing';
import { CommonModule } from '../facturacion/common/common.module';
import { menuBotonPagoComponent } from './botonPago/menuBotonPago.component';
import { FacturarBotonPagoComponent } from './botonPago/facturarBotonPago/facturarBotonPago.component';
import { CargarArchivosBotonPagoComponent } from './botonPago/cargarArchivosBotonPago/cargaArchivosBotonPago.component';
import { CuadreCajaPichComponent } from './botonPago/cuadreCaja/cuadreCajaPich.component';
import { GenerarArchivosCajaPichComponent } from './botonPago/generarArchivos/generarArchivosCajaPich.component';
import { menuGenerarArchivosDebitosInstitucionesComponent } from './envioDebitosInstituciones/menuGenerarArchivosDebitosInstituciones.component';
import { primerEnvioComponent } from './envioDebitosInstituciones/primerEnvio/primerEnvio.component';
import { ConsultaRemesasComponent } from './envioDebitosInstituciones/Remesas/consultaRemesas.component';
import { RecaudosState } from './services/reacuados.state';
import { IngresoCajaFormComponent } from './componentes/ingresoCaja/ingresoCaja.form.component';
import { EnvioDebitosInstitucionesService } from './services/envioDebitosInstituciones.service';
import { ConsultaDetallesRemesaComponent } from './envioDebitosInstituciones/DetallesRemesa/consultaDetallesRemesa.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReprocesoDebitosComponent } from './envioDebitosInstituciones/Reproceso/reprocesoDebitos.component';
import { menuCargaRespuestasComponent } from './menuCargaRespuestas/menuCargaRespuestas.component';
import { configuracionCargaRespuestasComponent } from './menuCargaRespuestas/configuracionCargaRespuestas/configuracionCargaRespuestas.component';
import { cargaRespuestasComponent } from './menuCargaRespuestas/cargaRespuestas/cargaRespuestas.component';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, recaudosRouting, CommonModule, Ng2SmartTableModule],
    declarations: [
                    FacturarCobrosPichinchaComponent, 
                    CargarArchivosPichinchaComponent,
                    menuFacturarCobrosCompomnent, 
                    menuBotonPagoComponent, 
                    FacturarBotonPagoComponent, 
                    CargarArchivosBotonPagoComponent, 
                    CuadreCajaPichComponent, 
                    GenerarArchivosCajaPichComponent,
                    menuGenerarArchivosDebitosInstitucionesComponent,
                    primerEnvioComponent, 
                    ConsultaRemesasComponent,
                    IngresoCajaFormComponent,
                    ConsultaDetallesRemesaComponent, 
                    ReprocesoDebitosComponent,
                    menuCargaRespuestasComponent,
                    configuracionCargaRespuestasComponent,
                    cargaRespuestasComponent
                  ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SpinnerService, EnvioDebitosInstitucionesService]
})
export class recaudosModule { }
