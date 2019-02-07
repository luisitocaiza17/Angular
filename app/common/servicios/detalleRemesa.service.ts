import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { ConstantService } from '../../utils/constant.service';
import { Observable } from 'rxjs/Rx';

import { ContratoKey } from '../model/contrato';
import { DetalleRemesa, DetalleRemesaFilter } from '../model/detalleRemesa';

import { PaginationService } from '../../utils/pagination.service';
import { EmitirNotaEntity } from '../model/pago';

@Injectable()
export class DetalleRemesaService extends PaginationService {

    private detalleRemesaUrl = 'detalleRemesa';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.detalleRemesaUrl = this.constantService.API_ENDPOINT + this.detalleRemesaUrl;
    }

    getDetalleRemesa(key: ContratoKey): Observable<DetalleRemesa> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.detalleRemesaUrl + "/getDetalleRemesa", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getDetallesRemesas(key: ContratoKey): Observable<DetalleRemesa[]> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.detalleRemesaUrl + "/getDetallesRemesas", body)
            .map(this.extractData)
            .catch(this.authHttp.handleError);
    }

    getDetallesRemesasEnMora(key: ContratoKey): Observable<DetalleRemesa[]> {
        let body = JSON.stringify(key);
        return this.authHttp.post(this.detalleRemesaUrl + "/getDetallesRemesasEnMora", body, null, "SI")
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getCuotasPaginated(contratoKey: ContratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.postPaginated(this.detalleRemesaUrl + "/getCuotasPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    emitirNotaCredito(emitir: EmitirNotaEntity): Observable<any> {
        let body = JSON.stringify(emitir);
        return this.authHttp.postPaginated(this.detalleRemesaUrl + "/emitirNotaCrédito", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getDetallesRemesasForImpresionRecibosPaginated(filter: DetalleRemesaFilter): Observable<DetalleRemesa[]> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.detalleRemesaUrl + "/GetDetallesRemesaForImpresionDeRecibosPaginated", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getUltimaFechaFacturadoHasta(contratoKey: ContratoKey): Observable<any> {
        let body = JSON.stringify(contratoKey);
        return this.authHttp.post(this.detalleRemesaUrl + "/getUltimaFechaFacturadoHasta", body, null, "SI")
            .map(res => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}