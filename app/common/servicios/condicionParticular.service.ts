import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { AppAuthHttp } from '../../seguridad/appAuthHttp';
import { Observable } from 'rxjs/Rx';

import { Movimiento, MovimientoFilter } from '../model/movimiento';
import { ConstantService } from '../../utils/constant.service';
import { PaginationService } from '../../utils/pagination.service';

@Injectable()
export class CondicionParticularService extends PaginationService {

    private movimientoUrl = 'condicionParticular';

    constructor(private authHttp: AppAuthHttp, private constantService: ConstantService) {
        super(1, 5);
        this.movimientoUrl = constantService.API_ENDPOINT + this.movimientoUrl;
    }

    getByFiltersPaginated(filter: MovimientoFilter): Observable<any> {
        let body = JSON.stringify(filter);
        return this.authHttp.postPaginated(this.movimientoUrl, body, this.paginationConstants.pageNumber, this.paginationConstants.pageSize)
            .map((res) => this.extractDataPaginated(res))
            .catch(this.authHttp.handleError);
    }

    descargarCondicionParticular(movimiento: Movimiento): any {
        return this.authHttp.getGetFile(this.movimientoUrl + "/descargar/" + movimiento.SucursalEmpresa
            + "/" + movimiento.NumeroMovimiento);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}