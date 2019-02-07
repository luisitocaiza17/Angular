import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { MovimientoListaEntity} from '../model/movimientoLista';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { ContratoKey} from '../model/contrato';

@Injectable()
export class MovimientoListaService extends PaginationService{

    private movimientoListaUrl = 'movimientoLista';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.movimientoListaUrl = constantService.API_ENDPOINT + this.movimientoListaUrl;
    }

    createMovimientoLista(movimientoLista: MovimientoListaEntity): Observable<any> {
        let body = JSON.stringify(movimientoLista);
        return this.authHttp.post(this.movimientoListaUrl + "/insertMovimientoLista", body,null,"SI")
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}