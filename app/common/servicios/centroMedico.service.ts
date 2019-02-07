import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { CentroMedico } from '../model/centroMedico';

@Injectable()
export class CentroMedicoService {

    private centromedicoUrl = 'centroMedico';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.centromedicoUrl = constantService.API_ENDPOINT + this.centromedicoUrl;
    }

    getAllForCatalogos(): Observable<CentroMedico[]> {
        return this.authHttp.get(this.centromedicoUrl + "/getAllForCatalogos")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}