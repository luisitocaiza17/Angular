import { Injectable } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { VendedorFilter } from '../model/vendedorFilter';

@Injectable()
export class ReporteComercialService extends PaginationService {

    private reporteComercialUrl = 'reporteComercial';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.reporteComercialUrl = constantService.API_ENDPOINT + this.reporteComercialUrl;
    }

    descargarReporteVendedores(filtro: VendedorFilter): Observable<any> {
        let body = JSON.stringify(filtro);
        return this.authHttp.post(this.reporteComercialUrl + "/ReporteVendedores", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    descargarReporteVendedoresC(filtro: VendedorFilter): Observable<any> {
        let body = JSON.stringify(filtro);
        return this.authHttp.post(this.reporteComercialUrl + "/ReporteVendedoresC", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

}