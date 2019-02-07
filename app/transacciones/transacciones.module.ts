
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { transaccionesRouting } from './transacciones.routing'

import { ContratosTxListComponent } from './contratosTx.list.component';
import { TransaccionesFormComponent } from './transacciones.form.component';
import { CorrespondenciaFormComponent } from './cambios/correspondencia.form.component';
import { PlanTxFormComponent } from './cambios/planTx.form.component';
import { TitularTxFormComponent } from './cambios/titularTx.form.component';
import { EmpresaTxFormComponent } from './cambios/empresaTx.form.component';
import { FormaPagoFormComponent } from './pago/formaPago.form.component';
import { PagoInteligenteFormComponent } from './pago/pagoInteligente.form.component';
import { AnulacionFormComponent } from './contrato/anulacion.form.component';
import { AplicacionDescuentoFormComponent } from './contrato/aplicacionDescuento.form.component';
import { FacturacionManualFormComponent } from './contrato/facturacionManual.form.component';
import { ReactivacionFormComponent } from './contrato/reactivacion.form.component';
import { QuitarCarenciasFormComponent } from './contrato/quitarCarencias.form.component';
import { RenovacionFormComponent } from './contrato/renovacion.form.component';
import { SeguroFormComponent } from './otros/seguro.form.component';
import { TransicionFormComponent } from './otros/transicion.form.component';
import { ModBeneficiarioFormComponent } from './otros/modBeneficiario.form.component';
import { EmisionTarjetasFormComponent } from './otros/emisionTarjetas.form.component';
import { MaternidadFormComponent } from './otros/maternidad.form.component';
import { MantenimientoObservacionFormComponent } from './contrato/mantenimientoObservacion.form.component'
import { DesbloqueoMorosidadFormComponent } from './contrato/desbloqueoMorosidad.form.component'
import { ReporteMovimientosComponent } from './reportes/reporteMovimientos.component';
import { ModPrecioFormComponent } from './cambios/modPrecio.form.component';
import { IngresoPreexistenciasFormComponent } from './otros/ingresoPreexistencias.form.component';
import { ComentarioMovimientosComponent } from './comentarioMovimientos/comentario.movimiento.form.component';
import { FrmActualizaPersonaFormComponent } from './clienteUnico/frmActualizaPersona.form.component';
import { PendienteVigenteFormComponent } from './cambios/pendienteVigente.form.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { TransaccionService } from '../common/servicios/transaccion.service';
import { DetalleRemesaService } from '../common/servicios/detalleRemesa.service';
import { ReasignacionCarteraFormComponent } from './otros/reasignacionCartera.form.component';
import { TransaccionesState } from './services/transacciones.state';
import { VentaFamiliarComponent } from './pago/comisiones/individual/component/individual.component';
import { IndividualesService } from './pago/comisiones/service/individuales.service';
import { TransferenciaRemesaComponent } from "./transferencias/TransferenciaRemesaComponent";
import { TransferenciaYCierreFormComponent } from './transferencias/transferenciaYCierre.form.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
    imports: [
        BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, transaccionesRouting, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule,Ng2SmartTableModule
    ],
    declarations: [
        ContratosTxListComponent, TransaccionesFormComponent,TransferenciaYCierreFormComponent ,CorrespondenciaFormComponent, PlanTxFormComponent, TitularTxFormComponent, EmpresaTxFormComponent,
        FormaPagoFormComponent, PagoInteligenteFormComponent, AnulacionFormComponent, DesbloqueoMorosidadFormComponent, FacturacionManualFormComponent,
        ReactivacionFormComponent, QuitarCarenciasFormComponent, RenovacionFormComponent, SeguroFormComponent, TransicionFormComponent, ModBeneficiarioFormComponent, ReasignacionCarteraFormComponent,
        MantenimientoObservacionFormComponent, ReporteMovimientosComponent,TransferenciaRemesaComponent, MaternidadFormComponent, EmisionTarjetasFormComponent, AplicacionDescuentoFormComponent, ModPrecioFormComponent,
        FrmActualizaPersonaFormComponent, IngresoPreexistenciasFormComponent, ComentarioMovimientosComponent, PendienteVigenteFormComponent, VentaFamiliarComponent
    ],
    exports: [
        TransaccionesFormComponent,TransferenciaYCierreFormComponent, CorrespondenciaFormComponent, PlanTxFormComponent, TitularTxFormComponent, EmpresaTxFormComponent, FormaPagoFormComponent,
        PagoInteligenteFormComponent, AnulacionFormComponent, DesbloqueoMorosidadFormComponent, FacturacionManualFormComponent, ReactivacionFormComponent,
        QuitarCarenciasFormComponent, RenovacionFormComponent, SeguroFormComponent, TransicionFormComponent, ModBeneficiarioFormComponent,
        MantenimientoObservacionFormComponent, MaternidadFormComponent, EmisionTarjetasFormComponent, AplicacionDescuentoFormComponent, ModPrecioFormComponent,
        FrmActualizaPersonaFormComponent, IngresoPreexistenciasFormComponent, ComentarioMovimientosComponent, PendienteVigenteFormComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [TransaccionService, DetalleRemesaService, TransaccionesState, IndividualesService]
})
export class TransaccionesModule { }
