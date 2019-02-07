import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { DetallePagoEntity, DetallePagoFilter } from '../model/pago';


@Injectable()
export class DetallePagoService extends PaginationService {

    private pagoUrl = 'pago';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.pagoUrl = constantService.API_ENDPOINT + this.pagoUrl;
    }

    obtenerDetallePagoContrato(filter: DetallePagoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.pagoUrl + "/obtenerDetallePago", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

}