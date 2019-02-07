import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';

import { AuditoriaSistema, AuditoriaAutorizacionFilter } from '../model/auditoria';
import { PaginationService } from '../../utils/pagination.service';
import { ConstantService } from '../../utils/constant.service';
import { EmailTracking } from '../model/emailTracking';

@Injectable()
export class AuditoriaSistemaService extends PaginationService {

    private auditoriaSistemaUrl = 'auditoriaSistema';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.auditoriaSistemaUrl = constantService.API_ENDPOINT + this.auditoriaSistemaUrl;
    }

    getAllPaginated(): Observable<AuditoriaSistema[]> {
        return this.authHttp.getPaginated(this.auditoriaSistemaUrl, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getByFiltersPaginated(filter: AuditoriaAutorizacionFilter): Observable<AuditoriaSistema[]> {
        let body = JSON.stringify(filter);

        return this.authHttp.postPaginated(this.auditoriaSistemaUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getById(id: number): Observable<AuditoriaSistema> {
        return this.authHttp.get(this.auditoriaSistemaUrl + "/" + id)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}