import { Injectable, } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { FilterDocumentoFacturacion, DocumentoFacturacion } from '../../common/model/facturacion';


@Injectable()
export class ConsultaDocumentosFacturacionService extends PaginationService {

    private srvUrl = 'consultaDocumentosFacturacion';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.srvUrl = constantService.API_ENDPOINT + this.srvUrl;
    }

    GetDocumentosFacturacionPaginated(filtro: FilterDocumentoFacturacion): Observable<DocumentoFacturacion[]> {
        let body = JSON.stringify(filtro);
        return this.authHttp.postPaginated(this.srvUrl + "/GetDocumentosFacturacionPaginated/", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map(res => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }
}