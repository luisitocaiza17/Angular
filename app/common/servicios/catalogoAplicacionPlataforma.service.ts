import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ContratoKey } from '../../common/model/contrato';

import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class CatalogoAplicacionPlataforma {

    private url = '';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.url = constantService.URL_CATALOGO_APLICACION_PLATAFORMA.toString();
    }

    getId(nemonico: string): Observable<any> {
        return this.authHttp.get(this.url + nemonico, null, "SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}