import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { ConfiguracionFacturacion } from '../model/configuracionFacturacion';

@Injectable()
export class ConfiguracionFacturacionService {

    private configUrl = 'configuracionFacturacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.configUrl = constantService.API_ENDPOINT + this.configUrl;
    }

    GetConfiguracion(): Observable<any> {
        return this.authHttp.get(this.configUrl + "/getConfiguracion")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    guardar(filter: ConfiguracionFacturacion): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.configUrl + "/guardar", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}