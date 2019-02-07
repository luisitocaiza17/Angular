import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import {CalificacionPrestador , CalificacionPrestadorFilter } from '../model/calificacionPrestador';
import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class CalificacionPrestadorService {

    private prestadorUrl = 'calificacionPrestador';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.prestadorUrl = constantService.API_ENDPOINT + this.prestadorUrl;
    }

    getReportePrestador(filter: CalificacionPrestadorFilter): Observable<CalificacionPrestador> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/getReportePrestador", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    getReportePrestadorList(filter: CalificacionPrestadorFilter): Observable<CalificacionPrestador[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.prestadorUrl + "/getReportePrestadorList", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}