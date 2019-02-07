import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ClaveContratoEntity } from '../../common/model/contrato';
import { PaginationService } from '../../utils/pagination.service';
import { ConstantService } from '../../utils/constant.service';
import { AgenteVentaReasignacionCartera } from '../model/agenteVentaReasignacionCartera';

@Injectable()
export class ReasignacionCarteraService extends PaginationService {

    private reasignacionCarteraUrl = 'reasignacionCartera';
    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 20);
        this.reasignacionCarteraUrl = constantService.API_ENDPOINT + this.reasignacionCarteraUrl;
    }

    getInformacionCarteraVendedor(filter: ClaveContratoEntity): Observable<AgenteVentaReasignacionCartera> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reasignacionCarteraUrl + "/informacionCarteraVendedor", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}