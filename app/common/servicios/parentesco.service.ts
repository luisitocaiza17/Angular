import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Parentesco } from '../model/parentesco';

import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class ParentescoService {
    private parentescoUrl = 'parentesco';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.parentescoUrl = constantService.API_ENDPOINT + this.parentescoUrl;
    }

    getParentescosContrato(codContrato: number): Observable<Parentesco[]> {
        return this.authHttp.get(this.parentescoUrl + "/getParentescosContrato/" + codContrato)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}