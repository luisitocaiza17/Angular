import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { DocumentoFacturacion, ResultadoFacturarCobrosSaludPay } from '../model/facturacion';
import { CotizacionFilter, Cotizacion } from '../model/cotizacion';
import { FiltroFechaDesdeHasta } from '../model/genericos';


@Injectable()
export class FacturacionService extends PaginationService {

    private facturacionUrl = 'facturas';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.facturacionUrl = constantService.API_ENDPOINT + this.facturacionUrl;        
    }

    validarEInsertarInformacionEnTablasFacturacion(): Observable<string> {
        return this.authHttp.get(this.facturacionUrl + "/GenerarInformacionFacturacionElectronica", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarDocumentosTxtFacturacion(): Observable<string> {
        return this.authHttp.get(this.facturacionUrl + "/CrearFacturasEnDisco", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    gestionarDocumentoFacturacion(documentoFacturacion: DocumentoFacturacion ): Observable<string> {
        let body = JSON.stringify(documentoFacturacion);
        return this.authHttp.post(this.facturacionUrl + "/GestionarDocumentoFacturacion", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    facturarCobrosPichincha(filtroFechas: FiltroFechaDesdeHasta, nombreArchivo: string, lugarPago: string): Observable<ResultadoFacturarCobrosSaludPay> {
        let body = JSON.stringify(filtroFechas);
        return this.authHttp.post(this.facturacionUrl + "/FacturarCobrosPichincha?nombreArchivo=" + nombreArchivo + "&lugarPago=" + lugarPago, body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarPdf(filter: CotizacionFilter): any {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.facturacionUrl + "/filter/", body, null, "SI")
                .map( (res) => this.extractRespGenerica(res) )
                .catch(this.authHttp.handleError);

    }

    descgargarDocumentoPdf(cotizacion: Cotizacion): Observable<any>{
        return this.authHttp.getGetFile(this.facturacionUrl + "/descargaDocumentoPDF/" + cotizacion.SerieOficina + "-" + cotizacion.SerieFactura + "-" + cotizacion.Factura + "/"+cotizacion.TipoDocumentoNumero, null);
    }

    descgargarCsvFacturacion(fileName: string): Observable<any>{
        return this.authHttp.postGetFile(this.facturacionUrl + "/descgargarCsvFacturacion?fileName=" + fileName, null, null, "SI");
    }

    descargarArchivoCuadreCaja(fileName: string): Observable<any>{
        return this.authHttp.postGetFile(this.facturacionUrl + "/descargarArchivoCuadreCaja?fileName=" + fileName, null, null, "SI");
    }

    descargarReporteFacturacionCobrosPichincha(fileName: string): Observable<any>{
        return this.authHttp.postGetFile(this.facturacionUrl + "/descargarReporteFacturacionCobrosPichincha?fileName=" + fileName, null, null, "SI");
    }

    generarCuadreCajaPichincha(filtroFechas: FiltroFechaDesdeHasta, fileName: string): Observable<string> {
        let body = JSON.stringify(filtroFechas);
        return this.authHttp.post(this.facturacionUrl + "/GenerarCuadreCajaPichincha?nombreArchivoSalida=" + fileName, body ,null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarArchivoControlFacturas(): Observable<string> {
        return this.authHttp.get(this.facturacionUrl + "/exportarTextControlFacturasQueSeVanAProcesar", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarArchivoEnvioDocumentos(numeroEnvio: number): Observable<string> {
        return this.authHttp.get(this.facturacionUrl + "/exportarTextEnvioDocumentos/" + numeroEnvio , null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarArchivoLogErrores(): Observable<string> {
        return this.authHttp.get(this.facturacionUrl + "/ExportarLogErroresEnTxtParaValidar", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractRespuestaGenerica(res: Response) {
        let body = res.json();
        return body.Datos || {};
    }
}