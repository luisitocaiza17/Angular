import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Notificacion, NotificacionFilter } from '../model/notificacion';
import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class NotificacionPush {

    private notificacionUrl = 'notificacionPush';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.notificacionUrl = constantService.API_ENDPOINT + this.notificacionUrl;
    }

    setMensajePush(filter: NotificacionFilter): Observable<Notificacion> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.notificacionUrl + "/setMensajePush", body)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}