import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';
import { PaginationService } from '../../utils/pagination.service';

import { Catalogo, CatalogoProgressEntity } from '../model/catalogo';
import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class CatalogoService extends PaginationService {

    private catalogoUrl = 'catalogo';
    private contratoUrl = 'contratos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.catalogoUrl = constantService.API_ENDPOINT + this.catalogoUrl;
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;

    }

    getAccionesAuditadasAutorizacion(): Observable<string[]> {
        return this.authHttp.get(this.catalogoUrl + "/getAccionesAuditadasAutorizacion")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getAccionesAuditadasSistema(): Observable<string[]> {
        return this.authHttp.get(this.catalogoUrl + "/getAccionesAuditadasSistema")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getEstadosAuditados(accion: string): Observable<Catalogo[]> {
        return this.authHttp.get(this.catalogoUrl + "/estadosAuditados/" + accion)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getEstadosAutorizacion(): Observable<Catalogo[]> {
        return this.authHttp.get(this.catalogoUrl + "/getEstadosAutorizacion")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getCiudadesForOdas(): Observable<Catalogo[]> {
        return this.authHttp.get(this.catalogoUrl + "/ciudadesForOdas", null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getSectoresForOdas(): Observable<Catalogo[]> {
        return this.authHttp.get(this.catalogoUrl + "/sectoresForOdas", null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getEspecialidadesForOdas(): Observable<Catalogo[]> {
        return this.authHttp.get(this.catalogoUrl + "/especialidadesForOdas", null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getSubEspecialidadesForOdas(): Observable<Catalogo[]> {
        return this.authHttp.get(this.catalogoUrl + "/subEspecialidadesForOdas", null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getCabeceraMotivoAnulacionContrato(): Observable<CatalogoProgressEntity[]> {
        return this.authHttp.get(this.catalogoUrl + "/motivoCabeceraAnulacionContrato")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getMotivoAnulacionContrato(): Observable<CatalogoProgressEntity[]> {
        return this.authHttp.get(this.catalogoUrl + "/motivoAnulacionContrato")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getCatalogoById(codigoCatalogo: string): Observable<any> {
        return this.authHttp.get(this.catalogoUrl + "/getCatalogoById/" + codigoCatalogo, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    //Ciudad
    obtenerCiudades(): Observable<any> {
        return this.authHttp.get(this.catalogoUrl + "/ObtenerCiudades", null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getResumenContrato(contratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.contratoUrl + "/getResumenContrato", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }





    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}