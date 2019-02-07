import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';

import { Observable } from 'rxjs/Rx';
import {Grupo, GrupoSearch} from '../model/grupo';

import { ConstantService } from '../../utils/constant.service';
import {CORP_TerminosCondiciones} from '../model/terminoscondiciones';



@Injectable()
export class CorredoresTerminosCondicionesService {

    private grupoUrl = 'terminoscondiciones';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.grupoUrl = constantService.API_ENDPOINT + this.grupoUrl;
    }


    TerminosCondicionesLista(): Observable<CORP_TerminosCondiciones[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresTerminosCondicionesLista')
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    TerminosCondicionesPorID(TerminosCondicionesID: number): Observable<CORP_TerminosCondiciones[]> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresTerminosCondicionesPorID?TerminosCondicionesPorID=' + TerminosCondicionesID)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    TerminosCondicionesCrearActualizar(terminoscondiciones: CORP_TerminosCondiciones): Observable<boolean> {
        const body = JSON.stringify(terminoscondiciones);
        return this.authHttp.post(this.grupoUrl + '/CorredoresTerminosCondicionesCrearActualizar', body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    TerminosCondicionesPublicar(TerminosCondicionesID: number): Observable<boolean> {
        return this.authHttp.get(this.grupoUrl + '/CorredoresTerminosCondicionesPublicar?TerminosCondicionesID=' + TerminosCondicionesID)
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        console.log(res);
        let body = res.json();
        console.log(body);
        return body.Datos || [];
    }
}
