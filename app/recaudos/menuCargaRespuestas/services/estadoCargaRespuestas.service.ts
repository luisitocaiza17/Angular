import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../../utils/constant.service';
import { PaginationService } from '../../../utils/pagination.service';
import { ColumnaBdd } from '../model/estadoCargaRespuestas.model';

@Injectable()
export class EstadoCargaRespuestasService extends PaginationService {

    private serviceUrl = 'CargaRespuestas';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.serviceUrl = constantService.API_ENDPOINT + this.serviceUrl;
    }

    getEstructuraCargaRespuestasBanco(): Observable<ColumnaBdd[]> {
        return this.authHttp.get(this.serviceUrl + "/GetEstructuraCargaRespuestasBanco", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
} 
