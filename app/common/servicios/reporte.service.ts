import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { AuditoriaAutorizacionFilter } from '../../common/model/auditoria';
import { AutorizacionFilter, Autorizacion } from '../../common/model/autorizacion';
import { ReporteMovimiento, ReporteMovimientoFilter } from '../../common/model/movimiento';
import { ReclamoEntityFilter } from '../../common/model/reclamo'
import { CalificacionPrestadorFilter } from '../model/calificacionPrestador';
import { TransaccionQuitarCarencias, TransaccionKey } from '../model/transacciones';
import { FilterDocumentoFacturacion } from '../model/facturacion';
import { CitaClienteFilter } from '../model/cobranzas';
import { SolicitudDestacadoFilter, ConsultarCitaFilter } from '../model/cita';
import { PaginationService } from '../../utils/pagination.service';
import { FiltroReportesFacturasEmitidas } from '../model/reportes';

@Injectable()
export class ReporteService extends PaginationService {

    private reportesUrl = 'reportes';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.reportesUrl = constantService.API_ENDPOINT + this.reportesUrl;
    }

    descargarReporteTracking(filter: AuditoriaAutorizacionFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/tracking", body);
    }

    descargarReporteAuditoriasSistema(filter: AuditoriaAutorizacionFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/auditoriasSistema", body);
    }

    descargaReporteAutorizaciones(filter: AutorizacionFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/reporteAutorizaciones", body);
    }

    descargaReporteAutorizacionesInSitu(filter: AutorizacionFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/reporteAutorizacionesInSitu", body);
    }

    descargaReporteMovimientos(filter: ReporteMovimientoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/reporteMovimientos", body);
    }

    descargarReporteOdas(filter: ReclamoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/reporteOdas", body);
    }

    descargarReporteCalificacionPrestadores(filter: CalificacionPrestadorFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/ReporteCalificacionPrestadores", body, null, "SI");
    }

    descargarReporteDocumentosFacturacion(filter: FilterDocumentoFacturacion): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/ReporteDocumentosFacturacion", body, null, "SI");
    }

    descargarReporteGeneralCitasCobranza(filter: CitaClienteFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/GetReporteGeneralCitasCobranza", body, null, "SI");
    }

    descargarReporteRutasCitasCobranza(filter: CitaClienteFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/GetReporteRutasCitasCobranza", body, null, "SI");
    }

    descargarResporteSolicitudCita(filter: SolicitudDestacadoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/GetReporteSolicitudesCita", body, null, "SI");
    }

    descargarReporteCita(filter: ConsultarCitaFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reportesUrl + "/GetReporteCita", body, null, "SI");
    }

    enivarReporteContratoMorosoCobrar(filter: TransaccionKey): Observable<any> {

        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reportesUrl + "/sendMailReporteContratoCobrarMoroso", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    enviarReporteFacturasEmitidas(filter: FiltroReportesFacturasEmitidas): Observable<any> {

        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reportesUrl + "/GetReporteFacturasEmitidas", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}