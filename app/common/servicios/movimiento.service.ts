import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Movimiento, MovimientoFilter, ReporteMovimiento, ReporteMovimientoFilter, TipoMovimiento } from '../model/movimiento';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

import { ContratoKey} from '../model/contrato';


@Injectable()
export class MovimientoService extends PaginationService {

    private movimientoUrl = 'movimiento';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.movimientoUrl = constantService.API_ENDPOINT + this.movimientoUrl;
    }

    getByFiltersPaginated(filter: MovimientoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.movimientoUrl + "/filter", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getReporte(filter: ReporteMovimientoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.movimientoUrl + "/getReporte", body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    getTipoMovimientos(): Observable<TipoMovimiento[]> {
        return this.authHttp.get(this.movimientoUrl + "/getTipoMovimientos")
            .map((res) => this.extractData(res))
            .catch(this.authHttp.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

}