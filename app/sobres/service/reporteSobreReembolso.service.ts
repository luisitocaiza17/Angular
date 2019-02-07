import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { SobreFilter } from '../model/SobreFilter';

@Injectable()
export class ReporteSobreReembolsoService extends PaginationService {

    private reportesUrl = 'reporteSobre';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.reportesUrl = constantService.API_ENDPOINT + this.reportesUrl;
    }

    generarReporteSobres(filter: SobreFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.reportesUrl + "/GenerarReporteSobres", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarReporteSimuladorConstitucion(): Observable<any> {
        return this.authHttp.get(this.reportesUrl + "/GenerarReporteSimuladorConstitucion", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }
}