import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { CorrespondenciaEntity, ContratoEntityFilter, ContratoKey } from '../model/contrato';
import { PlanContrato } from '../model/plan';
import { FactorEntity } from '../model/factor';
import { BeneficiarioList, BeneficiarioDescuentoTransaccionEntity } from '../model/beneficiario';
import { MovimientoFilter } from '../model/movimiento';
import { ReversarTarjetaFilter, DatosCorrespondencia, DatosFacturacionManual, DatosCreaServicioBeneficiario, DatosValidacionDocumento, DatosModificaBeneficiarios, FilterEmisionTarjetas, DatosEmisionTarjetas, DatosTransaccion, DatosAnulacionContrato, TransaccionKey, DatosReactivacionContrato, DatosPI, DatosFormaPago, DatosPlan, DatosRenovacion, DatosMaternidad, TransaccionQuitarCarencias, DatosContratoTransaccionBeneficiarioEntity, DatosAplicarDescuentoBeneficiarioEntity } from '../model/transacciones';
import { ServiciosEntity, FilterSevicio, DatosServicioEntity } from '../model/servicioAdicionalPersona';
import { ReciboCobranzaPdfIndividual } from "../../common/model/cobranza";
import { BancoEntity } from '../model/genericos';
import { RemesaEntity } from '../model/remesa';
import { DetalleRemesa, OneDetalleRemesa } from '../model/detalleRemesa';

@Injectable()
export class TransaccionService extends PaginationService {

