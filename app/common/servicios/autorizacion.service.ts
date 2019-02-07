import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoEntityFilter, ContratoEntityList, ContratoKey, Contrato } from '../model/contrato';
import { Autorizacion, AutorizacionValidacionKey, AutorizacionFilter } from '../model/autorizacion';
import { Plan } from '../model/plan';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class AutorizacionService extends PaginationService {

    private contratoUrl = 'contratos';
    private autorizacionUrl = 'autorizacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;
        this.autorizacionUrl = constantService.API_ENDPOINT + this.autorizacionUrl;
    }

    isContratoCoorporativo(codigoProducto: string): boolean {
        return (codigoProducto.toLowerCase() == 'cor' || codigoProducto.toLowerCase() == 'poo') ? true : false;
    }

    // metodo q retorna los contratos para la pantalla de autorizacion
    getByFiltersPaginatedForAutorizacion(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.contratoUrl + "/filterForAutorizacion", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getByFiltersNumeroCaso(filter: ContratoEntityFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.autorizacionUrl + "/getAutorizacionesPorNumeroContrato?filter="+filter.NumeroCaso, body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getAllByFilter(filter: AutorizacionFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.autorizacionUrl + "/getAllByFilter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getReporteAutorizacionesByFilter(filter: AutorizacionFilter, pageNumber: number, pageSize: number): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.autorizacionUrl + "/getReporteAutorizacionesByFilter", body, pageNumber, pageSize)
            .catch(this.authHttp.handleError);
    }

    getReporteAutorizacionesInSituByFilter(filter: AutorizacionFilter, pageNumber: number, pageSize: number): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.autorizacionUrl + "/getReporteAutorizacionesInSituByFilter", body, pageNumber, pageSize)
            .catch(this.authHttp.handleError);
    }

    getOneByFilter(filter: AutorizacionFilter): Observable<Autorizacion> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.autorizacionUrl + "/getOneByFilter", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getOneByFilterForUpdate(filter: AutorizacionFilter): Observable<Autorizacion> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.autorizacionUrl + "/getOneByFilterForUpdate", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    create(autorizacion: Autorizacion): Observable<any> {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.autorizacionUrl, body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    update(autorizacion: Autorizacion): Observable<Autorizacion> {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.put(this.autorizacionUrl + "/" + autorizacion.Id, body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    // Email y FTP
    enviarEmail(autorizacion: Autorizacion): any {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.autorizacionUrl + "/enviarEmail/", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    verificarEnvioCorreoPrevio(autorizacion: Autorizacion): any {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.autorizacionUrl + "/verificarEnvioCorreoPrevio/", body)
            .map((res) => res.json())
            .catch(this.authHttp.handleError);
    }

    enviarFtp(autorizacion: Autorizacion): any {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.autorizacionUrl + "/enviarFtp/", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getLetter(autorizacion: Autorizacion): any {
        return this.authHttp.getGetFile(this.autorizacionUrl + "/getLetter/" + autorizacion.Id
            + "/" + autorizacion.TipoDocumento + "/" + autorizacion.CiudadAutorizacion);
    }

    validacionTipoCobertura(autorizacion: AutorizacionValidacionKey): any {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.autorizacionUrl + "/validacionTipoCobertura/", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    validacionDiagnostico(autorizacion: AutorizacionValidacionKey): any {
        let body = JSON.stringify(autorizacion);
        return this.authHttp.post(this.autorizacionUrl + "/validacionDiagnostico/", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}