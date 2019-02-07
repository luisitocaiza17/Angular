import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { FilterDocumentoFacturacion, DocumentoFacturacion, DetalleDocumentoFe03Filter, DetalleDocumentoFacturacion, ContadorEstadosDocumentosFacturacion} from '../model/facturacion';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class ConsultasFacturacionElectronicaService extends PaginationService {

    private facturacionUrl = 'consultasFacturacionElectronica';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.facturacionUrl = constantService.API_ENDPOINT + this.facturacionUrl;        
    }

    getDocumentosFacturacionByFiltersPaginated(filter: FilterDocumentoFacturacion): Observable<DocumentoFacturacion[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.facturacionUrl + "/GetFacturasByFiltersPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getDetallesDocumentoFacturacionByFilters(filter: DetalleDocumentoFe03Filter): Observable<DetalleDocumentoFacturacion[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.facturacionUrl + "/GetDetalleDocumentosFacturacionByFilters", body, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getCantidadFacturasEnDiferentesEstados(numeroEnvio: number, secuencialEnvio: number): Observable<ContadorEstadosDocumentosFacturacion> {
        let body = JSON.stringify(numeroEnvio);
        return this.authHttp.get(this.facturacionUrl + "/GetCantidadFacturasEnDiferentesEstados?numeroEnvio=" + numeroEnvio + "&secuencialEnvio=" + secuencialEnvio, null, "SI")
            .map((res) => this.extractRespuestaGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractRespuestaGenerica(res: Response) {
        let body = res.json();
        return body.Datos || {};
    }
}