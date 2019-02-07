import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { DocumentoFacturacion, ResultadoFacturarCobrosSaludPay, ParaReversar } from '../model/facturacion';
import { CotizacionFilter, Cotizacion } from '../model/cotizacion';
import { FiltroFechaDesdeHasta } from '../model/genericos';
import { ControlFacturaFilter } from '../model/controlFactura';


@Injectable()
export class FacturacionElectronicaService extends PaginationService {

    private facturacionUrl = 'facturacionElectronica';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1,10); 
        this.facturacionUrl = constantService.API_ENDPOINT + this.facturacionUrl;        
    }

    validarEInsertarInformacionEnTablasFacturacion(): Observable<string> {
        return this.authHttp.get(this.facturacionUrl + "/GenerarInformacionFacturacionElectronica", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    reprocesoFacturacionElectronica(reversar: ParaReversar): Observable<string> {
        let body = JSON.stringify(reversar);
        return this.authHttp.post(this.facturacionUrl + "/ReprocesoFacturacionElectronica", body, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    generarArchivoProblemas(filtroProblema: ControlFacturaFilter): Observable<any>{
        let body = JSON.stringify(filtroProblema);
        return this.authHttp.post(this.facturacionUrl + "/DescargarExcelProblema", body, null, "SI");
    
    }
}