import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { Rol } from '../model/rol';


@Injectable()
export class RolService {

    private rolUrl = 'rol';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.rolUrl = constantService.API_ENDPOINT + this.rolUrl;
    }

    getAll(): Observable<Rol[]> {
        return this.authHttp.get(this.rolUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}