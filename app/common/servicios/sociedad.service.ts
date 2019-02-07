import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { Sociedad } from '../model/sociedad';


@Injectable()
export class SociedadService {

    private SociedadUrl = 'TIPSOCIE';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.SociedadUrl = constantService.SERVICES_ENDPOINT;
    }

    getAll(): Observable<Sociedad[]> {
        return this.authHttp.get(this.SociedadUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
