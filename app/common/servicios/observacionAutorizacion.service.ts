import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';

import { ObservacionAutorizacion } from '../model/observacionAutorizacion';

@Injectable()
export class ObservacionAutorizacionService {

    private observacionAutorizacionUrl = 'observacionAutorizacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.observacionAutorizacionUrl = constantService.API_ENDPOINT + this.observacionAutorizacionUrl;
    }

    getAll(): Observable<ObservacionAutorizacion[]> {
        return this.authHttp.get(this.observacionAutorizacionUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}