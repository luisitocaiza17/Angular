import { Injectable, } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { Response } from '@angular/http';
import { ClaveContratoEntity } from '../../common/model/contrato';

@Injectable()
export class HangFireCobranzaReporteService {

    private srvUrl = 'cobranzaReporteController';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        this.srvUrl = constantService.API_ENDPOINT + this.srvUrl;
    }

    ReporteCuotasPendientesPago(filter: ClaveContratoEntity): Observable<boolean> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.srvUrl + "/CuotasPendientesPago", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractRespuestaGenerica(res: Response) {
        let body = res.json();
        return body.Datos || {};
    }

}