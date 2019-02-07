import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import {OrdenAtencion , OrdenAtencionFilter } from '../model/ordenAtencion';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class OrdenAtencionService extends PaginationService{

    private ordenUrl = 'ordenAtencion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.ordenUrl = constantService.API_ENDPOINT + this.ordenUrl;        
    }

    obtenerOrdenesAtencionRedSalud(filter: OrdenAtencionFilter): Observable<OrdenAtencion[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.ordenUrl + "/obtenerOrdenesAtencionRedSalud", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}