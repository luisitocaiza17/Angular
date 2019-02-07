import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';
import { UsuarioAdmin } from '../../common/model/admin';

import { ConstantService } from '../../utils/constant.service';
import { DesgravamenFilter } from '../model/desgravamen';

@Injectable()
export class DesgravamenService {

    private seguroUrl = 'SeguroDesgravamen';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.seguroUrl = constantService.API_ENDPOINT + this.seguroUrl;
    }


    SetDesgravamen(filter: DesgravamenFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.seguroUrl + "/setDesgravamen", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }



    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}