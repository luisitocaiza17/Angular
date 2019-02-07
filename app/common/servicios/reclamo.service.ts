import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoEntityFilter } from '../model/contrato';
import { Reclamo, ReclamoEntityFilter } from '../model/reclamo';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { Autorizacion } from '../model/autorizacion';
import { PagoInteligente, PagoInteligenteFilter } from '../model/pagoInteligente';
import { DetalleReclamo, DetalleReclamoEntityList } from '../model/detalleReclamo';

@Injectable()
export class ReclamoService extends PaginationService {

    private contratoUrl = 'contratos';
    private reclamoUrl = 'reclamos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.reclamoUrl = constantService.API_ENDPOINT + this.reclamoUrl;
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;
    }

    getReclamoList(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.postPaginated(this.reclamoUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    generarPdf(filter: ReclamoEntityFilter): any {
        var body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.reclamoUrl + "/generarPdf/", body, null, "SI");
    }

    // ODAS
    getByFiltersPaginatedForOdas(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + "/filterForOdas", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getReclamoOdaList(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.postPaginated(this.reclamoUrl + "/filterOda", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    obtenerEstadosReclamo(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.reclamoUrl + "/obtenerEstadosReclamo", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    anularReclamo(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.post(this.reclamoUrl + "/anularReclamo", body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    crearODA(reclamoEntity: Reclamo): Observable<any> {
        let body = JSON.stringify(reclamoEntity);
        return this.authHttp.post(this.reclamoUrl, body, null, "SI")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    enviarEmail(autorizacion: Autorizacion): any {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.reclamoUrl + "/enviarEmail/", body, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getDetalleReclamo(filter: ReclamoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reclamoUrl + "/getDetalleReclamo", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    obtenerInfoPagoInteligente(filter: PagoInteligenteFilter): Observable<PagoInteligente[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reclamoUrl + "/obtenerInfoPagoInteligente", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    ObtenerReporteReclamoOdas(filter: ReclamoEntityFilter, pageNumber: number, pageSize: number): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.reclamoUrl + "/ObtenerReporteReclamoOdas", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}