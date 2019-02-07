import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Cotizacion, CotizacionFilter } from '../model/cotizacion';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class CotizacionService extends PaginationService {

    private cotizacionUrl = 'cotizacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.cotizacionUrl = constantService.API_ENDPOINT + this.cotizacionUrl;
    }

    getByFiltersPaginated(filter: CotizacionFilter): Observable<Cotizacion[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.cotizacionUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getOneByKey(key: CotizacionFilter): Observable<Cotizacion> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.cotizacionUrl + "/getOneByKey", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}