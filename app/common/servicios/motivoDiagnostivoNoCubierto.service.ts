import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { MotivoDiagnosticoNoCubierto } from '../model/motivoDiagnosticoNoCubierto';
import { Plan } from '../model/plan';

import { ConstantService } from '../../utils/constant.service';

@Injectable()
export class MotivoDiagnosticoNoCubiertoService {

    private motivoDiagnosticoNoCubiertoUrl = 'motivoDiagnosticoNoCubierto';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.motivoDiagnosticoNoCubiertoUrl = constantService.API_ENDPOINT + this.motivoDiagnosticoNoCubiertoUrl;
    }

    getAll(): Observable<MotivoDiagnosticoNoCubierto[]> {
        return this.authHttp.get(this.motivoDiagnosticoNoCubiertoUrl)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}