import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Procedimiento, ProcedimientoFilter } from '../model/procedimiento';
import { Plan } from '../model/plan';

import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class ProcedimientoService {

    private procedimientoUrl = 'procedimiento';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.procedimientoUrl = constantService.API_ENDPOINT + this.procedimientoUrl;
    }

    getOneByKey(plan: Plan): Observable<Procedimiento> {
        let body = JSON.stringify(plan);
        return this.authHttp.post(this.procedimientoUrl + "/getOneByKey/", body)
            .map((res) => res.json())
            .catch(this.authHttp.handleError);
    }

    getByFilterPaginated(filter: ProcedimientoFilter, pageNumber: number, pageSize: number): Observable<Procedimiento[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.procedimientoUrl + "/getByFilterPaginated", body, pageNumber, pageSize)
            .catch(this.authHttp.handleError);
    }

    getForValorPuntoByFilterPaginated(filter: ProcedimientoFilter, pageNumber: number, pageSize: number): Observable<Procedimiento[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.procedimientoUrl + "/getForValorPuntoByFilterPaginated", body, pageNumber, pageSize)
            .catch(this.authHttp.handleError);
    }    

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}