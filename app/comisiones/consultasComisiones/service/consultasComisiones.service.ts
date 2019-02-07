import { Injectable } from '@angular/core';
import { PaginationService } from '../../../utils/pagination.service';
import { AppAuthHttp } from '../../../seguridad/appAuthHttp';
import { ConstantService } from '../../../utils/constant.service';
import { Observable } from 'rxjs/Rx';
import { ResumenVendedorComision } from '../model/resumenVendedorComision';
import { ResumenVendedorComisionFilter } from '../model/resumenVendedorComisionFilter';
import { PaginationConstants } from '../../../utils/pagination';

@Injectable()
export class ConsultasComisionesService extends PaginationService {

    private serviceUrl = 'comisiones';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10);
        this.serviceUrl = this.constantService.API_ENDPOINT + this.serviceUrl;
    }

    getVendoresPorSala(filter: ResumenVendedorComisionFilter): Observable<ResumenVendedorComision[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.serviceUrl + "/resumenVendedores/", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getVendoresPorSalaPaginated(filter: ResumenVendedorComisionFilter): Observable<ResumenVendedorComision[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.serviceUrl + "/resumenVendedoresPaginated/", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

}
