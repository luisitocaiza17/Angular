import { Injectable, } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { FilterDocumentoFacturacion, DocumentoFacturacion } from '../../common/model/facturacion';


@Injectable()
export class ReporteDocumentosFacturacionDirectoSri extends PaginationService {

    private srvUrl = 'ReportesDocumentosFacturacionDirectoSri';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.srvUrl = constantService.API_ENDPOINT + this.srvUrl;
    }

    GetReporteDocumentosFacturacionDirectoSri(filter: FilterDocumentoFacturacion): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postGetFile(this.srvUrl + "/GetReporteDocumentosFacturacionDirectoSri", body, null, "SI");
    }
}