    private contratoUrl = 'contratos';
    private transaccionUrl = 'transaccion';
    private pdfUrl = 'transaccion';



    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;
        this.transaccionUrl = constantService.API_ENDPOINT + this.transaccionUrl;
        this.pdfUrl = constantService.API_ENDPOINT + this.pdfUrl;
    }

    getByFiltersTransaccionPaginated(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + "/filterForTransacciones", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    // TRANSACCION Bloquear/Desbloquear MOROSIDAD
    actualizarMorosidad(key: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/actualizarMorosidad", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // TRANSACCION ANULAR CONTRATO
    getDatosAnulacion(key: TransaccionKey): Observable<DatosAnulacionContrato> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/getDatosAnulacion", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // TRANSACCION ACTUALIZAR OBSERVACION CONTRATO
    actualizarObservacion(key: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/actualizarObservacion", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // TRANSACIONES REACTIVAR CONTRATO
    reactivarContrato(key: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/reactivarContarto", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getFechaContratoAnulacion(codigoContrato: number): Observable<Date> {
        let body = JSON.stringify(codigoContrato);
        return this.authHttp.post(this.transaccionUrl + "/hola", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getDatosReactivacion(contratoKey: ContratoKey): Observable<DatosReactivacionContrato> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosReactivacion", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getDatosPlan(contratoKey: ContratoKey): Observable<DatosPlan> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosPlan", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getDatosPlanRetencion(contratoKey: ContratoKey): Observable<DatosPlan> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosPlanRetencion", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // CARGAR DATOS INICIALES PARA PI
    getDatosPI(contratoKey: ContratoKey): Observable<DatosPI> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosPI", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    modificarPagoInteligente(filter: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/modificaPI", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //TRANSFERENCIA Y CIERRE REMESA
    getBancos(): Observable<BancoEntity[]> {
        return this.authHttp.post(this.transaccionUrl + "/getBancos", null)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getRemesaByBanco(banco: BancoEntity): (Observable<RemesaEntity[]>) {
        let body = JSON.stringify(banco);
        return this.authHttp.post(this.transaccionUrl + "/getRemesaByBancos", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getDetalleRemesaByRemesa(remesa: RemesaEntity): (Observable<DetalleRemesa[]>) {
        let body = JSON.stringify(remesa);
        return this.authHttp.post(this.transaccionUrl + "/getDetalleRemesaByRemesa", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getOneDetalleRemesa(remesa: OneDetalleRemesa): (Observable<DetalleRemesa>) {
        let body = JSON.stringify(remesa);
        return this.authHttp.post(this.transaccionUrl + "/getOneDetalleRemesa", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    transferenciaRemesaContrato(detalleRemesa: DetalleRemesa): Observable<any> {
        let body = JSON.stringify(detalleRemesa);
        return this.authHttp.post(this.transaccionUrl + "/transferenciaRemesaContrato", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    transferenciaRemesaOtroBanco(detalleRemesa: DetalleRemesa): Observable<any> {
        let body = JSON.stringify(detalleRemesa);
        return this.authHttp.post(this.transaccionUrl + "/transferenciaRemesaOtroBanco", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    cierreTotalRemesa(remesa: RemesaEntity): Observable<any> {
        let body = JSON.stringify(remesa);
        return this.authHttp.post(this.transaccionUrl + "/cierreTotalRemesa", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    // CARGAR DATOS INICIALES PARA FORMA DE PAGO
    getDatosFormaPago(contratoKey: ContratoKey): Observable<DatosFormaPago> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosFormaPago", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    modificarFormaPago(filter: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/modificaFormaPago", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    actualizarCuotas(filter: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/actualizarCuotas", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getReactivacionPDF(contratoKey: ContratoKey): any {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postGetFile(this.transaccionUrl + "/generarPdfReactivacion", body)

    }

    cambiaPlan(planContrato: PlanContrato): Observable<boolean> {
        let body = JSON.stringify(planContrato);
        return this.authHttp.post(this.transaccionUrl + "/cambiaPlan", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getDatosRenovacion(contratoKey: ContratoKey): Observable<DatosRenovacion> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosRenovacion", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    renovarContrato(contratoKey: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/renovarContrato", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    getTableBenficiarios(contratoKey: ContratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postPaginated(this.transaccionUrl + "/datosMaternidad", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    // APLICAR MATERNIDAD
    aplicarMaternidad(datosMaternidad: DatosMaternidad): Observable<DatosTransaccion> {
        let body = JSON.stringify(datosMaternidad);
        return this.authHttp.post(this.transaccionUrl + "/aplicarMaternidad", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //GET DATOS EMISIO TARJETAS
    getDatosEmisionTarjetas(contratoKey: ContratoKey): Observable<DatosEmisionTarjetas> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/datosEmisionTarjetas", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    //EMITIR TARJETA ADICIONAL
    emitirTarjetas(filter: FilterEmisionTarjetas): Observable<DatosTransaccion> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/emitirTarjetas", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //GET DATOS MODIFICA BENEFICIARIOS
    getDatosModificaBeneficiarios(contratoKey: ContratoKey): Observable<DatosModificaBeneficiarios> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/getDatosModificaBeneficiarios", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    //VALIDA DOCUMENTO MODIFICA BENEFICIARIOS
    validarDocumento(tipoDocumento: number, documento: string): Observable<DatosValidacionDocumento> {
        return this.authHttp.get(this.transaccionUrl + "/validarDocumento/" + tipoDocumento + "/" + documento)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    //SERVICIO AICIONAL
    PrecioServicio2(filter: FilterSevicio): Observable<DatosServicioEntity> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/getPrecioServicio2", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    //ANULAR SERVICIO ADICIONAL BENEFICIARIO
    anulaServicioBenenficiario(filter: ServiciosEntity): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.transaccionUrl + "/anulaServicioBeneficiario", body);
    }

    //CREAR SERVICIO ADICIONAL BENEFICIARIO
    crearServicioBenenficiario(datos: DatosCreaServicioBeneficiario): Observable<any> {
        let body = JSON.stringify(datos);
        return this.authHttp.postGetFile(this.transaccionUrl + "/crearServicioBeneficiario", body, null, "SI");
    }

    //GET PRECIO SUGERIO PR51
    getPrecioSugerido(beneficiario: BeneficiarioList): Observable<FactorEntity> {
        let body = JSON.stringify(beneficiario);
        return this.authHttp.post(this.transaccionUrl + "/getPrecioSugerido/", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    //CREAR SERVICIO ADICIONAL BENEFICIARIO
    crearActualizarBenenficiario(filter: DatosMaternidad): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/crearActualizarBenenficiario", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //Notificar creacion veneficiario
    sendNotificarBeneficiario(filter: DatosMaternidad): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/sendNotificarBeneficiario", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }


    // TRANSACIONES INGRESAR DESCUENTO
    aplicarDescuento(key: ContratoKey): Observable<DatosTransaccion> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/aplicarDescuento", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    aplicarDescuentoPorBeneficiario(key: DatosAplicarDescuentoBeneficiarioEntity[]): Observable<DatosTransaccion> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/aplicarDescuentoPorBeneficiario", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //ANULARCUOTA
    anularCotizacion(filter: DatosFacturacionManual): Observable<DatosTransaccion> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/anularCotizacion", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //CREAR CUOTA
    crearCotizacion(contratoKey: ContratoKey): Observable<DatosTransaccion> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.transaccionUrl + "/crearCotizacion", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    // TRANSACCION ANULAR CONTRATO
    gatDatosCorrespondencia(filter: TransaccionKey): Observable<DatosCorrespondencia> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/getDatosCorrespondencia", body, null, 'SI')
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // TRANSACCION ANULAR CONTRATO
    actualizarCorrespondencia(filter: CorrespondenciaEntity): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/updateCorrespondencia", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //GETDATOSREVERSOTARJETA
    getDatosReversoTarjeta(contratoKey: MovimientoFilter): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postPaginated(this.transaccionUrl + "/getDatosreversoTarjeta", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    //REVERSAR TARJETA ADICIONAL
    reversarTarjeta(filter: ReversarTarjetaFilter): Observable<DatosTransaccion> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.transaccionUrl + "/reversarTarjeta", body)
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    //QUITAR CARENCIAS
    quitarCarencias(datos: TransaccionQuitarCarencias): Observable<any> {
        let body = JSON.stringify(datos);
        return this.authHttp.post(this.transaccionUrl + "/quitarCarencias", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    //ACTUALIZA CARENCIAS
    actualizarCarencias(datos: TransaccionQuitarCarencias): Observable<any> {
        let body = JSON.stringify(datos);
        return this.authHttp.post(this.transaccionUrl + "/actualizarCarencias", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    //REACTIVA CARENCIAS
    reactivarCarencias(datos: TransaccionQuitarCarencias): Observable<any> {
        let body = JSON.stringify(datos);
        return this.authHttp.post(this.transaccionUrl + "/reactivarCarencias", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerBeneficiarios(datos: DatosContratoTransaccionBeneficiarioEntity): Observable<BeneficiarioDescuentoTransaccionEntity[]> {
        let body = JSON.stringify(datos);
        return this.authHttp.post(this.transaccionUrl + "/getBeneficiariosTransaccion", body, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    GenerarPdfFormularioMovimiento(_contratoKey: ContratoKey, asunto: string): any {
        var body = JSON.stringify(_contratoKey);
        return this.authHttp.postGetFile(this.pdfUrl + "/sendPdfFormularioMovimiento/" + asunto, body, null, "SI");
    }

    GenerarPdfFormularioMovimientoCambioPlan(_contratoKey: ContratoKey, asunto: string): any {
        var body = JSON.stringify(_contratoKey);
        return this.authHttp.postGetFile(this.pdfUrl + "/sendPdfFormularioMovimientoCambioPlan/" + asunto, body, null, "SI");
    }

    anularContrato(key: ContratoKey): Observable<boolean> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.transaccionUrl + "/anularContrato", body, null, "SI")
            .map(res => res.json())
            .catch(this.authHttp.handleError);
    }

    GenerarPdfFormularioMovimientoCambioFormaPago(_contratoKey: ContratoKey, asunto: string): any {
        var body = JSON.stringify(_contratoKey);
        return this.authHttp.postGetFile(this.pdfUrl + "/sendPdfFormularioMovimientoCambioFormaPago/" + asunto, body, null, "SI");
    }

    CambiarPendienteVigente(contrato: ContratoKey): Observable<ReciboCobranzaPdfIndividual> {
        let body = JSON.stringify(contrato);
        return this.authHttp.post(this.transaccionUrl + "/cambiarPendienteVigente", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private extractRespuestaGenerica(res: Response) {
        let body = res.json();
        return body.Datos || {};
    }



}