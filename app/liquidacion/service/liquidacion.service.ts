import { Injectable, } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { Liquidacion } from '../../liquidacion/model/Liquidacion';
import { ContratoKey } from '../../common/model/contrato';

@Injectable()
export class LiquidacionService extends PaginationService {

    private srvUrl = 'liquidaciones';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.srvUrl = constantService.API_ENDPOINT + this.srvUrl;
    }

    CargarPantallaInicial(filtro: ContratoKey): Observable<Liquidacion> {
        let body = JSON.stringify(filtro);
        return this.authHttp.post(this.srvUrl + "/cargarPantallaInicial", body, null, "SI")
            .map(res => this.extractRespuestaGenericaData(res))
            .catch(this.authHttp.handleError);
    }
}