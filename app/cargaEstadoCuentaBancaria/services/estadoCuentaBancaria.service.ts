import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { ColumnaBdd } from '../model/estadoCuentaBancaria.model';

@Injectable()
export class EstadoCuentaBancariaService extends PaginationService {

    private serviceUrl = 'EstadoCuentaBancaria';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.serviceUrl = constantService.API_ENDPOINT + this.serviceUrl;
    }

    getEstructuraEstadoCuentaBancaria(): Observable<ColumnaBdd[]> {
        return this.authHttp.get(this.serviceUrl + "/GetEstructuraEstadoCuentaBancaria", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
} 
