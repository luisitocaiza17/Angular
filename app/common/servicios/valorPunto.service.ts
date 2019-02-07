import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ValorPunto, ValorPuntoFilter } from '../model/valorPunto';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';


@Injectable()
export class ValorPuntoService extends PaginationService {

    private valorPuntoUrl = 'valorPunto';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.valorPuntoUrl = constantService.API_ENDPOINT + this.valorPuntoUrl;
    }

    getValores(filter: ValorPuntoFilter): Observable<ValorPunto[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.valorPuntoUrl + "/getValores", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getValorPuntoCoorporativo(filter: ValorPuntoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.valorPuntoUrl + "/getValorPuntoCoorporativo", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    actualizarValorPunto(valorPunto: ValorPunto): Observable<any> {
        let body = JSON.stringify(valorPunto);
        return this.authHttp.post(this.valorPuntoUrl + "/actualizarValorPunto", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    actualizarValorPuntoCoorporativo(valorPunto: ValorPunto): Observable<any> {
        let body = JSON.stringify(valorPunto);
        return this.authHttp.post(this.valorPuntoUrl + "/actualizarValorPuntoCoorporativo", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    ingresarValorPunto(valorPunto: ValorPunto): Observable<any> {
        let body = JSON.stringify(valorPunto);
        return this.authHttp.post(this.valorPuntoUrl + "/ingresarValorPunto", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    obtenerFechaInicioValorPunto(valorPunto: ValorPunto): Observable<any> {
        let body = JSON.stringify(valorPunto);
        return this.authHttp.post(this.valorPuntoUrl + "/obtenerFechaInicioValorPunto", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }


    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}