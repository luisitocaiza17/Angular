import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { Actividad } from '../model/actividad';


@Injectable()
export class ActividadService {

    private ActividadUrl = 'TIPACTIV';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.ActividadUrl = constantService.SERVICES_ENDPOINT + this.ActividadUrl;
    }

    getAll(): Observable<Actividad[]> {
        return this.authHttp.get(this.ActividadUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
