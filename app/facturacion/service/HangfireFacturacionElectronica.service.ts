import { Injectable, } from '@angular/core';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { FilterDocumentoFacturacion, DocumentoFacturacion } from '../../common/model/facturacion';
import { ControlFacturaFilter } from '../../common/model/controlFactura';


@Injectable()
export class HangfireFacturacionElectronicaService extends PaginationService {

    private srvUrl = 'hangfireFactruacionElectronicaController';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.srvUrl = constantService.API_ENDPOINT + this.srvUrl;
    }

    EnviarReporteDocumentosFacturacionPorCorreo(filter: FilterDocumentoFacturacion): Observable<String> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.srvUrl + "/ReporteDocumentosFacturacionByFilters", body, null, "SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }

    EnviarReporteCuadreDocumentosElectronicos(filter: ControlFacturaFilter): Observable<String> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.srvUrl + "/GenerarReporteCuadreDocumentosElectronicos", body, null, "SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }

    generarArchivoProblemas(filtroProblema: ControlFacturaFilter): Observable<any>{
        let body = JSON.stringify(filtroProblema);
        return this.authHttp.post(this.srvUrl + "/DescargarExcelProblema", body, null, "SI")
            .map(this.extractRespGenerica)
            .catch(this.authHttp.handleError);
    }
}