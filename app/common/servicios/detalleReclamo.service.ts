import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ReclamoEntityFilter } from '../model/reclamo';
import { DetalleReclamo } from '../model/detalleReclamo';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class DetalleReclamoService extends PaginationService {

    private contratoUrl = 'reclamos';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.contratoUrl = constantService.API_ENDPOINT + this.contratoUrl;
    }

    getDetalleReclamoListByReclamoFilter(beneficiarioKey): Observable<any> {
        let body = JSON.stringify(beneficiarioKey);
        return this.authHttp.postPaginated(this.contratoUrl + "/getDetalleReclamoListByReclamoFilter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

}