import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { EjecutivoCuenta } from '../model/ejecutivoCuenta';

@Injectable()
export class EjecutivoCuentaService {

    private ejecutivoCuentaUrl = 'ejecutivoCuenta';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.ejecutivoCuentaUrl = constantService.API_ENDPOINT + this.ejecutivoCuentaUrl;
    }

    getEjecutivosCuentaContrato(codContrato: number, codProducto: string): Observable<EjecutivoCuenta[]> {
        return this.authHttp.get(this.ejecutivoCuentaUrl + "/getEjecutivosCuentaContrato/" + codContrato + "/" + codProducto)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}