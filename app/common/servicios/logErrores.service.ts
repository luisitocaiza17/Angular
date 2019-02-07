import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';
import { LogError, LogErrorFilter, LogErrorDetalleFilter, LogErrorDetalle } from '../model/LogError';

@Injectable()
export class LogErroresService extends PaginationService {

    private logErrorUrl = 'logErrorFacturas';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 10);
        this.logErrorUrl = constantService.API_ENDPOINT + this.logErrorUrl;
    }

    getProcesoPaginated(filter: LogErrorFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.logErrorUrl + "/getProceso", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize, null, "SI")
            .map((res) => this.extractRespuestaGenericaDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getCabeceraLogErrores(fechaProceso: string): Observable<LogError[]> {
        return this.authHttp.get(this.logErrorUrl + "/getCabeceraLogErrores/" + fechaProceso, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getProcesoDetallePaginated(filter: LogErrorDetalleFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.post(this.logErrorUrl + "/getDetalleProceso", body, null, "SI")
            .map((res) => this.extractRespuestaGenericaData(res))
            .catch(this.authHttp.handleError);
    }

    getDetalleErrores(numeroProceso: number): Observable<LogErrorDetalle[]> {
        return this.authHttp.get(this.logErrorUrl + "/getDetalleErrores/" + numeroProceso, null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    getTotalPendientes(): Observable<any> {
        return this.authHttp.get(this.logErrorUrl + "/getTotalPendientes", null, "SI")
            .map((res) => this.extractRespGenerica(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    
}