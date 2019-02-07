import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';

import { AuditoriaAutorizacion, AuditoriaAutorizacionFilter } from '../model/auditoria';
import { PaginationService } from '../../utils/pagination.service';
import { ConstantService } from '../../utils/constant.service';
import { EmailTracking } from '../model/emailTracking';

@Injectable()
export class AuditoriaAutorizacionService extends PaginationService {

    private auditoriaAutorizacionUrl = 'auditoriaAutorizacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.auditoriaAutorizacionUrl = constantService.API_ENDPOINT + this.auditoriaAutorizacionUrl;
    }

    getAllPaginated(): Observable<AuditoriaAutorizacion[]> {
        return this.authHttp.getPaginated(this.auditoriaAutorizacionUrl, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getByFiltersPaginated(filter: AuditoriaAutorizacionFilter): Observable<AuditoriaAutorizacion[]> {
        let body = JSON.stringify(filter);

        return this.authHttp.postPaginated(this.auditoriaAutorizacionUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getById(id: number): Observable<AuditoriaAutorizacion> {
        return this.authHttp.get(this.auditoriaAutorizacionUrl + "/" + id)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    emailTracking(idTracking: string): Observable<EmailTracking[]> {
        return this.authHttp.get(this.auditoriaAutorizacionUrl + "/emailTracking/" + idTracking)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    verArchivoCorte(idAuditoria: number): Observable<any> {
        return this.authHttp.getGetFile(this.auditoriaAutorizacionUrl + "/archivoCorte/" + idAuditoria);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}